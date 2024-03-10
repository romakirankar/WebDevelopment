//Set routes
const express = require('express');
const { userSignIn, upsertUser } = require('../components/upsertUser');
const { createProduct, getProducts , updateProduct, deleteProduct} = require('../components/crudProducts');
const { pushProductsToCart ,  getProductsFromCart} = require('../components/cart');
const router = express.Router();

//Event- User Sign UP/ Save Profile
router.post('/upsertUser', upsertUser);

//Event - User Sign IN
router.post('/userSignIn', userSignIn);

//Event - Create a new product
router.post('/createProduct', createProduct);

//Event - Fetch all products
router.get('/getProducts', getProducts);

//Event - Update Product
router.put('/updateProduct', updateProduct);

//Event - Delete Product
router.delete('/deleteProduct', deleteProduct);

//Event - Push Products in Cart
router.post('/pushProductsToCart', pushProductsToCart);

//--Event -Get products from the cart based on user id//
router.get('/getProductsFromCart', getProductsFromCart );



module.exports = router;