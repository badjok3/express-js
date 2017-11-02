const fs = require('fs');
const db = require('../config/dataBase');

module.exports = (req, res) => {

    let index = 1;
    let currentMovie;
    let currentMovieId = 1;

    for (let movie in db) {
        db[movie]['id'] = index;
        index++;

        if (req.pathname === `/movies/details/${index}`) {
            currentMovieId = index;
            currentMovie = db[movie];
        }
    }

    if (req.pathname === `/movies/details/${currentMovieId}` && req.method === 'GET') {
        fs.readFile('./views/details.html', (err, data) => {
            if (err) {
                console.log(err);
                return
            }

            data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', `<div class="content">
    <img src="${unescape(currentMovie.moviePoster)}" alt=""/>
    <h3>Title  ${unescape(currentMovie.movieTitle)}</h3>
    <h3>Year ${unescape(currentMovie.movieYear)}</h3>
    <p> ${unescape(currentMovie.movieDescription)}</p>
</div>
`);

            data = data.toString().replace(/\+/g, ' ');

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
        })
    }
}