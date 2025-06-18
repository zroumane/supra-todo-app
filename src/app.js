const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const { connectDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Initialize database and start server
const startServer = async () => {
    try {
        // Connect to database first
        await connectDatabase();
        
        // Import routes after database is connected
        const authRoutes = require('./routes/auth');
        const todoRoutes = require('./routes/todos');
        
        // Routes
        app.use('/api/auth', authRoutes);
        app.use('/api/todos', todoRoutes);
        
        // Serve the main HTML file for all routes not handled by the API
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../public/index.html'));
        });
        
        // Start the server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();