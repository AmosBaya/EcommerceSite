const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/authMiddleware');


router.use(authenticate);

//creating a product
router.post('/create', productController.createProduct);

// get all products
router.get('/all', productController.getProducts);

// get single product
router.get('/single/:id', productController.getOneProduct);

module.exports= router;
