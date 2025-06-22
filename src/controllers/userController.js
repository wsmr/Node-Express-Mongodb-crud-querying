/**
 * User Controller
 * 
 * This file handles HTTP requests for user management endpoints.
 */

const UserService = require('../services/userService');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

class UserController {
  /**
   * Get all users
   * GET /api/users
   */
  static getAllUsers = asyncHandler(async (req, res) => {
    const result = await UserService.getAllUsers(req.query);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  static getUserById = asyncHandler(async (req, res) => {
    const result = await UserService.getUserById(req.params.id);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Create new user
   * POST /api/users
   */
  static createUser = asyncHandler(async (req, res) => {
    const result = await UserService.createUser(req.body);
    
    res.status(HTTP_STATUS.CREATED).json(result);
  });

  /**
   * Update user
   * PUT /api/users/:id
   */
  static updateUser = asyncHandler(async (req, res) => {
    const result = await UserService.updateUser(req.params.id, req.body);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Delete user (soft delete)
   * DELETE /api/users/:id
   */
  static deleteUser = asyncHandler(async (req, res) => {
    const result = await UserService.deleteUser(req.params.id);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Search users by name
   * GET /api/users/search/name
   */
  static searchUsersByName = asyncHandler(async (req, res) => {
    const { name } = req.query;
    
    if (!name) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        error: 'Name parameter is required'
      });
    }

    const result = await UserService.searchUsersByName(name, req.query);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get users by university
   * GET /api/users/university/:university
   */
  static getUsersByUniversity = asyncHandler(async (req, res) => {
    const result = await UserService.getUsersByUniversity(
      req.params.university, 
      req.query
    );
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get users by age range
   * GET /api/users/age-range
   */
  static getUsersByAgeRange = asyncHandler(async (req, res) => {
    const { minAge, maxAge } = req.query;
    
    const result = await UserService.getUsersByAgeRange(
      minAge ? parseInt(minAge) : undefined,
      maxAge ? parseInt(maxAge) : undefined,
      req.query
    );
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get user statistics
   * GET /api/users/stats
   */
  static getUserStatistics = asyncHandler(async (req, res) => {
    const result = await UserService.getUserStatistics();
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Activate user
   * POST /api/users/:id/activate
   */
  static activateUser = asyncHandler(async (req, res) => {
    const result = await UserService.activateUser(req.params.id);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Deactivate user
   * POST /api/users/:id/deactivate
   */
  static deactivateUser = asyncHandler(async (req, res) => {
    const result = await UserService.deactivateUser(req.params.id);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get users by role
   * GET /api/users/role/:role
   */
  static getUsersByRole = asyncHandler(async (req, res) => {
    const result = await UserService.getUsersByRole(req.params.role, req.query);
    
    res.status(HTTP_STATUS.OK).json(result);
  });
}

module.exports = UserController;

