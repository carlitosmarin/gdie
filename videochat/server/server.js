const webSocketServer = require('websocket').server;
const http = require('http');

const debugMode = process.argv[2] && process.argv[2] === '-d' ? 1 : 0;

let clients = [];
let nameHelpers = {};
let connectedTo = {};

function initServer () {
    listenConnections(createWebServer());
}

function createWebServer () {
    // HTTP Server
    let server = http.createServer(function(request, response) {});
    server.listen(8080, function() {
        if (debugMode) console.log((new Date()) + " Server is listening on port " + 8080);
    });
    // WebServer
    return new webSocketServer({ httpServer: server });
}

function listenConnections (webServer) {

    webServer.on('request', function(request) {
        let connection = request.accept(null, request.origin);
        let index = clients.push(connection) - 1;
        let params = request.resourceURL.query;

        sendId(index);
        welcomeRequest(index, params);
        sendCurrentHelpers(connection);

        connection.on('message', function(message) {
            if (message.type === 'utf8') handleMessage(index, message.utf8Data);
        });

        connection.on('close', function() {
            sayGoodbye(index);
            delete nameHelpers[index];
            delete connectedTo[index];
            clients.splice(index, 1);
            connection.close();
        });
    });
}

function sendId(index) {
    let msg = {
        type: "acceptId",
        data: index
    };

    clients[index].send(JSON.stringify(msg))
}

function welcomeRequest(index, params) {
    let msg = {
        type: "welcome",
        data: {
            id: index,
            name: (params && params.name) || 'jon'
        }
    };
    nameHelpers[index] = (params && params.name) || 'Anonymous';

    clients.forEach(function (connection) {
        connection.send(JSON.stringify(msg));
    })
}

function sendCurrentHelpers(connection) {
    for (var index in nameHelpers) {
        let msg = {
            type: "welcome",
            data: {
                id: index,
                name: nameHelpers[index]
            }
        };

        connection.send(JSON.stringify(msg));

        if(connectedTo[index]) connection.send(JSON.stringify({ type: "disabled", data: index }));
    }
}

function sayGoodbye(index) {
    let msg = {
        type: "goodbye",
        data: index
    };

    clients.forEach(function (connection) {
        connection.send(JSON.stringify(msg));
    })
}

function handleMessage(index, data) {
    let msg = JSON.parse(data);
    switch(msg.type) {
        case 'request':
            disableRequest(index);
            acceptRelation(index, msg.target);
            break;
        case 'message':
            sendMessageClient(msg.id, msg.message);
            break;
        default:
            break;
    }
}

function disableRequest(index) {
    let msg = {
        type: "disabled",
        data: index
    };

    clients.forEach(function (connection) {
        connection.send(JSON.stringify(msg));
    })
}

function acceptRelation(index, target) {
    let msg = { type: "onCall" };

    connectedTo[index] = target;
    clients[index].send(JSON.stringify(msg));

    connectedTo[target] = index;
    msg.from = index;
    clients[target].send(JSON.stringify(msg));
}

function sendMessageClient(id, message) {
    let msg = {
        type: "message",
        data: message
    };

    clients[connectedTo[id]].send(JSON.stringify(msg));
}

initServer();