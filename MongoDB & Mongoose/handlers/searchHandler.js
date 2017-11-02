const fs = require('fs');
const Tag = require('../models/TagSchema');
const querystring = require('querystring');

module.exports = (req, res) => {
    if (req.pathname === '/search') {

        Tag.find({}).populate('images').then((data) => {
            let searchParams = querystring.parse(req.url);
            let images = []
            for (let tag of data) {
                let currentTags = searchParams['/search?tagName'].split(', ');

                let currentLimit = +searchParams.Limit;

                let currentAfterDate = searchParams.afterDate
                let currentBeforeDate = searchParams.beforeDate

                let isAfterDate = currentAfterDate === '' || new Date(currentAfterDate) < tag.creationDate
                let isBeforeDate = currentBeforeDate === '' || new Date(currentBeforeDate) > tag.creationDate

                if (currentTags.some(t => t === tag.tagName) || currentTags[0] === '') {
                    if (isAfterDate && isBeforeDate) {
                        for (let elem of tag.images) {
                                images.push(elem)
                        }
                    }
                }
            }

            let uniqueArray = images.filter(function (elem, pos) {
                return images.indexOf(elem) === pos
            })

            fs.readFile('./views/results.html', (err, html) => {
                if (err) {
                    console.log(err);
                    return
                }

                res.writeHead(200, {
                    'Content-Type': 'text/html'
                })

                let newData = '';
                for (let currentImage of images) {
                    newData += `<fieldset id => <legend>${currentImage.imageTitle}:</legend> 
                        <img src="${currentImage.imageUrl}">
                        </img><p>${currentImage.description}<p/>
                        <button onclick='location.href="/delete?id=${currentImage._id}"'class='deleteBtn'>Delete
                        </button> 
                     </fieldset>`
                }

                html = html.toString().replace("<div class='replaceMe'></div>", newData);

                res.write(html);
                res.end();
            })
        })
    } else {
        return true
    }
}
