const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate }= require('../middlewares/authMiddleware');


router.use(authenticate);

router.post('/add', cartController.addInCart);

router.get('/getcarts', cartController.getCarts);

router.delete('/delete', cartController.deleteItemFromCart)

module.exports = router;
