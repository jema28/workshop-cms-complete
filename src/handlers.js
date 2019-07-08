const fs = require('fs');
const path = require('path');
const querystring = require('querystring')

const handleHomeRoute = (request, response) => {
    const filePath = path.join(__dirname, '..', 'public', 'index.html');
    fs.readFile(filePath, (error, file) => {
        if (error) {
            console.log(error);
            response.writeHead(500, {'Content-Type': 'text/html'});
            response.end("<h1>Sorry, we've had a problem on our end</h1>");
        } else {
            response.writeHead(200, {'Content-Type': 'text/html'});
            response.end(file);
        }
    });
};

const handlePublic = (request, response, url) => {
    const extension = url.split('.')[1];
    const extensionType = {
        html: 'text/html',
        css: 'text/css',
        js: 'application/javascript',
        ico: 'image/x-icon',
        jpg: 'image/jpeg',
        png: 'image/png'
    };
    const filePath = path.join(__dirname, '..', url);

    fs.readFile(filePath, (error, file) => {
        if (error) {
            console.log(error);
            response.writeHead(404, {'Content-Type': 'text/html'});
            response.end('<h1>404 file not found</h1>');
        } else {
            response.writeHead(200, {'Content-Type': extensionType[extension]});
            response.end(file);
        }
    });
};

const getPosts = (request, response) => {
    fs.readFile(`${__dirname}/posts.json`, "utf-8", (error, posts) => {
        if (error) {
            throw error
        }
        response.writeHead(200, {"Content-Type": "text/json"});
        response.write(posts);
        response.end();
    })
}

const writePosts = (request, response) => {
    let data = ''
    request.on('data', chunk => {
        data += chunk
    })
    request.on('end', () => {
        const newPost = querystring.parse(data)
        // console.log('newPost', newPost)

        fs.readFile(`${__dirname}/posts.json`, "utf8", (error, data) => {
            if (error) {
                console.log(error);
            }
            const blogposts = JSON.parse(data);
            // console.log('blogposts:', blogposts)
            const currentTime = Date.now();
            blogposts[currentTime] = newPost.post;

            fs.writeFile(`${__dirname}/posts.json`, JSON.stringify(blogposts), error => {
                if (error) {
                    console.log(error);
                }
                response.writeHead(302, {"Location": "/"});
                response.end();
            });
        });
    })
}

module.exports = {
    handleHomeRoute,
    handlePublic,
    getPosts,
    writePosts
};