const mongoose = require('mongoose');
const user = require('./user');

const CartModel = mongoose.model('cart', new mongoose.Schema(
    {
        item: String
    }))

module.exports =  CartModel;