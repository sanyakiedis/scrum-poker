const path = require("path");
const WebSocket = require('ws');
const server = new WebSocket.Server({port: 8081});


server.on('connection', ws => {
    ws.on('message', message => {
        // server.clients.forEach(client => {
            // client.send('hola!');
        // })
    });
    ws.send(JSON.stringify('hola!'));
});