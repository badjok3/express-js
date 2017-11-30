const fs = require('fs');

function fileType(dataString) {
    let dataTypes = {
        '.js': 'application/javascript',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.ico': 'image/x-icon'
    }

    for (let type in dataTypes) {
        if (dataString.endsWith(type)) {
            return dataTypes[type]
        }
    }
}

function iconHandler(req, res) {
    fs.readFile('./public/images/favicon.ico', (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        res.writeHead(200, {
            'Content-Type': 'image/x-icon'
        })

        res.write(data);
        res.end()
    })
}

function resData(req, res) {
    fs.readFile('.' + req.pathname, (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        res.writeHead(200, {
            'Content-Type': fileType(req.pathname)
        })

        res.write(data);
        res.end();
    })
}

module.exports = (req, res) => {
    if (req.pathname === '/favicon.ico' && req.method === 'GET') {
        iconHandler(req, res);
    } else if (req.pathname.startsWith('/public/') && req.method === 'GET') {
        resData(req, res);
    } else {
        return true
    }
}