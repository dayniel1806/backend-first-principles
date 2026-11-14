const http = require('http');
const router = require('./router');


router.get("/", (req, res) => {
    res.writeHead(200, {"Content-Type" : "application/json"});
    res. end(JSON.stringify({message : "home"}));
});

router.get("/users/:id", (req, res) => {
    res.writeHead(200, {"Content-Type" : "application/json"});
    res.end(JSON.stringify({id:req.params.id, query:req.query})); 
});


router.get("/users/:id/posts/:postId", (req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ params: req.params, query: req.query }));
});

router.post("/users", (req,res) => {
    res.writeHead(201);
    res.end({id:req.params.id, query:req.query});
})




http.createServer((req,res) => router.handle(req,res)).listen(3000)