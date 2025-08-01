const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken }= require('../utils/generateToken');


exports.signup = async(req,res)=>{
    try {
        const { username, email, password }= req.body;

        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.json({message: "User already exist, signin"})
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashed }) 
        const newUser = await user.save();

        const token = generateToken(newUser);
        res.status(201).json({ token, user: newUser });
    } catch (err) {
        res.status(500).json({message:"Signup failed", error: err.message})
    }
    
};

exports.login = async (req,res)=>{
    try {
        const {email, password}=req.body;
        const user = await User.findOne({ email });

        if(!user){
            return res.status(404).json({message:"invalid credetials"})
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({message:"Incorrect credetials"})
        }

        const token = generateToken(user);

        res.status(200).json({message:"login success", token })      
    } catch (err) {
        res.status(500).json({message:"Login faoled", error: err.message})
    };
};

exports.getProfile = async (req,res)=>{
    try {
        const { username } = req.user;
        
        if(!username){
            return res.status(401).json({message:"User not found"});
        }

        res.status(200).json({ username });
    } catch (err) {
        res.status(500).json({message:"Error in fetching username", error: err.message});
    }
};
