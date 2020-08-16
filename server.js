const WebSocket = require('ws');
const server = new WebSocket.Server({port: 9000});

console.log('server started');

const rooms = {};

server.on('connection', ws => {
    console.log('New connection! Counter:', server.clients.size);
    console.log('-----------------');
    
    ws.on('message', message => {
        const data = JSON.parse(message);
        console.log('New message:', data);
        
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
    console.log(msg.user, 'added to room', msg.room);
}

function deleteUser(msg, isUserExist) {
    if (isUserExist) {
        if (Object.keys(rooms[msg.room]).length === 1) {
            delete rooms[msg.room];
            console.log(msg.room, 'room deleted');
        } else {
            delete rooms[msg.room][msg.user];
            console.log(msg.user, 'deleted from room', msg.room);
        }
    }
}

function setRate(msg, isUserExist) {
    if (isUserExist) {
        rooms[msg.room][msg.user].rate = msg.rate;
        console.log(msg.user, 'at room', msg.room, 'set rate', msg.rate);
    }
}

