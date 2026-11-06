const http = require("http");
const fs = require("fs")
const port = 3000;
const path = require("path");



const home = path.join(__dirname, "index.html");

const server = http.createServer((req, res) => {
  fs.readFile(home, (error, data) => {
  if (error) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Error: File Not Found");
  } else {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(data);
  }
});
})

server.listen(port, function(error){
  if(error){
    console.log("Something went wrong!", error)
  }else{
    console.log("Server is listening on port " + port)
  }
})