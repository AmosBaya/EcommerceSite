const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authenticate = async (req,res,next)=>{
    const authHead = req.header.authorization;

    if(!authHead) {
        return res.status(404).json({message:"No token"})
    } 

    try {
        const token = authHead.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne(decoded.id);
        if(!user){
            return res.status(403).json({message:"invalid token"})
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({message:"Unauthorized", error: err.message})
    }
};