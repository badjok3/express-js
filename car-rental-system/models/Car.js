const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    make: {type: String, required: true},
    model: {type: String, required: true},
    pricePerDay: {type: Number, required: true},
    year: {type: String, required: true},
    imageUrl: {type: String},
    description: {type: String},
    creationDate: {type: Date, default: Date.now()},
    horsepower: {type: Number},
    engine: {type: String},
    isRented: {type: Boolean},
    days: {type: Number, default: 1}
})

module.exports = mongoose.model('Car', carSchema)