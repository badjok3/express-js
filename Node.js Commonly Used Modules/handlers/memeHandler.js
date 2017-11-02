const fs = require('fs');
const db = require('../config/dataBase');
const url = require('url');
const qs = require('querystring');
const formidable = require('formidable');
const shortId = require('shortId');
const request = require('request');
const $ = require('jquery');

function memeGenerator(id, title, memeSrc, description, privacy) {
    return {
        id: id,
        title: title,
        memeSrc: memeSrc,
        description: description,
        privacy: privacy,
        dateStamp: Date.now()

    }
}

function downloadMeme(uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
}

function viewAll(req, res) {
    fs.readFile('./views/viewAll.html', (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        let allMemesData = '';

        for (let meme of db.getDb().sort((a, b) => b.dateStamp - a.dateStamp)) {
            allMemesData += `<div class="meme"> <a href="/getDetails?id=${meme.id}"> <img class="memePoster" src="${meme.memeSrc}"/> </div>`
        }

        data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', allMemesData);

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(data);
        res.end()
    })
}

function viewAddMeme(req, res) {
    fs.readFile('./views/addMeme.html', (err, data) => {
        if (err) {
            console.log(err);
            return
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(data);
        res.end()
    });
}

function addMeme(req, res) {
    let form = new formidable.IncomingForm();

    let dbLength = Math.ceil(db.getDb().length / 10);
    let fileName = shortId.generate();
    let memePath = `./public/memeStorage/${dbLength}/${fileName}.jpg`

    form.on('error', (err) => {
        console.log(err);
        return
    }).on('fileBegin', (name, file) => {
        fs.access(`./public/memeStorage/${dbLength}`, (err) => {
            if (err) {
                fs.mkdirSync(`./public/memeStorage/${dbLength}/`)
            }
        })

        file.path = memePath;
    })

    form.parse(req, function (err, fields, files) {
        let id = shortId.generate();
        let createdMeme = memeGenerator(id, fields.memeTitle, memePath, fields.memeDescription, fields.privacy)

        db.add(createdMeme)
        db.save().then(() => {
            viewAddMeme(req, res)
        })
    })
}

function getDetails(req, res) {
    fs.readFile('./views/details.html', (err, data) => {
        let targetedMemeId = qs.parse(url.parse(req.url).query).id;
        let targetedMeme = db.getDb().find((searched) => {
            return searched.id === targetedMemeId;
        });

        if(targetedMeme.privacy) {
            data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', `<div class="content"><img src="${targetedMeme.memeSrc}" alt=""/><h3>Title  ${targetedMeme.title}</h3> <p> ${targetedMeme.description}</p><button><a href="${targetedMeme.memeSrc}" download="${targetedMemeId + '.jpg'}">Download Meme</a></button></div>`)

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end()
        } else {
            data = data.toString().replace('<div id="replaceMe">{{replaceMe}}</div>', '<h1> Sorry, this meme is private </h1>')

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            res.write(data);
            res.end();
        }
    })
}


module.exports = (req, res) => {
    if (req.pathname === '/viewAllMemes' && req.method === 'GET') {
        viewAll(req, res)
    } else if (req.pathname === '/addMeme' && req.method === 'GET') {
        viewAddMeme(req, res)
    } else if (req.pathname === '/addMeme' && req.method === 'POST') {
        addMeme(req, res)
    } else if (req.pathname.startsWith('/getDetails') && req.method === 'GET') {
        getDetails(req, res)
    } else {
        return true
    }
}
