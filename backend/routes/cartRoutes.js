const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authenticate = require('../middlewares/authMiddleware');


router.use(authenticate);

router.post('/addcart', cartController.addInCart);

router.get('/getcarts', cartController.getCarts);

module.exports = router;
