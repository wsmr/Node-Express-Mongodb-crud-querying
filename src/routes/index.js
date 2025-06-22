/**
 * Routes Index
 * 
 * This file aggregates all route modules and exports them.
 */

const express = require('express');

// Import route modules
const authRoutes = require('./auth');
const userRoutes = require('./users');
const healthRoutes = require('./health');

const router = express.Router();

// API Documentation endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'Diyawanna Sup Backend API',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      authentication: '/api/auth',
      users: '/api/users',
      universities: '/api/universities',
      faculties: '/api/faculties',
      carts: '/api/carts',
      queries: '/api/queries',
      dynamicQuery: '/api/dynamic-query',
      performance: '/api/performance',
      health: '/api/health'
    },
    documentation: {
      postman: '/postman-collection.json',
      openapi: '/api/docs'
    }
  });
});

// Mount route modules
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);

// Placeholder routes for other modules (to be implemented)
router.use('/universities', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Universities endpoints not yet implemented',
    availableEndpoints: [
      'GET /api/universities',
      'POST /api/universities',
      'GET /api/universities/:id',
      'PUT /api/universities/:id',
      'DELETE /api/universities/:id',
      'GET /api/universities/location/:location',
      'GET /api/universities/search'
    ]
  });
});

router.use('/faculties', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Faculties endpoints not yet implemented',
    availableEndpoints: [
      'GET /api/faculties',
      'POST /api/faculties',
      'GET /api/faculties/:id',
      'PUT /api/faculties/:id',
      'DELETE /api/faculties/:id',
      'GET /api/faculties/university/:universityId',
      'GET /api/faculties/search'
    ]
  });
});

router.use('/carts', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Carts endpoints not yet implemented',
    availableEndpoints: [
      'GET /api/carts/user/:userId',
      'POST /api/carts',
      'PUT /api/carts/:id',
      'DELETE /api/carts/:id',
      'POST /api/carts/:id/items',
      'DELETE /api/carts/:id/items/:itemId'
    ]
  });
});

router.use('/queries', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Queries endpoints not yet implemented',
    availableEndpoints: [
      'GET /api/queries',
      'POST /api/queries',
      'GET /api/queries/:id',
      'PUT /api/queries/:id',
      'DELETE /api/queries/:id'
    ]
  });
});

router.use('/dynamic-query', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Dynamic query endpoints not yet implemented',
    availableEndpoints: [
      'POST /api/dynamic-query/execute',
      'GET /api/dynamic-query/mappings',
      'GET /api/dynamic-query/samples',
      'POST /api/dynamic-query/validate'
    ]
  });
});

router.use('/performance', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Performance endpoints not yet implemented',
    availableEndpoints: [
      'GET /api/performance/metrics',
      'GET /api/performance/health',
      'DELETE /api/performance/cache/all',
      'DELETE /api/performance/cache/:name'
    ]
  });
});

module.exports = router;

