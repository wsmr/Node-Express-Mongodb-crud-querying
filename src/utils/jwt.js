/**
 * JWT Utilities
 * 
 * This file contains utility functions for JWT token generation and validation.
 */

const jwt = require('jsonwebtoken');
const { jwtConfig, getJwtOptions, getJwtVerifyOptions } = require('../config/jwt');

/**
 * Generate JWT access token
 */
function generateAccessToken(payload) {
  try {
    const options = getJwtOptions('access');
    return jwt.sign(payload, jwtConfig.secret, options);
  } catch (error) {
    throw new Error(`Failed to generate access token: ${error.message}`);
  }
}

/**
 * Generate JWT refresh token
 */
function generateRefreshToken(payload) {
  try {
    const options = getJwtOptions('refresh');
    return jwt.sign(payload, jwtConfig.secret, options);
  } catch (error) {
    throw new Error(`Failed to generate refresh token: ${error.message}`);
  }
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
  try {
    const options = getJwtVerifyOptions();
    return jwt.verify(token, jwtConfig.secret, options);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

/**
 * Decode JWT token without verification
 */
function decodeToken(token) {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    throw new Error(`Failed to decode token: ${error.message}`);
  }
}

/**
 * Get token expiration time
 */
function getTokenExpiration(token) {
  try {
    const decoded = jwt.decode(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired
 */
function isTokenExpired(token) {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) return true;
    return expiration < new Date();
  } catch (error) {
    return true;
  }
}

/**
 * Get time until token expires (in seconds)
 */
function getTimeUntilExpiration(token) {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) return 0;
    const now = new Date();
    return Math.max(0, Math.floor((expiration - now) / 1000));
  } catch (error) {
    return 0;
  }
}

/**
 * Extract user ID from token
 */
function getUserIdFromToken(token) {
  try {
    const decoded = jwt.decode(token);
    return decoded?.userId || decoded?.sub || null;
  } catch (error) {
    return null;
  }
}

/**
 * Generate token pair (access + refresh)
 */
function generateTokenPair(payload) {
  try {
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    
    return {
      accessToken,
      refreshToken,
      expiresIn: getTimeUntilExpiration(accessToken),
      tokenType: 'Bearer'
    };
  } catch (error) {
    throw new Error(`Failed to generate token pair: ${error.message}`);
  }
}

/**
 * Refresh access token using refresh token
 */
function refreshAccessToken(refreshToken) {
  try {
    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    
    // Generate new access token with same payload
    const newPayload = {
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role
    };
    
    const accessToken = generateAccessToken(newPayload);
    
    return {
      accessToken,
      expiresIn: getTimeUntilExpiration(accessToken),
      tokenType: 'Bearer'
    };
  } catch (error) {
    throw new Error(`Failed to refresh token: ${error.message}`);
  }
}

/**
 * Create token payload from user object
 */
function createTokenPayload(user) {
  return {
    userId: user._id.toString(),
    username: user.username,
    email: user.email,
    role: user.role || 'user'
  };
}

/**
 * Validate token format
 */
function isValidTokenFormat(token) {
  if (!token || typeof token !== 'string') {
    return false;
  }
  
  // JWT tokens have 3 parts separated by dots
  const parts = token.split('.');
  return parts.length === 3;
}

/**
 * Extract token from Authorization header
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || typeof authHeader !== 'string') {
    return null;
  }
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return null;
  }
  
  return parts[1];
}

/**
 * Get token info (decoded payload + metadata)
 */
function getTokenInfo(token) {
  try {
    const decoded = verifyToken(token);
    const expiration = getTokenExpiration(token);
    const timeUntilExpiration = getTimeUntilExpiration(token);
    
    return {
      valid: true,
      payload: decoded,
      expiresAt: expiration,
      expiresIn: timeUntilExpiration,
      isExpired: isTokenExpired(token)
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
      isExpired: isTokenExpired(token)
    };
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  decodeToken,
  getTokenExpiration,
  isTokenExpired,
  getTimeUntilExpiration,
  getUserIdFromToken,
  generateTokenPair,
  refreshAccessToken,
  createTokenPayload,
  isValidTokenFormat,
  extractTokenFromHeader,
  getTokenInfo
};

