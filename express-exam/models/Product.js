const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    category: {type: String, required: true},
    size: {type: Number, required: true},
    imageUrl: {type: String},
    toppings: {type: []}
})

module.exports = mongoose.model('Product', productSchema);