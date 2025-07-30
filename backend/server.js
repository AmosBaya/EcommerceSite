// dependancy imports
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

//mongodb connection import
const ConnectDB = require('./config/db');

// routes import
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cartRoutes');
const productRoutes = require('./routes/productRoutes');

//consts
const PORT = process.env.PORT || 3000;


// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// auth routes
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/product', productRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// connect to db and start the server
ConnectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});

module.exports = app;



