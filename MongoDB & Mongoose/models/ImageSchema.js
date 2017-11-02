const mongoose = require('mongoose');
const Tag = require('./TagSchema');
const ObjectId = mongoose.Schema.Types.ObjectId;

const ImageSchema= new mongoose.Schema({
    imageUrl: {type: String, required: true},
    imageTitle: {type: String, required: true},
    creationDate: {type: Date, default: Date.now()},
    description: {type: String},
    tags: [{type: ObjectId, ref: 'Tag'}]
})

module.exports = mongoose.model('Image', ImageSchema);