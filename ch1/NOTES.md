## Lesson from chapter 1 excersises ##
I was able to build simple node js servers. One rendering an html page and the other testing and fixing CORS.

1. From my understanding and current putting into practice: when I ran node server.js, the server started running on localhost 3000 and when opened on the browser, it rendered the message and on the vs code console where I ran node server.js, the GET request shows with the different headers. Meanwhile running curl -i localhost:3000 on vs code terminal  sends a GET and prints the headers

## CORS TESTING AND FIXING
2. Also tried accessing the server from a different source with 
## fetch("http://localhost:3000").then(r => r.json()).then(console.log) 
but got a CORS error. the origin is not allowed by Access-Control-Allow-Origin. Which i fixed by setting the header
## Access-Control-Allow-Origin to * 
which allowed the server to be accessible from any source thereby solving the CORS errror.


3. ## Fixing the CORS error of allow methods and headers during prerflight
So when the request isnt a simple one i.e PUT, POST, DELEETE,  the browser sends a preflight request using the OPTIONS method. The server then responds and shows the reponse onlt if the access control header, origin and methods used are correctly allowed.
CORS also blocks methods and headers that weren't set in the 
## Access-Control-Allow-Headers and Access-Control-Allow-Methods 
but can be fixed by setting them.

ALSO NOTED AND RECALLED THAT CORS IS A BROWSER SECURITY RULE THAT PREVENTS UNAUTHORIZED SOURCES FROM VIEWING THE RESPONSE EVEN THOUGH IT LEFT THE SERVER. SO WHEN curl WAS CALLED IN THE TERMINAL, EVEN BEFORE THE ACCESS CONTROL HEADER WAS SET TO *, curl COULD ACCESS THE RESPONSE. 

4. * doesn’t work when requests carry cookies.