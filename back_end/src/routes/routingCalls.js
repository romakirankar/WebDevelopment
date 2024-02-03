//Set routes
const express = require('express');
const { userSignIn, upsertUser } = require('../components/upsertUser');
const {createProduct } = require('../components/createProduct');
const { getProducts } = require('../components/getProducts');
const router = express.Router();

//Event- User Sign UP/ Save Profile
router.post('/upsertUser', upsertUser);

//Event - User Sign IN
router.post('/userSignIn', userSignIn);

//Event - Create a new product
router.post('/createProduct', createProduct);

//Event - Fetch all products
router.get('/getProducts', getProducts);

module.exports = router;