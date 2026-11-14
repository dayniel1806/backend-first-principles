const router = require('./router');
const http = require('http');


const users = [   //The array of users
    {id: "1", name: "Daniel", role:"admin"},
    {id: "2", name: "Gold", role:"user"},
    {id: "3", name: "Temilade", role: "user"},
    {id: "4", name: "Demilade", role: "user"},
    {id: "5", name: "Happiness", role: "user"},
    {id: "6", name: "Slave", role: "admin"},
];


//HELPER FUNCTIONS TO REPEAT REPITION OF WRITING AND SETTING HEADERS
function sendJSON(res, status, body){   //RETURNS RESPONSE, STATUS CODE AND RESPONSE BODY
    res.writeHead(status, {"Content-Type": "application/json" });
    res.end(JSON.stringify(body))
}
function markDepreciated(res){     //RETURNS HEADERS FOR THE DEORECIATING VERSION1
    res.setHeader("Depreciation","true")
    res.setHeader("Link", '</v2/users>; rel="successor-version"')
    res.setHeader("Sunset", "Wed, 31 Mar 2027 22:59:59 GMT")
} 




//HANDLER FUNCTIONS FOR VERSION 1
router.get("/v1/users", (req,res) => {       
    markDepreciated(res)
    let result = users;
    if (req.query.role){
        result  = result.filter(u =>u.role === req.query.role)
    }
    if (req.query.limit) {
        result = result.slice(0, Number(req.query.limit))
    }
    sendJSON(res,200,result)
    
})
router.get("/v1/users/:id", (req,res) => {
    markDepreciated(res)
    let ans = users.find(u => u.id === req.params.id);
    if(ans){
        sendJSON(res,200,ans)
    }else{
        sendJSON(res,404, {error: "USER NOT FOUND!"})
    }
})

router.delete("/v1/users/:id", (req, res) => {
    markDepreciated(res)
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
        return sendJSON(res, 404, { error: "USER NOT FOUND!" });
    }
    users.splice(index, 1);
    res.writeHead(204);
    res.end();
});

//HANDLER FUNCTIONS FOR VERSION 2
router.get("/v2/users", (req,res) => {
    let result =users;
    if (req.query.role){
        result = result.filter(u =>u.role === req.query.role)
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const total = result.length; 
    const totalPages = Math.ceil(total/limit) 
    
    const startIndex = (page - 1) * limit;
    result = result.slice(startIndex, startIndex + limit);

    const ans = {
        "data": result,
        "total": total,
        "currentPage": page, 
        "limit": limit,
        "totalPages": totalPages
    }
    sendJSON(res,200, ans)
})



http.createServer((req,res)=> router.handle(req,res)).listen(3000)