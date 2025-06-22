/**
 * Specific Exception Classes
 * 
 * This file defines specific error classes for different types of application errors.
 */

const { AppError } = require('./AppError');

/**
 * Authentication Error
 */
class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error
 */
class AuthorizationError extends AppError {
  constructor(message = 'Access forbidden') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

/**
 * Validation Error
 */
class ValidationError extends AppError {
  constructor(message = 'Validation failed', details = null) {
    super(message, 400);
    this.name = 'ValidationError';
    this.details = details;
  }
}

/**
 * Not Found Error
 */
class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.name = 'NotFoundError';
    this.resource = resource;
  }
}

/**
 * Conflict Error
 */
class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

/**
 * Database Error
 */
class DatabaseError extends AppError {
  constructor(message = 'Database operation failed') {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

/**
 * External Service Error
 */
class ExternalServiceError extends AppError {
  constructor(service, message = 'External service error') {
    super(`${service}: ${message}`, 503);
    this.name = 'ExternalServiceError';
    this.service = service;
  }
}

/**
 * Rate Limit Error
 */
class RateLimitError extends AppError {
  constructor(message = 'Rate limit exceeded') {
    super(message, 429);
    this.name = 'RateLimitError';
  }
}

/**
 * File Upload Error
 */
class FileUploadError extends AppError {
  constructor(message = 'File upload failed') {
    super(message, 400);
    this.name = 'FileUploadError';
  }
}

/**
 * Token Error
 */
class TokenError extends AppError {
  constructor(message = 'Token error') {
    super(message, 401);
    this.name = 'TokenError';
  }
}

/**
 * User-specific Errors
 */
class UserNotFoundError extends NotFoundError {
  constructor() {
    super('User');
    this.name = 'UserNotFoundError';
  }
}

class UserAlreadyExistsError extends ConflictError {
  constructor(field = 'User') {
    super(`${field} already exists`);
    this.name = 'UserAlreadyExistsError';
    this.field = field;
  }
}

class UserInactiveError extends AuthenticationError {
  constructor() {
    super('User account is inactive');
    this.name = 'UserInactiveError';
  }
}

/**
 * University-specific Errors
 */
class UniversityNotFoundError extends NotFoundError {
  constructor() {
    super('University');
    this.name = 'UniversityNotFoundError';
  }
}

class UniversityAlreadyExistsError extends ConflictError {
  constructor() {
    super('University already exists');
    this.name = 'UniversityAlreadyExistsError';
  }
}

/**
 * Faculty-specific Errors
 */
class FacultyNotFoundError extends NotFoundError {
  constructor() {
    super('Faculty');
    this.name = 'FacultyNotFoundError';
  }
}

/**
 * Cart-specific Errors
 */
class CartNotFoundError extends NotFoundError {
  constructor() {
    super('Cart');
    this.name = 'CartNotFoundError';
  }
}

class CartItemNotFoundError extends NotFoundError {
  constructor() {
    super('Cart item');
    this.name = 'CartItemNotFoundError';
  }
}

/**
 * Query-specific Errors
 */
class QueryNotFoundError extends NotFoundError {
  constructor() {
    super('Query');
    this.name = 'QueryNotFoundError';
  }
}

class QueryAlreadyExistsError extends ConflictError {
  constructor() {
    super('Query already exists');
    this.name = 'QueryAlreadyExistsError';
  }
}

class QueryExecutionError extends AppError {
  constructor(message = 'Query execution failed') {
    super(message, 500);
    this.name = 'QueryExecutionError';
  }
}

class InvalidParametersError extends ValidationError {
  constructor(message = 'Invalid query parameters') {
    super(message);
    this.name = 'InvalidParametersError';
  }
}

module.exports = {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
  ConflictError,
  DatabaseError,
  ExternalServiceError,
  RateLimitError,
  FileUploadError,
  TokenError,
  UserNotFoundError,
  UserAlreadyExistsError,
  UserInactiveError,
  UniversityNotFoundError,
  UniversityAlreadyExistsError,
  FacultyNotFoundError,
  CartNotFoundError,
  CartItemNotFoundError,
  QueryNotFoundError,
  QueryAlreadyExistsError,
  QueryExecutionError,
  InvalidParametersError
};

