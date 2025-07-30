const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    price: {
        type: Number,
        required: true
    },
    discountPercentage: Number,
    rating: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    brand: String,
    category: String,
    thumbnail: String,
    images: [String],
    deleted: {
        type: Boolean,
        default: false
    }
}, 
    { timestamps: true }
);


module.exports = mongoose.model('Product', productSchema);