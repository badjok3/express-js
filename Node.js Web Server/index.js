const http = require('http');
const url = require('url');
const port = 3000;

const handlers = require('./handlers');

http.createServer((req, res) => {
    req.pathname = url.parse(req.url).pathname;

   for(let handler of handlers) {
       let response = handler(req, res)

       if(!response) {
           break;
       }
   }
}).listen(port);

console.log('Running on port ' + port);