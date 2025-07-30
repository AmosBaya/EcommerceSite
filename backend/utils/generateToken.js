const jwt = require('jsonwebtoken');
const JWT_SECRET= process.env.JWT_SECRET || "secret";



exports.generateToken= (user)=>{
    try {
         return jwt.sign({id:user._id}, JWT_SECRET, {expiresIn:"1d"});
    } catch (error) {
        return error.message;
    }
   
};
