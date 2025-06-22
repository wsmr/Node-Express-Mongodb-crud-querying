/**
 * AppError Exception Class
 * 
 * This file defines the base error class for application-specific errors.
 */

/**
 * Custom Application Error Class
 * Extends the built-in Error class to provide additional functionality
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = isOperational;
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON format
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      isOperational: this.isOperational,
      stack: process.env.NODE_ENV === 'development' ? this.stack : undefined
    };
  }

  /**
   * Create a Bad Request error (400)
   */
  static badRequest(message = 'Bad Request') {
    return new AppError(message, 400);
  }

  /**
   * Create an Unauthorized error (401)
   */
  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401);
  }

  /**
   * Create a Forbidden error (403)
   */
  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403);
  }

  /**
   * Create a Not Found error (404)
   */
  static notFound(message = 'Not Found') {
    return new AppError(message, 404);
  }

  /**
   * Create a Conflict error (409)
   */
  static conflict(message = 'Conflict') {
    return new AppError(message, 409);
  }

  /**
   * Create an Unprocessable Entity error (422)
   */
  static unprocessableEntity(message = 'Unprocessable Entity') {
    return new AppError(message, 422);
  }

  /**
   * Create an Internal Server Error (500)
   */
  static internal(message = 'Internal Server Error') {
    return new AppError(message, 500);
  }

  /**
   * Create a Service Unavailable error (503)
   */
  static serviceUnavailable(message = 'Service Unavailable') {
    return new AppError(message, 503);
  }
}

module.exports = { AppError };

