const mongoose = require('mongoose');


const cartSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true
    },
    items:[
        {
            productId:String,
            quantity: Number,
        }
    ],
    status: { type: String, default: "active" },
    updatedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Cart', cartSchema);

