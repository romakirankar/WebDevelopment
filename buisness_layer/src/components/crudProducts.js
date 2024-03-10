const Product = require('../models/products');
const sharp = require('sharp');

async function convertAndStoreImage(productImageFile) {
    try {
        const bitmapImageBuffer = await sharp(productImageFile).toBuffer();
        return bitmapImageBuffer;
    }
    catch (error) {
        throw new Error('Error converting and storing image');
    }
}

exports.createProduct = async (request, response) => {
    let action = request.body.action;
    let productPayload = request.body.payload;

    const { _id, productName, productPrice, productDescription, productImageFile, productQuantity } = productPayload;

    // Convert base64-encoded image to buffer
    const file = Buffer.from(productImageFile.split(',')[1], 'base64');

    // Convert image to bitmap format
    const bitmapImageBuffer = await convertAndStoreImage(file); // Wait for the conversion

    try {

        if (action === 'createProduct') {
            // Create an object to update or insert
            const productUpdate = new Product({
                productName,
                productPrice,
                productDescription,
                productImageFile: bitmapImageBuffer,
                productQuantity
            });
            let productRecord = await productUpdate.save();

            if (productRecord) {
                return response.status(200).json({ productRecord: productRecord, base64image: productImageFile });
            }
            return response.status(500).json({ error: 'Internal Server Error' });
        }

        if (action === 'modifyProduct') {

            // Create an object to update or insert
            const productModified = {
                _id,
                productName,
                productPrice,
                productDescription,
                productImageFile: bitmapImageBuffer,
                productQuantity
            };

            const modifiedRecord = await Product.findByIdAndUpdate(productModified._id, productModified, { new: true });
            if (modifiedRecord) {
                return response.status(200).json({ productRecord: modifiedRecord, base64image: productImageFile });
            }
        }
    }
    catch (error) {
        console.error('Error updating product:', error);
        response.status(500).json({ message: 'Internal server error' });
    }

};


//--Event -Fetch product(s)//
exports.getProducts = async (request, response) => {
    try {
        // Retrieve product ID from URL parameters
        if (request.query.productID == undefined) {
            //fetch all the products to display on the homescreen
            const products = await Product.find();

            return response.json(products);
        }

    } catch (error) {
        return response.status(500).json();
    }
}


//Event- Update products by quantities -  only for SHOPPING CART
exports.updateProduct = async (request, response) => {
    try {
        let failedProducts = [];  // Variable to store failed products
        let successProducts = []
        const productsRequest = request.body; // Array of products to update

        // Get products from the database
        let dbProducts = await Product.find();

        // Update the product quantity for each product to be updated
        let updatePromises = dbProducts.map(async (productFromDB) => {
            let productToUpdate = productsRequest.find(product => product._id.toString() === productFromDB._id.toString());

            if (productToUpdate) 
            {
                let availableQty = productFromDB.productQuantity - productToUpdate.selectedQuantity
               
                if (availableQty < 0) {
                   failedProducts.push(productToUpdate); //list of items whose quantities are out of stock
                }
                else
                {   await Product.findByIdAndUpdate(productToUpdate._id, { productQuantity: availableQty });
                    successProducts.push(productToUpdate); //list of items  which were successfully ordered
                }
            }
        });

        // Wait for all update operations to complete
        await Promise.all(updatePromises);

        // Return the updated products from the database
        const products = await Product.find();

        response.status(200).json({ message: 'Products updated successfully', products: products, successProducts: successProducts, failedProducts: failedProducts});

    } catch (error) {
        console.error('Error updating product:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
}


exports.deleteProduct = async (request, response) => {
    try {
        const product = request.body;

        await Product.deleteOne({ _id: product._id });

        response.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        response.status(500).json({ message: 'Internal server error' });
    }
}