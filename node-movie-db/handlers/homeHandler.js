const fs = require('fs');
const filePath = './views/home.html';

module.exports = (req, res) => {
    if(req.pathname === '/' && req.method === 'GET') {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if(err) {
                console.log(err);
                return
            }

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
        })
    } else {
     return true
    }
}