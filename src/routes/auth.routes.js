const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, makeAdmin } = require('../controllers/auth.controller');
const { adminAuth } = require('../middleware/auth.middleware');

// Register new user
router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], register);

// Login user
router.post('/login', [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
], login);

// Make user admin (protected - only admins can access)
router.post('/make-admin', [
    body('email').isEmail().withMessage('Please enter a valid email')
], adminAuth, makeAdmin);

module.exports = router; 