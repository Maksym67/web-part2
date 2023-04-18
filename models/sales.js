const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');

const schema = new Schema({
    SaleDate: { type: Date },
    items: [{ 
        name: { type: String },
        tags: [String],
        price: { type: mongoose.Decimal128 },
        quantity: { type: Number }
     }],
    storeLocation: { type: String },
    customer: {
        gender: { type: String },
        age: { type: Number },
        email: { type: String },
        satisfaction: { type: Number }
    },
    couponUsed: { type: Boolean },
    purchaseMethod: { type: String }
});

const Sales = new model('sales', schema)

module.exports = { Sales };