/**
 * Application Constants
 * 
 * This file contains all application-wide constants and enums.
 */

// HTTP Status Codes
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// User Roles
const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Cart Status
const CART_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Query Categories
const QUERY_CATEGORIES = {
  SEARCH: 'search',
  FILTER: 'filter',
  AGGREGATE: 'aggregate',
  REPORT: 'report'
};

// Parameter Types
const PARAMETER_TYPES = {
  STRING: 'string',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  DATE: 'date',
  OBJECT_ID: 'objectId'
};

// University Types
const UNIVERSITY_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INTERNATIONAL: 'international'
};

// Collections
const COLLECTIONS = {
  USERS: 'users',
  UNIVERSITIES: 'universities',
  FACULTIES: 'faculties',
  CARTS: 'carts',
  QUERIES: 'queries'
};

// Cache Names
const CACHE_NAMES = {
  USERS: 'users',
  UNIVERSITIES: 'universities',
  FACULTIES: 'faculties',
  CARTS: 'carts',
  QUERIES: 'queries',
  PERFORMANCE: 'performance'
};

// Default Pagination
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
  DEFAULT_SORT: 'createdAt',
  DEFAULT_ORDER: 'desc'
};

// Validation Limits
const VALIDATION_LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,
  EMAIL_MAX_LENGTH: 255,
  DESCRIPTION_MAX_LENGTH: 1000,
  UNIVERSITY_NAME_MAX_LENGTH: 200,
  LOCATION_MAX_LENGTH: 200,
  PHONE_MAX_LENGTH: 20,
  SUBJECT_MAX_LENGTH: 100,
  CART_NAME_MAX_LENGTH: 100,
  PRODUCT_NAME_MAX_LENGTH: 200,
  QUERY_NAME_MAX_LENGTH: 100,
  NOTES_MAX_LENGTH: 500,
  AGE_MIN: 13,
  AGE_MAX: 120,
  QUANTITY_MIN: 1,
  QUANTITY_MAX: 1000,
  PRICE_MIN: 0
};

// Rate Limiting
const RATE_LIMITS = {
  GENERAL: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100
  },
  AUTH: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 5
  },
  SEARCH: {
    WINDOW_MS: 1 * 60 * 1000, // 1 minute
    MAX_REQUESTS: 30
  }
};

// Error Messages
const ERROR_MESSAGES = {
  // Authentication
  INVALID_CREDENTIALS: 'Invalid username or password',
  TOKEN_REQUIRED: 'Access token is required',
  TOKEN_INVALID: 'Invalid token',
  TOKEN_EXPIRED: 'Token has expired',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  
  // User
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  USER_INACTIVE: 'User account is inactive',
  USERNAME_TAKEN: 'Username is already taken',
  EMAIL_TAKEN: 'Email is already taken',
  
  // University
  UNIVERSITY_NOT_FOUND: 'University not found',
  UNIVERSITY_ALREADY_EXISTS: 'University already exists',
  
  // Faculty
  FACULTY_NOT_FOUND: 'Faculty not found',
  
  // Cart
  CART_NOT_FOUND: 'Cart not found',
  CART_ITEM_NOT_FOUND: 'Cart item not found',
  
  // Query
  QUERY_NOT_FOUND: 'Query not found',
  QUERY_ALREADY_EXISTS: 'Query already exists',
  QUERY_EXECUTION_FAILED: 'Query execution failed',
  INVALID_PARAMETERS: 'Invalid query parameters',
  
  // General
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
  NOT_FOUND: 'Resource not found',
  BAD_REQUEST: 'Bad request',
  INVALID_ID: 'Invalid ID format'
};

// Success Messages
const SUCCESS_MESSAGES = {
  // Authentication
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTER_SUCCESS: 'User registered successfully',
  TOKEN_REFRESHED: 'Token refreshed successfully',
  
  // User
  USER_CREATED: 'User created successfully',
  USER_UPDATED: 'User updated successfully',
  USER_DELETED: 'User deleted successfully',
  
  // University
  UNIVERSITY_CREATED: 'University created successfully',
  UNIVERSITY_UPDATED: 'University updated successfully',
  UNIVERSITY_DELETED: 'University deleted successfully',
  
  // Faculty
  FACULTY_CREATED: 'Faculty created successfully',
  FACULTY_UPDATED: 'Faculty updated successfully',
  FACULTY_DELETED: 'Faculty deleted successfully',
  
  // Cart
  CART_CREATED: 'Cart created successfully',
  CART_UPDATED: 'Cart updated successfully',
  CART_DELETED: 'Cart deleted successfully',
  CART_ITEM_ADDED: 'Item added to cart successfully',
  CART_ITEM_REMOVED: 'Item removed from cart successfully',
  CART_COMPLETED: 'Cart completed successfully',
  
  // Query
  QUERY_CREATED: 'Query created successfully',
  QUERY_UPDATED: 'Query updated successfully',
  QUERY_DELETED: 'Query deleted successfully',
  QUERY_EXECUTED: 'Query executed successfully',
  
  // Cache
  CACHE_CLEARED: 'Cache cleared successfully',
  
  // General
  OPERATION_SUCCESS: 'Operation completed successfully'
};

// Environment Types
const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  TEST: 'test'
};

// Log Levels
const LOG_LEVELS = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

// Date Formats
const DATE_FORMATS = {
  ISO: 'YYYY-MM-DDTHH:mm:ss.SSSZ',
  DATE_ONLY: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss',
  DISPLAY: 'DD/MM/YYYY HH:mm'
};

// File Types
const FILE_TYPES = {
  JSON: 'application/json',
  CSV: 'text/csv',
  PDF: 'application/pdf',
  EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

// Performance Metrics
const PERFORMANCE_METRICS = {
  RESPONSE_TIME_THRESHOLD: 1000, // 1 second
  MEMORY_USAGE_THRESHOLD: 80, // 80%
  CPU_USAGE_THRESHOLD: 80, // 80%
  ERROR_RATE_THRESHOLD: 5 // 5%
};

// Regular Expressions
const REGEX_PATTERNS = {
  EMAIL: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
  PHONE: /^[+]?[0-9\s\-()]+$/,
  USERNAME: /^[a-zA-Z0-9]+$/,
  URL: /^https?:\/\/.+/,
  MONGO_ID: /^[0-9a-fA-F]{24}$/,
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]/
};

module.exports = {
  HTTP_STATUS,
  USER_ROLES,
  CART_STATUS,
  QUERY_CATEGORIES,
  PARAMETER_TYPES,
  UNIVERSITY_TYPES,
  COLLECTIONS,
  CACHE_NAMES,
  PAGINATION,
  VALIDATION_LIMITS,
  RATE_LIMITS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  ENVIRONMENTS,
  LOG_LEVELS,
  DATE_FORMATS,
  FILE_TYPES,
  PERFORMANCE_METRICS,
  REGEX_PATTERNS
};

