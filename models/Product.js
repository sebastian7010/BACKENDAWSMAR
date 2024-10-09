const { Schema, model } = require('mongoose');

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    feature: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    }
});

module.exports = model('Product', productSchema);