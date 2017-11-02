const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const Image = require('../models/ImageSchema');

const TagSchema = new mongoose.Schema({
    tagName: {type: String, required: true},
    creationDate: {type: Date, default: Date.now()},
    images: [{type: ObjectId, ref: 'Image'}]
})

TagSchema.pre('save', (next) => {
    //this.tagName = this.tagName.toLowerCase()
    next()
})

module.exports = mongoose.model('Tag', TagSchema);