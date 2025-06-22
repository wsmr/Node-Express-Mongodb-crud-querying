/**
 * Health Routes
 * 
 * This file defines routes for health check endpoints.
 */

const express = require('express');
const HealthController = require('../controllers/healthController');

const router = express.Router();

/**
 * @route   GET /api/health
 * @desc    Basic application health check
 * @access  Public
 */
router.get('/', HealthController.healthCheck);

/**
 * @route   GET /api/health/detailed
 * @desc    Detailed health check with dependencies
 * @access  Public
 */
router.get('/detailed', HealthController.detailedHealthCheck);

/**
 * @route   GET /api/health/ready
 * @desc    Readiness probe for Kubernetes
 * @access  Public
 */
router.get('/ready', HealthController.readinessCheck);

/**
 * @route   GET /api/health/live
 * @desc    Liveness probe for Kubernetes
 * @access  Public
 */
router.get('/live', HealthController.livenessCheck);

module.exports = router;

