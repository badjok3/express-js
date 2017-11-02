const fs = require('fs');
const db = require('../config/dataBase');

function generateMovies(req, res) {
    fs.readFile('./views/viewAll.html', (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        let newData = '';
        let index = 1;
        for (let movie in db) {
            index++;
            let currentMovieString = `<a class="movie" href="/movies/details/${index}"> <img class="moviePoster" src="${unescape(db[movie].moviePoster)}"/> </a>`;
            newData += currentMovieString;

        }

        data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', newData);

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        res.write(data);
        res.end();
    })
}
module.exports = (req, res) => {
    if(req.pathname === '/viewAllMovies' && req.method === 'GET') {
        generateMovies(req, res);
    } else {
        return true
    }
}