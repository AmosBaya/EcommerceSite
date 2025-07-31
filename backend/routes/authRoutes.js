const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { authenticate }= require('../middlewares/authMiddleware');


router.post('/signup', auth.signup);

router.post('/login', auth.login);

router.get('/profile', authenticate, auth.getProfile);

module.exports = router;