/**
 * JWT Configuration
 * 
 * This file contains JWT-related configuration and utilities.
 */

/**
 * JWT configuration object
 */
const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-fallback-secret-key-change-this-in-production',
  expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  issuer: 'diyawanna-sup-backend',
  audience: 'diyawanna-sup-users',
  algorithm: 'HS256'
};

/**
 * Validate JWT configuration
 */
function validateJwtConfig() {
  if (!process.env.JWT_SECRET) {
    console.warn('⚠️ JWT_SECRET not set in environment variables. Using fallback secret.');
    console.warn('⚠️ Please set a secure JWT_SECRET in production!');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️ JWT_SECRET should be at least 32 characters long for security.');
  }

  return jwtConfig;
}

/**
 * Get JWT options for token generation
 */
function getJwtOptions(type = 'access') {
  const baseOptions = {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithm: jwtConfig.algorithm
  };

  if (type === 'refresh') {
    return {
      ...baseOptions,
      expiresIn: jwtConfig.refreshExpiresIn
    };
  }

  return {
    ...baseOptions,
    expiresIn: jwtConfig.expiresIn
  };
}

/**
 * Get JWT verification options
 */
function getJwtVerifyOptions() {
  return {
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience,
    algorithms: [jwtConfig.algorithm]
  };
}

module.exports = {
  jwtConfig: validateJwtConfig(),
  getJwtOptions,
  getJwtVerifyOptions
};

