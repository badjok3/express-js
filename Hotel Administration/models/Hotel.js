const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const hotelSchema = new mongoose.Schema({
    creator: {type: ObjectId, ref: 'User'},
    title: {type: String, required: true},
    location: {type: String, required: true},
    description: {type: String},
    creationDate: {type: Date, default: Date.now()},
    comments: [ {type: ObjectId, default: [], ref: 'Comment'} ],
    image: {type: String},
    views: {type: Number, default: 0},
    likes: [ {type: String} ],
    prop: {type: Number, default: 0}
})

module.exports = mongoose.model('Hotel', hotelSchema)