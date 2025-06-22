/**
 * User Routes
 * 
 * This file defines routes for user management endpoints.
 */

const express = require('express');
const UserController = require('../controllers/userController');
const { authenticate, requireAdmin, selfOrAdmin } = require('../middleware/auth');
const { 
  validateCreateUser, 
  validateUpdateUser,
  validateObjectId,
  validatePagination,
  validateAgeRange,
  validateAgeRangeLogic,
  validateSearch
} = require('../middleware/validation');

const router = express.Router();

// Apply authentication to all user routes
router.use(authenticate);

/**
 * @route   GET /api/users
 * @desc    Get all users with pagination and filtering
 * @access  Private
 */
router.get('/', validatePagination, UserController.getAllUsers);

/**
 * @route   GET /api/users/stats
 * @desc    Get user statistics
 * @access  Private
 */
router.get('/stats', UserController.getUserStatistics);

/**
 * @route   GET /api/users/search/name
 * @desc    Search users by name
 * @access  Private
 */
router.get('/search/name', validateSearch, validatePagination, UserController.searchUsersByName);

/**
 * @route   GET /api/users/university/:university
 * @desc    Get users by university
 * @access  Private
 */
router.get('/university/:university', validatePagination, UserController.getUsersByUniversity);

/**
 * @route   GET /api/users/age-range
 * @desc    Get users by age range
 * @access  Private
 */
router.get('/age-range', 
  validateAgeRange, 
  validateAgeRangeLogic, 
  validatePagination, 
  UserController.getUsersByAgeRange
);

/**
 * @route   GET /api/users/role/:role
 * @desc    Get users by role
 * @access  Private (Admin)
 */
router.get('/role/:role', requireAdmin, validatePagination, UserController.getUsersByRole);

/**
 * @route   POST /api/users
 * @desc    Create new user
 * @access  Private (Admin)
 */
router.post('/', requireAdmin, validateCreateUser, UserController.createUser);

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private (Self or Admin)
 */
router.get('/:id', validateObjectId, selfOrAdmin(), UserController.getUserById);

/**
 * @route   PUT /api/users/:id
 * @desc    Update user
 * @access  Private (Self or Admin)
 */
router.put('/:id', 
  validateObjectId, 
  selfOrAdmin(), 
  validateUpdateUser, 
  UserController.updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', validateObjectId, requireAdmin, UserController.deleteUser);

/**
 * @route   POST /api/users/:id/activate
 * @desc    Activate user
 * @access  Private (Admin)
 */
router.post('/:id/activate', validateObjectId, requireAdmin, UserController.activateUser);

/**
 * @route   POST /api/users/:id/deactivate
 * @desc    Deactivate user
 * @access  Private (Admin)
 */
router.post('/:id/deactivate', validateObjectId, requireAdmin, UserController.deactivateUser);

module.exports = router;

