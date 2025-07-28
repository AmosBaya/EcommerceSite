// dependancy imports
require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');

//mongodb connect import
const ConnectDB = require('./config/db');

//consts
const PORT = process.env.PORT || 3000;


// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to db
ConnectDB();

app.listen(
    PORT, ()=>{
        console.log(`Server running on http://localhost/${PORT}`);
    }
)



