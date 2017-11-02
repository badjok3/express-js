const formidable = require('formidable');
const fs = require('fs');
const Image = require('../models/ImageSchema');
const Tag = require('../models/TagSchema');

let displayHome = (res) => {
    fs.readFile('./views/index.html', (err, data) => {
        if (err) {
            console.log(err)
            return
        }

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        let dispalyTags = ''

        Tag.find({}).then(tags => {
            for (let tag of tags) {
                dispalyTags += `<div class='tag' id="${tag._id}">${tag.tagName}</div>`
            }

            data = data
                .toString()
                .replace(`<div class='replaceMe'></div>`, dispalyTags)

            res.end(data)
        })
    })
}

let addImage = (req, res) => {
    let form = new formidable.IncomingForm()

    form.parse(req, (err, fields, files) => {
        if (err) {
            console.log(err);
            return
        }

        fields.tags = fields.tagsID.split(',')
        fields.tags.pop()

        delete fields.tagsID

        Image.create(fields).then((img) => {
            let targetedTags = img.tags
            Tag.update({_id: {$in: targetedTags}}, {$push: {images: img._id}}, {multi: true}).then((resolve) => {
                console.log(resolve);
                displayHome(res)
            }).catch((err) => {
                console.log(err);
                return
            })

            displayHome(res)
        }).catch((err) => {
            console.log(err);
        })
    })
}

let deleteImg = (req, res) => {
    let imageToDelete = (req.pathquery).id

    Image.findByIdAndRemove(imageToDelete, (err) => {
        if (err => {
                console.log(err)
                return
            })

            Tag
                .update(
                    {},
                    {$pull: {images: {$in: [imageToDelete]}}},
                    {multi: true})
                .then(() => {
                    console.log('Image deleted.')
                    console.log('Image deleted from all tags.')

                    res.writeHead(302, {
                        Location: '/'
                    })
                    res.end()
                })
                .catch(err => {
                    console.log(err)
                })
    })
}

module.exports = (req, res) => {
    if (req.pathname === '/addImage' && req.method === 'POST') {
        addImage(req, res)
    } else if (req.pathname === '/delete' && req.method === 'GET') {
        deleteImg(req, res)
    } else {
        return true
    }
}
