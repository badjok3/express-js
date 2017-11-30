const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const orderSchema = new mongoose.Schema({
    creator: {type: ObjectId, ref: 'User', required: true},
    product: {type: ObjectId, ref: 'Product', required: true},
    date: {type: Date, default: Date.now()},
    toppings: {type: []},
    status: {type: String, default: 'Pending'},
    pending: {type: Boolean},
    inProgress: {type: Boolean},
    inTransit: {type: Boolean},
    delivered: {type: Boolean}
});

module.exports = mongoose.model('Order', orderSchema);