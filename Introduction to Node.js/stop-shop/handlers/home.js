const url = require('url');
const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
   req.pathname = req.pathname || url.parse(req.url).pathname;

    if(req.pathname === '/' && req.method === 'GET') {
        let filePath = path.normalize(
            path.join(__dirname, '../views/home/index.html')
        );

        fs.readFile(filePath, (err, data) => {
            if(err) {
                console.log(err);

                res.write('404 not found!');
                res.end();
                return;
            }

            res.write(data);
            res.end();
        })
    } else {
        return true;
    }
};