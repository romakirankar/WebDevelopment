//Set up schema for Products
const mongoDb = require('mongoose');

const productSchema = new mongoDb.Schema({
    productName: String,
    productPrice: Number,
    productDescription: String,
    productImageFile: Buffer, // Storing image buffer as binary data (bitmap)
    productQuantity: Number
});

// Create Product model
module.exports = mongoDb.model('products', productSchema); //set collections-name which is set in MongoDB
