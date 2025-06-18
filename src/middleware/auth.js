const jwt = require('jsonwebtoken');
const UserService = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        const userService = new UserService();
        const user = await userService.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

module.exports = authMiddleware;