const mongoose = require('mongoose');

const StoreModel = mongoose.model('store', new mongoose.Schema(
    {
        item: String
    }));

module.exports =  StoreModel;