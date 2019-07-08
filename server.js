const http = require('http');

const handler = require('./src/handler.js');

const server = http.createServer(handler);

server.listen(3000, () => {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});
