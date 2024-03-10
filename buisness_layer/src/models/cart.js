//Set up schema for Products
const mongoDb = require('mongoose');

const cartSchema = new mongoDb.Schema({   
    userId :String,           
    productId : String,
    productName: String,
    productPrice: Number,
    productDescription: String,
    productImageFile: Buffer, // Storing image buffer as binary data (bitmap)
    productQuantity: Number,
    selectedQuantity: Number
});

// Create Cart model
module.exports = mongoDb.model('carts', cartSchema); //set collections-name which is set in MongoDB
