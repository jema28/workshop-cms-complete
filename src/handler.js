const fs = require('fs');
const querystring = require('querystring');

const handler = (request, response) => {
    const url = request.url;
    if (url === '/') {
        fs.readFile(`${__dirname}/../public/index.html`, (error, file) => {
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write(file);
            response.end();
        });
    } else if (url === '/node') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write('I love node!');
        response.end();
    } else if (url === '/girls') {
        response.writeHead(200, {"Content-Type": "text/html"});
        response.write("Node Girls is cool!");
        response.end();
    } else if (url === '/create-post') {
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
    } else {
        const filePath = `${__dirname}/../public${url}`;
        const fileExtensionArray = url.split('.');
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

module.exports = handler;