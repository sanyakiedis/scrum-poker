const WebSocket = require('ws');
const server = new WebSocket.Server({port: 8082});

console.log('server started');

const rooms = {};

server.on('connection', ws => {
    console.log('ws connection', server.clients.size);
    
    ws.on('message', message => {
        const data = JSON.parse(message);
        console.log('message', data);
        console.log('rooms', rooms);
        
        
        const isRoomExists = data.room in rooms;
        const isUserExist = isRoomExists && data.user in rooms[data.room];

        switch (data.command) {
            case 'addUser':
                addUser(data, isRoomExists);
                break;
            case 'deleteUser':
                deleteUser(data, isUserExist);
                break;
            case 'setRate':
                setRate(data, isUserExist);
                break;
            default:
                break;
        }
        server.clients.forEach(client => {
            client.send(JSON.stringify(rooms));
        });
        console.log('-----------------');
    });

    

    ws.send(JSON.stringify(rooms));
});


function addUser(msg, isRoomExists) {
    if (!isRoomExists) {
        rooms[msg.room] = {};
    }
    rooms[msg.room][msg.user] = {
        user: msg.user,
        rate: msg.rate,
    };
}

function deleteUser(msg, isUserExist) {
    if (isUserExist) {
        if (Object.keys(rooms[msg.room]).length === 1) {
            delete rooms[msg.room];
            console.log('Room deleted', msg.room);
        } else {
            delete rooms[msg.room][msg.user];
            console.log('User deleted', msg.room, msg.user);
        }
    }
}

function setRate(msg, isUserExist) {
    if (isUserExist) {
        rooms[msg.room][msg.user].rate = msg.rate;
    }
}

