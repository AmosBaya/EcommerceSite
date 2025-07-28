const jwt = require('jsonwebtoken');
const JWT_SECRET= process.env.JWT_SECRET;



exports.generateToken= (user)=>{
    return jwt.sign({id:user._id}, JWT_SECRET, {expiresIn:"1h"});
}
