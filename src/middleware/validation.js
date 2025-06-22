/**
 * Validation Middleware
 * 
 * This file contains input validation middleware using Joi.
 */

const Joi = require('joi');
const { validationErrorHandler } = require('./errorHandler');
const { isValidObjectId } = require('../utils/helpers');
const { AppError } = require('../exceptions');

/**
 * Generic validation middleware
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    
    if (error) {
      return next(validationErrorHandler(error));
    }
    
    next();
  };
};

/**
 * Validation schemas
 */
const schemas = {
  // User validation schemas
  registerUser: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(128).required(),
    age: Joi.number().integer().min(13).max(120).required(),
    university: Joi.string().min(2).max(200).required(),
    school: Joi.string().min(2).max(200).optional(),
    work: Joi.string().min(2).max(200).optional()
  }),

  loginUser: Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
  }),

  updateUser: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    age: Joi.number().integer().min(13).max(120).optional(),
    university: Joi.string().min(2).max(200).optional(),
    school: Joi.string().min(2).max(200).optional(),
    work: Joi.string().min(2).max(200).optional()
  }),

  // University validation schemas
  createUniversity: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).optional(),
    location: Joi.string().min(2).max(200).required(),
    website: Joi.string().uri().optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().min(10).max(20).optional(),
    faculties: Joi.array().items(Joi.string()).optional(),
    establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    type: Joi.string().valid('public', 'private', 'international').optional()
  }),

  updateUniversity: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    location: Joi.string().min(2).max(200).optional(),
    website: Joi.string().uri().optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().min(10).max(20).optional(),
    faculties: Joi.array().items(Joi.string()).optional(),
    establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional(),
    type: Joi.string().valid('public', 'private', 'international').optional()
  }),

  // Faculty validation schemas
  createFaculty: Joi.object({
    name: Joi.string().min(2).max(200).required(),
    description: Joi.string().min(10).max(1000).optional(),
    universityId: Joi.string().required(),
    dean: Joi.string().min(2).max(100).optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().min(10).max(20).optional(),
    subjects: Joi.array().items(Joi.string()).optional(),
    establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional()
  }),

  updateFaculty: Joi.object({
    name: Joi.string().min(2).max(200).optional(),
    description: Joi.string().min(10).max(1000).optional(),
    dean: Joi.string().min(2).max(100).optional(),
    contactEmail: Joi.string().email().optional(),
    contactPhone: Joi.string().min(10).max(20).optional(),
    subjects: Joi.array().items(Joi.string()).optional(),
    establishedYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).optional()
  }),

  // Cart validation schemas
  createCart: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    notes: Joi.string().max(500).optional()
  }),

  updateCart: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    status: Joi.string().valid('ACTIVE', 'COMPLETED', 'CANCELLED').optional(),
    notes: Joi.string().max(500).optional()
  }),

  addCartItem: Joi.object({
    productId: Joi.string().required(),
    productName: Joi.string().min(2).max(200).required(),
    quantity: Joi.number().integer().min(1).max(1000).required(),
    price: Joi.number().min(0).required()
  }),

  // Query validation schemas
  createQuery: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(500).required(),
    collection: Joi.string().required(),
    query: Joi.alternatives().try(Joi.object(), Joi.array()).required(),
    parameters: Joi.array().items(Joi.object({
      name: Joi.string().required(),
      type: Joi.string().valid('string', 'number', 'boolean', 'date', 'objectId').required(),
      required: Joi.boolean().default(false),
      description: Joi.string().optional(),
      defaultValue: Joi.any().optional(),
      validation: Joi.object().optional()
    })).optional(),
    category: Joi.string().valid('search', 'filter', 'aggregate', 'report').optional(),
    tags: Joi.array().items(Joi.string()).optional()
  }),

  executeQuery: Joi.object({
    queryName: Joi.string().required(),
    parameters: Joi.object().optional()
  }),

  // Pagination validation
  pagination: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    sort: Joi.string().optional(),
    order: Joi.string().valid('asc', 'desc').optional()
  }),

  // Search validation
  search: Joi.object({
    name: Joi.string().min(1).max(100).required()
  }),

  // Age range validation
  ageRange: Joi.object({
    minAge: Joi.number().integer().min(13).max(120).optional(),
    maxAge: Joi.number().integer().min(13).max(120).optional()
  })
};

// Validation middleware functions
const validateRegisterUser = validate(schemas.registerUser);
const validateLoginUser = validate(schemas.loginUser);
const validateUpdateUser = validate(schemas.updateUser);
const validateCreateUser = validate(schemas.registerUser); // Use same schema as register
const validateCreateUniversity = validate(schemas.createUniversity);
const validateUpdateUniversity = validate(schemas.updateUniversity);
const validateCreateFaculty = validate(schemas.createFaculty);
const validateUpdateFaculty = validate(schemas.updateFaculty);
const validateCreateCart = validate(schemas.createCart);
const validateUpdateCart = validate(schemas.updateCart);
const validateAddCartItem = validate(schemas.addCartItem);
const validateCreateQuery = validate(schemas.createQuery);
const validateExecuteQuery = validate(schemas.executeQuery);
const validatePagination = validate(schemas.pagination, 'query');
const validateSearch = validate(schemas.search, 'query');
const validateAgeRange = validate(schemas.ageRange, 'query');

/**
 * MongoDB ObjectId validation middleware
 */
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  
  if (!isValidObjectId(id)) {
    return next(new AppError('Invalid ID format', 400));
  }
  
  next();
};

/**
 * MongoDB ObjectId validation for any parameter
 */
const validateMongoId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    
    if (!isValidObjectId(id)) {
      return next(new AppError(`Invalid ${paramName} format`, 400));
    }
    
    next();
  };
};

/**
 * Age range logic validation
 */
const validateAgeRangeLogic = (req, res, next) => {
  const { minAge, maxAge } = req.query;
  
  if (minAge && maxAge && parseInt(minAge) > parseInt(maxAge)) {
    return next(new AppError('minAge cannot be greater than maxAge', 400));
  }
  
  next();
};

module.exports = {
  validate,
  schemas,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUser,
  validateCreateUser,
  validateCreateUniversity,
  validateUpdateUniversity,
  validateCreateFaculty,
  validateUpdateFaculty,
  validateCreateCart,
  validateUpdateCart,
  validateAddCartItem,
  validateCreateQuery,
  validateExecuteQuery,
  validateMongoId,
  validatePagination,
  validateAgeRange,
  validateSearch,
  validateObjectId,
  validateAgeRangeLogic
};

