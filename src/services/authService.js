/**
 * Authentication Service
 * 
 * This file contains business logic for user authentication and authorization.
 */

const User = require('../models/User');
const { generateTokenPair, verifyToken, refreshAccessToken } = require('../utils/jwt');
const { hashPassword, comparePassword } = require('../utils/password');
const { CacheManager } = require('../config/cache');
const { 
  AuthenticationError, 
  UserNotFoundError, 
  UserAlreadyExistsError,
  UserInactiveError,
  ValidationError 
} = require('../exceptions');
const { SUCCESS_MESSAGES, ERROR_MESSAGES } = require('../utils/constants');

class AuthenticationService {
  /**
   * Register a new user
   */
  static async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { username: userData.username },
          { email: userData.email }
        ]
      });

      if (existingUser) {
        if (existingUser.username === userData.username) {
          throw new UserAlreadyExistsError('Username');
        }
        if (existingUser.email === userData.email) {
          throw new UserAlreadyExistsError('Email');
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);

      // Create new user
      const user = new User({
        ...userData,
        password: hashedPassword
      });

      await user.save();

      // Remove password from response
      const userResponse = user.toJSON();
      delete userResponse.password;

      // Clear users cache
      CacheManager.clear('users');

      return {
        success: true,
        message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
        user: userResponse
      };

    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new UserAlreadyExistsError(field);
      }
      throw error;
    }
  }

  /**
   * Login user
   */
  static async login(credentials) {
    try {
      const { username, password } = credentials;

      // Find user by username or email
      const user = await User.findOne({
        $or: [
          { username: username.toLowerCase() },
          { email: username.toLowerCase() }
        ]
      }).select('+password');

      if (!user) {
        throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Check if user is active
      if (!user.active) {
        throw new UserInactiveError();
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Update login info
      await user.updateLoginInfo();

      // Generate tokens
      const tokenPayload = {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      };

      const tokens = generateTokenPair(tokenPayload);

      // Cache user data
      const userCache = user.toJSON();
      delete userCache.password;
      CacheManager.set('users', `user:${user._id}`, userCache, 1800); // 30 minutes

      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
        user: userCache
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Validate token
   */
  static async validateToken(token) {
    try {
      const decoded = verifyToken(token);
      
      // Check if user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.active) {
        throw new AuthenticationError(ERROR_MESSAGES.TOKEN_INVALID);
      }

      return {
        valid: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        expiresAt: new Date(decoded.exp * 1000)
      };

    } catch (error) {
      return {
        valid: false,
        error: error.message
      };
    }
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken) {
    try {
      const newTokens = refreshAccessToken(refreshToken);
      
      return {
        success: true,
        message: SUCCESS_MESSAGES.TOKEN_REFRESHED,
        token: newTokens.accessToken,
        expiresIn: newTokens.expiresIn
      };

    } catch (error) {
      throw new AuthenticationError(error.message);
    }
  }

  /**
   * Logout user (invalidate token)
   */
  static async logout(userId) {
    try {
      // Remove user from cache
      CacheManager.del('users', `user:${userId}`);

      return {
        success: true,
        message: SUCCESS_MESSAGES.LOGOUT_SUCCESS
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Change password
   */
  static async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user with password
      const user = await User.findById(userId).select('+password');
      if (!user) {
        throw new UserNotFoundError();
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      user.password = hashedNewPassword;
      await user.save();

      // Clear user cache
      CacheManager.del('users', `user:${userId}`);

      return {
        success: true,
        message: 'Password changed successfully'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Reset password (admin only)
   */
  static async resetPassword(userId, newPassword) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      user.password = hashedPassword;
      await user.save();

      // Clear user cache
      CacheManager.del('users', `user:${userId}`);

      return {
        success: true,
        message: 'Password reset successfully'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user profile
   */
  static async getProfile(userId) {
    try {
      // Check cache first
      const cachedUser = CacheManager.get('users', `user:${userId}`);
      if (cachedUser) {
        return cachedUser;
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      const userProfile = user.toJSON();
      
      // Cache user profile
      CacheManager.set('users', `user:${userId}`, userProfile, 1800); // 30 minutes

      return userProfile;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId, updateData) {
    try {
      // Remove sensitive fields that shouldn't be updated via this method
      const { password, role, active, ...safeUpdateData } = updateData;

      const user = await User.findByIdAndUpdate(
        userId,
        safeUpdateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new UserNotFoundError();
      }

      const userProfile = user.toJSON();

      // Update cache
      CacheManager.set('users', `user:${userId}`, userProfile, 1800);
      CacheManager.clear('users'); // Clear users list cache

      return {
        success: true,
        message: 'Profile updated successfully',
        user: userProfile
      };

    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ValidationError(`${field} already exists`);
      }
      throw error;
    }
  }
}

module.exports = AuthenticationService;

