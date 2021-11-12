const WebSocket = require('ws');
const fs = require('fs');
const http = require('http');
const WSserver = new WebSocket.Server({port: 9000});


const hostname = '127.0.0.1';
const port = 3000;

const StaticServer = http.createServer((req, res) => {
    const path = req.url !== '/' ? req.url : 'index.html';
    fs.readFile(__dirname + '/build/' + path, function (err,data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            return;
        }
        res.writeHead(200);
        res.end(data);
    });
});

StaticServer.listen(port, hostname, (a) => {
    console.log(`Server running at http://${hostname}:${port}/`);
});

console.log('server started');

const rooms = {};

WSserver.on('connection', ws => {
    console.log('New connection! Counter:', WSserver.clients.size);
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
            case 'resetRates':
                resetRates(data, isRoomExists);
                break;
            default:
                break;
        }
        WSserver.clients.forEach(client => {
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

function resetRates(msg, isRoomExists) {
    if (isRoomExists) {
        Object.values(rooms[msg.room]).forEach((user) => user.rate = null);
        console.log(msg.user, 'at room', msg.room, 'reseted rates');
    }
}