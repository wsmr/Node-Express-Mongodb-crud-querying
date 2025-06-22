/**
 * Helper Functions
 * 
 * This file contains utility helper functions used throughout the application.
 */

const mongoose = require('mongoose');
const { PAGINATION, HTTP_STATUS } = require('./constants');

/**
 * Check if a string is a valid MongoDB ObjectId
 */
function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

/**
 * Convert string to ObjectId
 */
function toObjectId(id) {
  if (!isValidObjectId(id)) {
    throw new Error('Invalid ObjectId format');
  }
  return new mongoose.Types.ObjectId(id);
}

/**
 * Parse pagination parameters from query
 */
function parsePagination(query) {
  const page = Math.max(1, parseInt(query.page) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;
  const sort = query.sort || PAGINATION.DEFAULT_SORT;
  const order = query.order === 'asc' ? 1 : -1;

  return {
    page,
    limit,
    skip,
    sort: { [sort]: order }
  };
}

/**
 * Create pagination metadata
 */
function createPaginationMeta(page, limit, total) {
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    currentPage: page,
    totalPages,
    totalItems: total,
    itemsPerPage: limit,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null
  };
}

/**
 * Create standardized API response
 */
function createResponse(success, data = null, message = null, meta = null) {
  const response = { success };

  if (data !== null) {
    response.data = data;
  }

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
}

/**
 * Create success response
 */
function successResponse(data = null, message = null, meta = null) {
  return createResponse(true, data, message, meta);
}

/**
 * Create error response
 */
function errorResponse(message, details = null) {
  const response = createResponse(false, null, message);
  
  if (details) {
    response.details = details;
  }

  return response;
}

/**
 * Sanitize user input by removing potentially harmful characters
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input;
  }

  return input
    .replace(/[<>]/g, '') // Remove < and >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}

/**
 * Deep sanitize object properties
 */
function sanitizeObject(obj) {
  if (obj === null || typeof obj !== 'object') {
    return sanitizeInput(obj);
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    sanitized[key] = sanitizeObject(value);
  }

  return sanitized;
}

/**
 * Generate random string
 */
function generateRandomString(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Generate unique identifier
 */
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Format date to ISO string
 */
function formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString();
}

/**
 * Calculate age from birth date
 */
function calculateAge(birthDate) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 */
function isValidPhone(phone) {
  const phoneRegex = /^[+]?[0-9\s\-()]+$/;
  return phoneRegex.test(phone);
}

/**
 * Validate URL format
 */
function isValidUrl(url) {
  const urlRegex = /^https?:\/\/.+/;
  return urlRegex.test(url);
}

/**
 * Convert string to slug (URL-friendly)
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

/**
 * Capitalize first letter of each word
 */
function titleCase(str) {
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

/**
 * Remove duplicates from array
 */
function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * Group array by property
 */
function groupBy(array, property) {
  return array.reduce((groups, item) => {
    const key = item[property];
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
}

/**
 * Sort array by property
 */
function sortBy(array, property, order = 'asc') {
  return array.sort((a, b) => {
    const aVal = a[property];
    const bVal = b[property];
    
    if (order === 'desc') {
      return bVal > aVal ? 1 : -1;
    }
    return aVal > bVal ? 1 : -1;
  });
}

/**
 * Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Deep clone object
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  if (Array.isArray(obj)) {
    return obj.map(deepClone);
  }
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
}

/**
 * Check if object is empty
 */
function isEmpty(obj) {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
}

/**
 * Get nested property value safely
 */
function getNestedValue(obj, path, defaultValue = null) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !current.hasOwnProperty(key)) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return current;
}

/**
 * Set nested property value
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[keys[keys.length - 1]] = value;
  return obj;
}

/**
 * Format file size in human readable format
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get HTTP status text
 */
function getStatusText(statusCode) {
  const statusTexts = {
    [HTTP_STATUS.OK]: 'OK',
    [HTTP_STATUS.CREATED]: 'Created',
    [HTTP_STATUS.NO_CONTENT]: 'No Content',
    [HTTP_STATUS.BAD_REQUEST]: 'Bad Request',
    [HTTP_STATUS.UNAUTHORIZED]: 'Unauthorized',
    [HTTP_STATUS.FORBIDDEN]: 'Forbidden',
    [HTTP_STATUS.NOT_FOUND]: 'Not Found',
    [HTTP_STATUS.CONFLICT]: 'Conflict',
    [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
    [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    [HTTP_STATUS.SERVICE_UNAVAILABLE]: 'Service Unavailable'
  };
  
  return statusTexts[statusCode] || 'Unknown Status';
}

module.exports = {
  isValidObjectId,
  toObjectId,
  parsePagination,
  createPaginationMeta,
  createResponse,
  successResponse,
  errorResponse,
  sanitizeInput,
  sanitizeObject,
  generateRandomString,
  generateUniqueId,
  formatDate,
  calculateAge,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  slugify,
  titleCase,
  removeDuplicates,
  groupBy,
  sortBy,
  debounce,
  throttle,
  deepClone,
  isEmpty,
  getNestedValue,
  setNestedValue,
  formatFileSize,
  getStatusText
};

