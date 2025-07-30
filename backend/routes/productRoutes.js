const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate } = require('../middlewares/authMiddleware');


router.use(authenticate);

// get all products
router.get('/all', productController.getProducts);

// get single product
router.get*('/single', productController.getOneProduct);

module.exports= router;
