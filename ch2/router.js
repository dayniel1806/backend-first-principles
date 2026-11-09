const routes = [];

function register(method, path, handler) {  // GET/POST/PUT/DELETE, localhost:3000/users, function (req,res)
    routes.push({method,path,handler})
}

function match(routePath, pathname){
    const routeParts = routePath.split("/");   // for the /users/:id => ["...",users, :id].      ["3000", users, id]
    const pathParts = pathname.split("/");   // for the /users/43 => ["...", users, 43]          ["3000" "users", "daniel", ]

    if (routeParts.length !== pathParts.length){ // if length of the array of the splited words are not the same return null
        return null
    }

    const params = {};

    for (let i = 0; i < routeParts.length; i++){  // loop through the array
        if (routeParts[i].startsWith(":")){ 
            // if the first word of the element or value starts with : that means dynamic routing therefore split it by removing the : and using the dynamic route( in this case "id")
            params[routeParts[i].slice(1)] = pathParts[i] // params dictionary will therefore take [id] = the dynamic part of other in this case 43 (params[id] = "43")
        }else if (routeParts[i] !== pathParts[i]){  //whatever corresponding element in the array i.e corresponding route that isn't the same should return null
            return null
        }
    }
    return params
}

// console.log(match("localhost:3000/users/:id","localhost:3000/users/42?role = admin"))
// console.log(match("localhost:3000/users/:id", "localhost:3000/users/42"))


module.exports = {
    get: (path, handler) => register("GET", path, handler),
    post: (path, handler) => register("POST", path, handler),
    delete: (path, handler) => register("DELETE", path, handler), 
    put: (path, handler) => register("PUT", path, handler),

    handle(req, res){
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", "Content-Type");

        if (req.method === "OPTIONS") {
            res.writeHead(204);
            return res.end();
        }

        const url = new URL(req.url, "http://localhost"); 
        let pathname = url.pathname; 
        const allowed =[]; 

        if (pathname.length > 1 && pathname.endsWith("/")) { // if the pathname exists and ends with a / i.e localhost:3000/users/ should be treated as localhost:3000/users
            pathname = pathname.slice(0, -1);   // remove the last character
        }

        for (const route of routes){   // go through the list of routes 
            const params = match(route.path,pathname);   // we use the match function to get the id and query from the pathname
            if(!params) continue; // if there is no id and query, we continue since match() returns null when there is no match
            if (route.method !== req.method){ // if the id and query exists, but the method isn't in the list of routes,
                allowed.push(route.method); // we push the allowed method to the allowed list
                continue     // then we continue to the next route in the list of routes since we have found a match but the method isn't allowed  
            }

            req.params = params;   
            req.query = Object.fromEntries(url.searchParams);
            return route.handler(req,res);
        }
        if (allowed.length>0){ //if there is any unallowed method that has been pushed in to the allowed list meaning the method isnt allowed even though the resource in the route does exist 
            res.writeHead(405, {Allow: allowed.join(", ")})    // then return 405 error: unallowed method and shows the allowed method for that resource
            return res.end();
        }

        res.writeHead(404)    //if we go through the entire list and we dont find the routes, we return not found.
        res.end("NOT FOUND")
    
    }
}