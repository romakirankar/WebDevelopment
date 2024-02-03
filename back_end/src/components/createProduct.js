const Product = require('../models/products');
const sharp = require('sharp');

//--Event - Create a new product//
exports.createProduct = async (request, response) => {
    try {
        const { productName, productPrice, productDescription, productImageBase64 } = request.body;
         
        // Convert base64-encoded image to buffer
         const file = Buffer.from(productImageBase64.split(',')[1], 'base64');

        // Convert image to bitmap format
        const bitmapImageBuffer = await convertAndStoreImage(file);

        // Create new product
        const newProduct = new Product({
            productName,
            productPrice,
            productDescription,
            productImageFile: bitmapImageBuffer // Store bitmap image buffer in MongoDB
        });

        await newProduct.save();
        return response.status(201).json();

    } catch (error) {
        return response.status(500).json();
    }
}

// Convert image to bitmap format 
async function convertAndStoreImage(productImageFile) {
    try {
      const bitmapImageBuffer = await sharp(productImageFile).toBuffer();
      return bitmapImageBuffer; 
    } 
    catch (error) {
      throw new Error('Error converting and storing image');
    }
  }
  