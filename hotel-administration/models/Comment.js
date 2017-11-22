const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const commentSchema = new mongoose.Schema({
    userName: {type: String, required: true},
    userId: {type: ObjectId, ref: 'User'},
    title: {type: String, required: true},
    userComment: {type: String, required: true},
    datePosted: {type: String, default: Date.now()}
})

module.exports = mongoose.model('Comment', commentSchema)