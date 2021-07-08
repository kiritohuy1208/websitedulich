const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let ItemSchema = new Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hoa",
      },
    qty: {
        type: Number,
        default: 0,
      },
    price: {
        type: Number,
        default: 0,
      },
    title: {
        type: String,
      },
    productCode: {
        type: String,
      },
})
const CartSchema = new Schema({
    items: [ItemSchema],
    totalQty: {
        type: Number,
        default: 0,
        required: true,
      },
    totalCost: {
        type: Number,
        default: 0,
        required: true,
      },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Khachhang",
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})
module.exports = mongoose.model('Cart', CartSchema);