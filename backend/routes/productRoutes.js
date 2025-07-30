const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');


//creating a product
router.post('/create', productController.createProduct);

// get all products
router.get('/all', productController.getProducts);

// get single product
router.get('/single', productController.getOneProduct);

module.exports= router;
