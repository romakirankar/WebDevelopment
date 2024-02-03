const products = require('../models/products');
const Product = require('../models/products');


//--Event -Fetch product(s)//
exports.getProducts = async (request, response) => {

    try {
        // Retrieve product ID from URL parameters
        if (request.query.productID == undefined) {
            //fetch all the products to display on the homescreen
            const products = await Product.find();
            return response.json(products);
        }

       // console.log(request.query.productId);
        // Fetch only one product at a time to display when the  wants to display the product description
        Product.findOne({ productID: request.query.productId })
            .then((productRecord) => {
                if (productRecord) {
                   // console.log('20',productRecord._id);
                    response.status(200).json({ message: 'Product Found!', product: productRecord });
                }
            }).catch((error) => {
                return response.status(400).json({ message: "Something went wrong while fetching products." });
            });
    } catch (error) {
        return response.status(500).json();
    }
}