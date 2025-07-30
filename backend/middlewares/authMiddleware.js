const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authenticate = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return res.status(401).json({ message: "No token" });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id); // <- use findById, not findOne(decoded.id)
        if (!user) {
            return res.status(403).json({ message: "Invalid token" });
        }

        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: "Unauthorized", error: err.message });
    }
};