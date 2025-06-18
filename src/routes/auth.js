const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');

const authController = new AuthController();

router.post('/register', (req, res) => authController.registerUser(req, res));
router.post('/login', (req, res) => authController.loginUser(req, res));

module.exports = router;