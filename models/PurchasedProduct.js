const mongoose = require('mongoose');

const purchasedProductSchema = new mongoose.Schema({
    title: String,
    price: Number,
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming a User model
});

const PurchasedProduct = mongoose.model('PurchasedProduct', purchasedProductSchema);

module.exports = PurchasedProduct;