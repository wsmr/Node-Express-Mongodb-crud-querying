/**
 * User Service
 * 
 * This file contains business logic for user management operations.
 */

const User = require('../models/User');
const { CacheManager } = require('../config/cache');
const { hashPassword } = require('../utils/password');
const { parsePagination, createPaginationMeta, isValidObjectId } = require('../utils/helpers');
const { 
  UserNotFoundError, 
  UserAlreadyExistsError,
  ValidationError 
} = require('../exceptions');
const { SUCCESS_MESSAGES } = require('../utils/constants');

class UserService {
  /**
   * Get all users with pagination and filtering
   */
  static async getAllUsers(query = {}) {
    try {
      const { page, limit, skip, sort } = parsePagination(query);
      
      // Build filter
      const filter = { active: true };
      
      if (query.university) {
        filter.university = new RegExp(query.university, 'i');
      }
      
      if (query.minAge || query.maxAge) {
        filter.age = {};
        if (query.minAge) filter.age.$gte = parseInt(query.minAge);
        if (query.maxAge) filter.age.$lte = parseInt(query.maxAge);
      }

      if (query.role) {
        filter.role = query.role;
      }

      // Check cache for this specific query
      const cacheKey = `users:list:${JSON.stringify({ filter, page, limit, sort })}`;
      const cachedResult = CacheManager.get('users', cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      // Get users and total count
      const [users, total] = await Promise.all([
        User.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(filter)
      ]);

      const meta = createPaginationMeta(page, limit, total);

      const result = {
        success: true,
        data: users,
        meta,
        count: users.length
      };

      // Cache result
      CacheManager.set('users', cacheKey, result, 600); // 10 minutes

      return result;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw new ValidationError('Invalid user ID format');
      }

      // Check cache first
      const cachedUser = CacheManager.get('users', `user:${userId}`);
      if (cachedUser) {
        return {
          success: true,
          data: cachedUser
        };
      }

      const user = await User.findById(userId);
      if (!user) {
        throw new UserNotFoundError();
      }

      const userData = user.toJSON();

      // Cache user data
      CacheManager.set('users', `user:${userId}`, userData, 1800); // 30 minutes

      return {
        success: true,
        data: userData
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Create new user
   */
  static async createUser(userData) {
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

      // Hash password if provided
      if (userData.password) {
        userData.password = await hashPassword(userData.password);
      }

      const user = new User(userData);
      await user.save();

      const userResponse = user.toJSON();

      // Clear users cache
      CacheManager.clear('users');

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_CREATED,
        data: userResponse
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
   * Update user
   */
  static async updateUser(userId, updateData) {
    try {
      if (!isValidObjectId(userId)) {
        throw new ValidationError('Invalid user ID format');
      }

      // Remove sensitive fields that shouldn't be updated directly
      const { password, ...safeUpdateData } = updateData;

      const user = await User.findByIdAndUpdate(
        userId,
        safeUpdateData,
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new UserNotFoundError();
      }

      const userData = user.toJSON();

      // Update cache
      CacheManager.set('users', `user:${userId}`, userData, 1800);
      CacheManager.clear('users'); // Clear list cache

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_UPDATED,
        data: userData
      };

    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        throw new ValidationError(`${field} already exists`);
      }
      throw error;
    }
  }

  /**
   * Delete user (soft delete)
   */
  static async deleteUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw new ValidationError('Invalid user ID format');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { active: false },
        { new: true }
      );

      if (!user) {
        throw new UserNotFoundError();
      }

      // Remove from cache
      CacheManager.del('users', `user:${userId}`);
      CacheManager.clear('users'); // Clear list cache

      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_DELETED
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Search users by name
   */
  static async searchUsersByName(name, query = {}) {
    try {
      const { page, limit, skip, sort } = parsePagination(query);

      const cacheKey = `users:search:${name}:${JSON.stringify({ page, limit, sort })}`;
      const cachedResult = CacheManager.get('users', cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const users = await User.searchByName(name)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({
        name: new RegExp(name, 'i'),
        active: true
      });

      const meta = createPaginationMeta(page, limit, total);

      const result = {
        success: true,
        data: users,
        meta,
        count: users.length
      };

      // Cache result
      CacheManager.set('users', cacheKey, result, 600); // 10 minutes

      return result;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by university
   */
  static async getUsersByUniversity(university, query = {}) {
    try {
      const { page, limit, skip, sort } = parsePagination(query);

      const cacheKey = `users:university:${university}:${JSON.stringify({ page, limit, sort })}`;
      const cachedResult = CacheManager.get('users', cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const users = await User.findByUniversity(university)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({
        university: new RegExp(university, 'i'),
        active: true
      });

      const meta = createPaginationMeta(page, limit, total);

      const result = {
        success: true,
        data: users,
        meta,
        count: users.length
      };

      // Cache result
      CacheManager.set('users', cacheKey, result, 600); // 10 minutes

      return result;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by age range
   */
  static async getUsersByAgeRange(minAge, maxAge, query = {}) {
    try {
      const { page, limit, skip, sort } = parsePagination(query);

      const cacheKey = `users:age:${minAge}-${maxAge}:${JSON.stringify({ page, limit, sort })}`;
      const cachedResult = CacheManager.get('users', cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const users = await User.findByAgeRange(minAge, maxAge)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      // Build count filter
      const countFilter = { active: true };
      if (minAge !== undefined) countFilter.age = { $gte: minAge };
      if (maxAge !== undefined) {
        countFilter.age = countFilter.age ? { ...countFilter.age, $lte: maxAge } : { $lte: maxAge };
      }

      const total = await User.countDocuments(countFilter);
      const meta = createPaginationMeta(page, limit, total);

      const result = {
        success: true,
        data: users,
        meta,
        count: users.length
      };

      // Cache result
      CacheManager.set('users', cacheKey, result, 600); // 10 minutes

      return result;

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  static async getUserStatistics() {
    try {
      const cacheKey = 'users:statistics';
      const cachedStats = CacheManager.get('users', cacheKey);
      if (cachedStats) {
        return {
          success: true,
          data: cachedStats
        };
      }

      const stats = await User.getStatistics();

      // Cache statistics
      CacheManager.set('users', cacheKey, stats, 300); // 5 minutes

      return {
        success: true,
        data: stats
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Activate user
   */
  static async activateUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw new ValidationError('Invalid user ID format');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { active: true },
        { new: true }
      );

      if (!user) {
        throw new UserNotFoundError();
      }

      const userData = user.toJSON();

      // Update cache
      CacheManager.set('users', `user:${userId}`, userData, 1800);
      CacheManager.clear('users'); // Clear list cache

      return {
        success: true,
        message: 'User activated successfully',
        data: userData
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Deactivate user
   */
  static async deactivateUser(userId) {
    try {
      if (!isValidObjectId(userId)) {
        throw new ValidationError('Invalid user ID format');
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { active: false },
        { new: true }
      );

      if (!user) {
        throw new UserNotFoundError();
      }

      // Remove from cache
      CacheManager.del('users', `user:${userId}`);
      CacheManager.clear('users'); // Clear list cache

      return {
        success: true,
        message: 'User deactivated successfully'
      };

    } catch (error) {
      throw error;
    }
  }

  /**
   * Get users by role
   */
  static async getUsersByRole(role, query = {}) {
    try {
      const { page, limit, skip, sort } = parsePagination(query);

      const cacheKey = `users:role:${role}:${JSON.stringify({ page, limit, sort })}`;
      const cachedResult = CacheManager.get('users', cacheKey);
      if (cachedResult) {
        return cachedResult;
      }

      const users = await User.find({ role, active: true })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({ role, active: true });
      const meta = createPaginationMeta(page, limit, total);

      const result = {
        success: true,
        data: users,
        meta,
        count: users.length
      };

      // Cache result
      CacheManager.set('users', cacheKey, result, 600); // 10 minutes

      return result;

    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;

