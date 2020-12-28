const mongoose = require('mongoose');

const UserModel = new mongoose.model( 'user',new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    login:String,
    password: String,
    cart: [{
        amount:Number,
       item: {type: mongoose.ObjectId, ref: 'cart'}
}]
}));

module.exports = UserModel;