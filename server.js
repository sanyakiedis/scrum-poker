const path = require("path");
const WebSocket = require('ws');
const server = new WebSocket.Server({port: 8082});

console.log('serer started');

server.on('connection', ws => {
    console.log('ws connection');
    
    ws.on('message', message => {
        // server.clients.forEach(client => {
            // client.send('hola!');
        // })
    });
    ws.send(JSON.stringify('hola!'));
});