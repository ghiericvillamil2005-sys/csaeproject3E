const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3001;
const noticesPath = path.join(__dirname, "notices.json");

const server = http.createServer((request, response) => {
    if (request.method === "GET" && request.url === "/") {
        response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
        response.end("STNHS Notices Server");
        return;
    }

    if (request.method === "GET" && request.url === "/api/notices") {
        fs.readFile(noticesPath, "utf8", (error, contents) => {
            if (error) {
                response.writeHead(500, { "Content-Type": "application/json" });
                response.end(JSON.stringify({ error: "Unable to read notices." }));
                return;
            }

            response.writeHead(200, { "Content-Type": "application/json" });
            response.end(contents);
        });
        return;
    }

    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("404 - Route not found");
});

server.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
