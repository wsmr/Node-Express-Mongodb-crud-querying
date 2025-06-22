/**
 * Authentication Routes
 * 
 * This file defines routes for authentication endpoints.
 */

const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticate, authRateLimit } = require('../middleware/auth');
const { 
  validateRegisterUser, 
  validateLoginUser, 
  validateUpdateUser 
} = require('../middleware/validation');

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateRegisterUser, AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateLoginUser, AuthController.login);

/**
 * @route   POST /api/auth/validate
 * @desc    Validate JWT token
 * @access  Public
 */
router.post('/validate', AuthController.validate);

/**
 * @route   POST /api/auth/refresh
 * @desc    Refresh access token
 * @access  Public
 */
router.post('/refresh', AuthController.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
router.post('/logout', authenticate, AuthController.logout);

/**
 * @route   POST /api/auth/change-password
 * @desc    Change user password
 * @access  Private
 */
router.post('/change-password', authenticate, AuthController.changePassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset user password (admin only)
 * @access  Private (Admin)
 */
router.post('/reset-password', authenticate, AuthController.resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', authenticate, validateUpdateUser, AuthController.updateProfile);

module.exports = router;

