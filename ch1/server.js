const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req.method, req.url);
    console.log(req.headers);

    //To fix te CORS error
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method == "OPTIONS"){
        res.writeHead(204);
        return res.end();
    }
    res.writeHead(200, {"Content-Type" : "application.json"});
    
    res.end(JSON.stringify({message: "Hello from raw http"}));
});

server.listen(3000, ()=> console.log("Running on: 3000"));