const Cart = require('../models/cart');
const sharp = require('sharp');


async function convertAndStoreImage(productImageFile) {
    try {
        let bitmapImageBuffer = await sharp(productImageFile).toBuffer();
        return bitmapImageBuffer;
    }
    catch (error) {
        throw new Error('Error converting and storing image');
    }
}

//after logout operation, save the items in the cart to a cart db
exports.pushProductsToCart = async (request, response) => {
    let userId = request.body.userId;
    let reqProductsInCart = request.body.productsInCart;

    try {
        for (const product of reqProductsInCart) {

            let { productName, productPrice, productDescription, productImageFile, productQuantity, selectedQuantity } = product;

            let productId = product._id;
            // Convert base64-encoded image to buffer
            let file = Buffer.from(productImageFile.split(',')[1], 'base64');

            // Convert image to bitmap format
            let bitmapImageBuffer = await convertAndStoreImage(file); // Wait for the conversion

            // Create a new product document
            let newProduct = new Cart({
                userId,
                productId,
                productName,
                productPrice,
                productDescription,
                productImageFile: bitmapImageBuffer,
                productQuantity,
                selectedQuantity
            });

            let res = await newProduct.save();
        }
        return response.status(200).json();

    } catch (error) {
        return response.status(500).json();
    }
}

//--Event -Get products from the cart based on user id//
exports.getProductsFromCart = async (request, response) => {
    try {
        if (request.query.userId) {
            const products = await Cart.find({ userId: request.query.userId }).select('-userId -_id');;
      
             // Delete the products from the cart using the user ID (to refresh the db on every login)
            await Cart.deleteMany({ userId: request.query.userId });
            
            return response.json(products);
        }
        
        return response.json(500).json();
    }
    catch (error) {
        return response.status(500).json();
    }
}

