const UserService = require('../models/User');
const jwt = require('jsonwebtoken');

class AuthController {
    constructor() {
        this.userService = new UserService();
    }

    async registerUser(req, res) {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        try {
            // Check if user already exists
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            const newUser = await this.userService.create({ email, password, name });
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
            
            res.status(201).json({ 
                message: 'User registered successfully', 
                user: newUser,
                token 
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }

    async loginUser(req, res) {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
        
        try {
            const user = await this.userService.verifyPassword(email, password);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
            
            res.status(200).json({ 
                message: 'Login successful', 
                user,
                token 
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
}

module.exports = AuthController;