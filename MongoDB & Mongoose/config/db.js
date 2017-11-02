const mongoose = require('mongoose');
const path = 'mongodb://Admin:123456@ds119675.mlab.com:19675/mongodbplayground'
mongoose.Promise = global.Promise

module.exports = mongoose.connect(path, {
    useMongoClient: true
})