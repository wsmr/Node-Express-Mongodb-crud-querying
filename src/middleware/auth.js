/**
 * Authentication Middleware
 * 
 * This file contains JWT authentication middleware and related utilities.
 */

const jwt = require('jsonwebtoken');
const { jwtConfig, getJwtVerifyOptions } = require('../config/jwt');
const { AppError } = require('../exceptions/AppError');
const { asyncHandler } = require('./errorHandler');
const User = require('../models/User');

/**
 * JWT Authentication Middleware
 */
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
    return next(new AppError('Access denied. No token provided.', 401));
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtConfig.secret, getJwtVerifyOptions());
    
    // Get user from token
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    if (!user.active) {
      return next(new AppError('User account is deactivated', 401));
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expired', 401));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token', 401));
    }
    return next(new AppError('Token verification failed', 401));
  }
});

/**
 * Optional Authentication Middleware
 * Adds user to request if token is valid, but doesn't require authentication
 */
const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  // Get token from header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, jwtConfig.secret, getJwtVerifyOptions());
      
      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.active) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
      console.log('Optional auth token error:', error.message);
    }
  }

  next();
});

/**
 * Role-based Authorization Middleware
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. Authentication required.', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient permissions.', 403));
    }

    next();
  };
};

/**
 * Admin Authorization Middleware
 */
const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Access denied. Authentication required.', 401));
  }

  if (req.user.role !== 'admin') {
    return next(new AppError('Access denied. Admin privileges required.', 403));
  }

  next();
};

/**
 * Self or Admin Authorization Middleware
 * Allows users to access their own resources or admins to access any resource
 */
const selfOrAdmin = (userIdParam = 'id') => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Access denied. Authentication required.', 401));
    }

    const requestedUserId = req.params[userIdParam];
    const currentUserId = req.user._id.toString();

    if (currentUserId === requestedUserId || req.user.role === 'admin') {
      return next();
    }

    return next(new AppError('Access denied. You can only access your own resources.', 403));
  };
};

/**
 * Rate limiting for authentication endpoints
 */
const authRateLimit = require('express-rate-limit')({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth endpoints
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 900 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true // Don't count successful requests
});

module.exports = {
  authenticate,
  optionalAuth,
  authorize,
  requireAdmin,
  selfOrAdmin,
  authRateLimit
};

