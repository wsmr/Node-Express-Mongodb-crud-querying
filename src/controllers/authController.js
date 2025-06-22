/**
 * Authentication Controller
 * 
 * This file handles HTTP requests for authentication endpoints.
 */

const AuthenticationService = require('../services/authService');
const { asyncHandler } = require('../middleware/errorHandler');
const { HTTP_STATUS } = require('../utils/constants');

class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  static register = asyncHandler(async (req, res) => {
    const result = await AuthenticationService.register(req.body);
    
    res.status(HTTP_STATUS.CREATED).json(result);
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  static login = asyncHandler(async (req, res) => {
    const result = await AuthenticationService.login(req.body);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Validate JWT token
   * POST /api/auth/validate
   */
  static validate = asyncHandler(async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Token is required'
      });
    }

    const result = await AuthenticationService.validateToken(token);
    
    if (result.valid) {
      res.status(HTTP_STATUS.OK).json(result);
    } else {
      res.status(HTTP_STATUS.UNAUTHORIZED).json(result);
    }
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  static refresh = asyncHandler(async (req, res) => {
    const refreshToken = req.body.refreshToken || req.headers.authorization?.split(' ')[1];
    
    if (!refreshToken) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({
        success: false,
        error: 'Refresh token is required'
      });
    }

    const result = await AuthenticationService.refreshToken(refreshToken);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  static logout = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const result = await AuthenticationService.logout(userId);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Change password
   * POST /api/auth/change-password
   */
  static changePassword = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;
    
    const result = await AuthenticationService.changePassword(
      userId, 
      currentPassword, 
      newPassword
    );
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Reset password (admin only)
   * POST /api/auth/reset-password
   */
  static resetPassword = asyncHandler(async (req, res) => {
    const { userId, newPassword } = req.body;
    
    const result = await AuthenticationService.resetPassword(userId, newPassword);
    
    res.status(HTTP_STATUS.OK).json(result);
  });

  /**
   * Get current user profile
   * GET /api/auth/profile
   */
  static getProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const profile = await AuthenticationService.getProfile(userId);
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      data: profile
    });
  });

  /**
   * Update current user profile
   * PUT /api/auth/profile
   */
  static updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const result = await AuthenticationService.updateProfile(userId, req.body);
    
    res.status(HTTP_STATUS.OK).json(result);
  });
}

module.exports = AuthController;

