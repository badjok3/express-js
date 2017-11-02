const fs = require('fs');
const qs = require('querystring');
const db = require('../config/dataBase');

function getCreationForm(req, res) {
    fs.readFile('./views/addMovie.html', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(data);
        res.end();
    })
}
module.exports = (req, res) => {
    if (req.pathname === '/addMovie' && req.method === 'GET') {
        getCreationForm(req, res)
    } else if (req.pathname === '/addMovie' && req.method === 'POST') {
        let body = [];
        req.on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();

            let movieBody = qs.parse(body);
            let validMovieFlag = true;

            for(let prop in movieBody) {
                if(movieBody[prop] === '') {
                    validMovieFlag = false;
                }
            }

            if(validMovieFlag) {
                db.push(movieBody);
                fs.readFile('./views/addMovie.html', (err, data) => {
                    if(err) {
                        console.log(err);
                        return
                    }

                    data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', '<div id="succssesBox"><h2 id="succssesMsg">Movie Added</h2></div>')

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.write(data);
                    res.end();
                })
            } else {
                fs.readFile('./views/addMovie.html', (err, data) => {
                    if(err) {
                        console.log(err);
                        return
                    }

                    data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', '<div id="errBox"><h2 id="errMsg">Please fill all fields</h2></div>')

                    res.writeHead(200, {
                        'Content-Type': 'text/html'
                    });

                    res.write(data);
                    res.end();
                })
            }
        });

    }
    else {
        return true
    }
}