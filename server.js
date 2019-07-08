const http = require('http');
const fs = require('fs');
/* --- SOLUTION --- */
const querystring = require('querystring');
/* --------------- */

const handler = (request, response) => {
    const endpoint = request.url;
    if (endpoint === '/') {
        fs.readFile(__dirname + '/public/index.html', (error, file) => {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file);
            response.end();
        });
    } else if (endpoint === '/node') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('I love node!');
        response.end();
    } else if (endpoint === '/girls') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Node Girls is cool!");
        response.end();
        /* --- SOLUTION --- */
    } else if (endpoint === '/create-post') {
        message = "";
        request.on("data", chunk => {
            message += chunk;
        });
        request.on("end", () => {
            response.writeHead(302, {"Location": "/"});
            message = querystring.parse(message);
            console.log(message.blogpost);
            response.end();
        });
        /* --------------- */
    } else {
        const filePath = `${__dirname}/public${endpoint}`;
        const fileExtensionArray = endpoint.split('.');
        const fileExtension = fileExtensionArray[1];

        fs.readFile(filePath, (error, file) => {
            response.writeHead(200, {
                "Content-Type": "text/" + fileExtension
            });
            response.write(file);
            response.end();
        });
    }
}

const server = http.createServer(handler);

server.listen(3000, () => {
    console.log("Server is listening on port 3000. Ready to accept requests!");
});
