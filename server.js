const http = require("http");
http.createServer((request, response) => {
    response.writeHead(200, {"Content-Type": "text/plain"})
    console.log("The server is running!")
    response.end("Success")
}).listen(5000)