# Diyawanna Sup Backend - Node.js Edition

A comprehensive Node.js backend service with MongoDB Atlas integration, JWT authentication, CRUD operations, performance optimizations, and dynamic query processing. This is a complete re-implementation of the original Java Spring Boot application using modern Node.js technologies and best practices.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Architecture](#project-architecture)
- [Features](#features)
- [Setup and Installation](#setup-and-installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Error Handling](#error-handling)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Diyawanna Sup Backend Node.js Edition is a robust, scalable Express.js application designed to provide comprehensive backend services for educational institutions. It features user management, university and faculty administration, shopping cart functionality, and dynamic query processing capabilities, all built with modern Node.js technologies and following industry best practices.

### Key Highlights

- **Modern Architecture**: Built with Express.js 4.x and Node.js 22.14.0+
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **High Performance**: MongoDB integration with connection pooling and multi-level caching
- **Dynamic Queries**: Configurable query system with parameter substitution
- **Comprehensive Testing**: Unit and integration tests with Jest
- **Production Ready**: Performance monitoring, error handling, and deployment configurations
- **API-First Design**: RESTful API with comprehensive documentation

## Technology Stack

### Core Technologies
- **Node.js**: 22.14.0+ LTS
- **Express.js**: 4.18.x (Web framework)
- **MongoDB**: 7.0+ with Mongoose ODM 8.x
- **Mongoose**: Object Document Mapping for MongoDB

### Security & Authentication
- **JWT (JSON Web Tokens)**: Stateless authentication
- **bcryptjs**: Password hashing and verification
- **Helmet**: Security headers middleware
- **CORS**: Cross-origin resource sharing

### Validation & Middleware
- **Joi**: Schema validation for request data
- **Express Rate Limit**: API rate limiting
- **Morgan**: HTTP request logging
- **Compression**: Response compression

### Caching & Performance
- **NodeCache**: In-memory caching system
- **Connection Pooling**: MongoDB connection optimization
- **Response Compression**: Gzip compression for API responses

### Development & Testing
- **Nodemon**: Development server with hot reload
- **Jest**: Testing framework for unit and integration tests
- **Supertest**: HTTP assertion library for API testing
- **ESLint**: Code linting and style enforcement

## Project Architecture

The application follows a layered architecture pattern with clear separation of concerns and modular design principles:

```
src/
├── config/          # Configuration management
├── controllers/     # HTTP request handlers
├── middleware/      # Express middleware functions
├── models/          # MongoDB/Mongoose schemas
├── routes/          # API route definitions
├── services/        # Business logic layer
├── utils/           # Utility functions and helpers
├── exceptions/      # Custom error classes
└── app.js           # Express application setup
```

### Architecture Layers

1. **Presentation Layer** (`controllers/`)
   - HTTP request/response handling
   - Input validation coordination
   - Response formatting and status codes

2. **Business Logic Layer** (`services/`)
   - Core application logic
   - Data processing and transformation
   - Business rule enforcement

3. **Data Access Layer** (`models/`)
   - MongoDB schema definitions
   - Database operations and queries
   - Data validation rules

4. **Infrastructure Layer** (`config/`, `middleware/`, `utils/`)
   - Database connections and configuration
   - Authentication and authorization
   - Caching and performance optimization
   - Error handling and logging

## Features

### 🔐 Authentication & Authorization
- JWT-based stateless authentication system
- User registration and login with secure password hashing
- Token validation and refresh mechanisms
- Role-based access control (User/Admin)
- Password strength validation and security policies
- Session management and logout functionality

### 👥 User Management
- Complete CRUD operations for user accounts
- User profile management and updates
- Advanced search and filtering capabilities
- University and age-based user grouping
- Soft delete functionality for data integrity
- User statistics and analytics

### 🏛️ University & Faculty Management
- University registration and comprehensive management
- Faculty administration with subject tracking
- Department management within faculties
- Location-based university search and filtering
- Hierarchical data relationships and associations
- Academic structure modeling

### 🛒 Shopping Cart System
- User-specific cart management and persistence
- Dynamic item addition and removal
- Cart status tracking (Active/Completed/Cancelled)
- Automatic total amount calculation
- Order processing capabilities
- Cart expiration and cleanup mechanisms

### 🔍 Dynamic Query System
- Configurable query execution engine
- Parameter substitution and validation
- Query template management
- Sample query examples and documentation
- External JSON configuration support
- Query performance monitoring

### 📊 Performance Monitoring
- Real-time performance metrics collection
- Cache management and statistics
- Memory usage tracking and optimization
- Database connection monitoring
- Health check endpoints for system status
- Response time and throughput analysis

### 🚀 Performance Optimizations
- MongoDB connection pooling for efficient database access
- Multi-level caching strategy with NodeCache
- Database indexing for query optimization
- Response compression for reduced bandwidth
- Efficient data structures and algorithms
- Memory management and garbage collection optimization




## Setup and Installation

### Prerequisites

Before running the application, ensure you have the following software installed on your system:

- **Node.js**: Version 22.14.0 or higher (LTS recommended)
- **npm**: Version 10.9.2 or higher (comes with Node.js)
- **MongoDB**: Either a local MongoDB installation or MongoDB Atlas account
- **Git**: For cloning the repository and version control

### Installation Steps

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd diyawanna-sup-backend-nodejs
```

#### 2. Install Dependencies

Install all required Node.js packages using npm:

```bash
npm install
```

This will install all dependencies listed in `package.json`, including:
- Express.js and related middleware
- MongoDB and Mongoose
- Authentication and security packages
- Testing and development tools

#### 3. Environment Configuration

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Edit the `.env` file with your specific configuration:

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diyawanna_sup_main
MONGODB_DATABASE=diyawanna_sup_main

# JWT Configuration
JWT_SECRET=your-256-bit-secret-key-here-make-it-very-long-and-secure
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Cache Configuration
CACHE_TTL=3600
CACHE_MAX_KEYS=1000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info

# Performance Monitoring
ENABLE_PERFORMANCE_MONITORING=true

# CORS Configuration
CORS_ORIGIN=*
CORS_CREDENTIALS=true
```

#### 4. MongoDB Setup

##### Option A: MongoDB Atlas (Recommended)

1. Create a free MongoDB Atlas account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a new cluster (M0 free tier is sufficient for development)
3. Create a database named `diyawanna_sup_main`
4. Create a database user with read/write permissions
5. Whitelist your IP address or use 0.0.0.0/0 for development
6. Get your connection string and update the `MONGODB_URI` in your `.env` file

##### Option B: Local MongoDB

1. Install MongoDB Community Edition on your system
2. Start the MongoDB service
3. Create a database named `diyawanna_sup_main`
4. Update the `MONGODB_URI` in your `.env` file to: `mongodb://localhost:27017/diyawanna_sup_main`

#### 5. Database Initialization

The application will automatically create necessary database indexes when it starts. You can also run the database seeding script to populate initial data:

```bash
npm run seed
```

#### 6. Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The server will start on `http://localhost:8080` (or the port specified in your `.env` file).

#### 7. Production Build

For production deployment, start the server using:

```bash
npm start
```

### Verification

Once the server is running, you can verify the installation by accessing:

- **API Root**: `http://localhost:8080/api/`
- **Health Check**: `http://localhost:8080/api/health`
- **Detailed Health**: `http://localhost:8080/api/health/detailed`

You should see JSON responses indicating the server is running correctly.

### Docker Setup (Optional)

If you prefer to use Docker for development or deployment:

#### 1. Build Docker Image

```bash
docker build -t diyawanna-sup-backend .
```

#### 2. Run with Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=development
      - MONGODB_URI=mongodb://mongo:27017/diyawanna_sup_main
    depends_on:
      - mongo
    volumes:
      - .:/app
      - /app/node_modules

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Run the application:

```bash
docker-compose up -d
```

### Troubleshooting

#### Common Issues

1. **Port Already in Use**
   - Change the `PORT` in your `.env` file to an available port
   - Kill any processes using port 8080: `lsof -ti:8080 | xargs kill -9`

2. **MongoDB Connection Failed**
   - Verify your MongoDB URI is correct
   - Check if MongoDB service is running (for local installations)
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify database user credentials

3. **JWT Secret Warning**
   - Generate a secure JWT secret: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`
   - Update the `JWT_SECRET` in your `.env` file

4. **Permission Errors**
   - Ensure you have proper read/write permissions in the project directory
   - Run `npm install` with appropriate permissions

#### Development Tools

For enhanced development experience, consider installing:

```bash
# Global tools
npm install -g nodemon
npm install -g eslint

# VS Code extensions (if using VS Code)
# - ES7+ React/Redux/React-Native snippets
# - REST Client
# - MongoDB for VS Code
```

## Configuration

The application supports multiple configuration methods to accommodate different deployment environments and use cases.

### Environment Variables

The application uses environment variables for configuration, with support for `.env` files in development. All configuration options can be set via environment variables:

#### Server Configuration

```env
PORT=8080                    # Server port (default: 8080)
NODE_ENV=development         # Environment: development, production, test
HOST=0.0.0.0                # Server host (default: 0.0.0.0)
```

#### Database Configuration

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diyawanna_sup_main
MONGODB_DATABASE=diyawanna_sup_main
MONGODB_MAX_POOL_SIZE=20     # Maximum connection pool size
MONGODB_MIN_POOL_SIZE=5      # Minimum connection pool size
MONGODB_MAX_IDLE_TIME=30000  # Maximum idle time for connections
MONGODB_SERVER_SELECTION_TIMEOUT=5000  # Server selection timeout
MONGODB_SOCKET_TIMEOUT=45000 # Socket timeout
```

#### JWT Configuration

```env
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRES_IN=1h            # Access token expiration
JWT_REFRESH_EXPIRES_IN=7d    # Refresh token expiration
```

#### Cache Configuration

```env
CACHE_TTL=3600              # Default cache TTL in seconds
CACHE_MAX_KEYS=1000         # Maximum number of cache keys
```

#### Rate Limiting Configuration

```env
RATE_LIMIT_WINDOW_MS=900000      # Rate limit window in milliseconds
RATE_LIMIT_MAX_REQUESTS=100      # Maximum requests per window
```

#### CORS Configuration

```env
CORS_ORIGIN=*               # Allowed origins (* for all, or comma-separated list)
CORS_CREDENTIALS=true       # Allow credentials in CORS requests
```

#### Logging Configuration

```env
LOG_LEVEL=info              # Logging level: error, warn, info, debug
```

### Configuration Files

The application also supports JSON configuration files for different environments:

#### Development Configuration (`config/development.json`)

```json
{
  "server": {
    "port": 8080,
    "host": "0.0.0.0"
  },
  "database": {
    "uri": "mongodb://localhost:27017/diyawanna_sup_dev",
    "options": {
      "maxPoolSize": 10,
      "minPoolSize": 2
    }
  },
  "jwt": {
    "secret": "dev-secret-key",
    "expiresIn": "1h"
  },
  "logging": {
    "level": "debug"
  }
}
```

#### Production Configuration (`config/production.json`)

```json
{
  "server": {
    "port": 8080,
    "host": "0.0.0.0"
  },
  "database": {
    "uri": "mongodb+srv://username:password@cluster.mongodb.net/diyawanna_sup_main",
    "options": {
      "maxPoolSize": 20,
      "minPoolSize": 5
    }
  },
  "jwt": {
    "secret": "production-secret-key",
    "expiresIn": "1h"
  },
  "logging": {
    "level": "info"
  },
  "cors": {
    "origin": ["https://yourdomain.com"]
  }
}
```

### Security Configuration

#### JWT Security

- Use a strong, randomly generated secret key (minimum 256 bits)
- Set appropriate token expiration times
- Implement token refresh mechanisms
- Store refresh tokens securely

#### Password Security

- Minimum password length: 6 characters
- Password hashing using bcrypt with salt rounds: 12
- Password strength validation
- Protection against common passwords

#### Rate Limiting

- General API endpoints: 100 requests per 15 minutes
- Authentication endpoints: 5 requests per 15 minutes
- Search endpoints: 30 requests per minute

#### CORS Configuration

For production, specify exact origins instead of using wildcards:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### Database Configuration

#### Connection Pooling

Optimize database performance with proper connection pool settings:

```env
MONGODB_MAX_POOL_SIZE=20     # Adjust based on expected load
MONGODB_MIN_POOL_SIZE=5      # Minimum connections to maintain
MONGODB_MAX_IDLE_TIME=30000  # Close idle connections after 30 seconds
```

#### Indexes

The application automatically creates necessary database indexes for optimal query performance:

- User collection: username, email, university, age
- University collection: name, location, faculties
- Faculty collection: name, universityId, subjects
- Cart collection: userId, status, active
- Query collection: name, collection, category

### Caching Configuration

#### Cache Settings

```env
CACHE_TTL=3600              # Default cache time-to-live (1 hour)
CACHE_MAX_KEYS=1000         # Maximum number of cached items
```

#### Cache Strategy

- User data: 30 minutes TTL
- University data: 1 hour TTL
- Faculty data: 1 hour TTL
- Cart data: 15 minutes TTL
- Query results: 2 hours TTL
- Performance metrics: 5 minutes TTL

### Environment-Specific Configuration

#### Development Environment

- Detailed error messages and stack traces
- Debug-level logging
- Hot reload with nodemon
- Relaxed CORS policies
- Lower rate limits for testing

#### Production Environment

- Minimal error information exposure
- Info-level logging
- Optimized connection pools
- Strict CORS policies
- Standard rate limits
- Performance monitoring enabled

#### Test Environment

- Isolated test database
- Minimal logging (error level only)
- Higher rate limits for test execution
- Mock external services
- Deterministic test data


## API Documentation

The Diyawanna Sup Backend provides a comprehensive RESTful API with consistent response formats, proper HTTP status codes, and extensive functionality for managing users, universities, faculties, carts, and dynamic queries.

### Base URL

```
http://localhost:8080/api
```

For production deployments, replace `localhost:8080` with your actual domain and port.

### Response Format

All API responses follow a consistent JSON format:

#### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "meta": { /* pagination or additional metadata */ }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "details": { /* additional error details if available */ }
}
```

### Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Pagination

List endpoints support pagination with the following query parameters:

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `sort`: Field to sort by (default: createdAt)
- `order`: Sort order - 'asc' or 'desc' (default: desc)

Example: `GET /api/users?page=2&limit=20&sort=name&order=asc`

### Authentication Endpoints

#### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "age": 25,
  "university": "University of Colombo",
  "school": "Faculty of Science",
  "work": "Software Engineer"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "age": 25,
    "university": "University of Colombo",
    "school": "Faculty of Science",
    "work": "Software Engineer",
    "role": "user",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /api/auth/login

Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### POST /api/auth/validate

Validate a JWT token.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "valid": true,
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user"
  },
  "expiresAt": "2024-01-15T11:30:00.000Z"
}
```

#### POST /api/auth/refresh

Refresh an access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

#### POST /api/auth/logout

Logout user and invalidate tokens.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### GET /api/auth/profile

Get current user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "age": 25,
    "university": "University of Colombo",
    "school": "Faculty of Science",
    "work": "Software Engineer",
    "role": "user",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastLogin": "2024-01-15T10:30:00.000Z",
    "loginCount": 5
  }
}
```

#### PUT /api/auth/profile

Update current user profile.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "age": 26,
  "work": "Senior Software Engineer"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe Updated",
    "age": 26,
    "work": "Senior Software Engineer"
  }
}
```

### User Management Endpoints

#### GET /api/users

Get all active users with pagination and filtering.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sort`: Sort field (default: createdAt)
- `order`: Sort order - asc/desc (default: desc)
- `university`: Filter by university name
- `minAge`: Minimum age filter
- `maxAge`: Maximum age filter
- `role`: Filter by user role

**Example:** `GET /api/users?page=1&limit=20&university=Colombo&minAge=20&maxAge=30`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "age": 25,
      "university": "University of Colombo",
      "active": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "count": 20
}
```

#### GET /api/users/:id

Get user by ID.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "age": 25,
    "university": "University of Colombo",
    "school": "Faculty of Science",
    "work": "Software Engineer",
    "role": "user",
    "active": true,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### POST /api/users

Create a new user (Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "username": "janesmith",
  "email": "jane@example.com",
  "password": "password123",
  "age": 23,
  "university": "University of Peradeniya",
  "school": "Faculty of Engineering",
  "work": "Data Scientist"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Jane Smith",
    "username": "janesmith",
    "email": "jane@example.com",
    "age": 23,
    "university": "University of Peradeniya",
    "active": true,
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

#### PUT /api/users/:id

Update user information (Self or Admin).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "age": 24
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d1",
    "name": "Jane Smith Updated",
    "age": 24,
    "updatedAt": "2024-01-15T12:00:00.000Z"
  }
}
```

#### DELETE /api/users/:id

Soft delete user (Admin only).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### GET /api/users/search/name

Search users by name.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `name`: Name to search for (required)
- `page`, `limit`, `sort`, `order`: Pagination parameters

**Example:** `GET /api/users/search/name?name=John&page=1&limit=10`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "username": "johndoe",
      "university": "University of Colombo"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1
  },
  "count": 1
}
```

#### GET /api/users/university/:university

Get users by university.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Example:** `GET /api/users/university/University%20of%20Colombo`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "university": "University of Colombo",
      "age": 25
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 25
  },
  "count": 10
}
```

#### GET /api/users/age-range

Get users within age range.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `minAge`: Minimum age (optional)
- `maxAge`: Maximum age (optional)
- `page`, `limit`, `sort`, `order`: Pagination parameters

**Example:** `GET /api/users/age-range?minAge=20&maxAge=30`

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "age": 25,
      "university": "University of Colombo"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 50
  },
  "count": 20
}
```

#### GET /api/users/stats

Get user statistics.

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers": 142,
    "inactiveUsers": 8,
    "averageAge": 24.5,
    "universitiesRepresented": 12,
    "recentRegistrations": 5
  }
}
```

### Health Check Endpoints

#### GET /api/health

Basic application health check.

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600,
  "memory": {
    "used": 45,
    "total": 128,
    "external": 12
  }
}
```

#### GET /api/health/detailed

Detailed health check with dependencies.

**Response (200 OK):**
```json
{
  "status": "UP",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "environment": "development",
  "uptime": 3600,
  "responseTime": "15ms",
  "checks": {
    "database": {
      "status": "UP",
      "details": {
        "status": "connected",
        "host": "cluster.mongodb.net",
        "name": "diyawanna_sup_main"
      }
    },
    "cache": {
      "status": "UP",
      "stats": {
        "users": {
          "keys": 25,
          "hits": 150,
          "misses": 30
        }
      }
    }
  },
  "system": {
    "memory": {
      "used": 45,
      "total": 128,
      "external": 12,
      "rss": 67
    },
    "platform": "linux",
    "nodeVersion": "v22.14.0"
  }
}
```

### Error Codes and Handling

The API uses standard HTTP status codes and provides detailed error messages:

#### Common Status Codes

- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation error
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

#### Error Response Examples

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name must be at least 2 characters long",
    "Email is required"
  ]
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "error": "Invalid token"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "error": "User not found"
}
```

**Rate Limit Error (429):**
```json
{
  "success": false,
  "error": "Too many requests from this IP, please try again later.",
  "retryAfter": 900
}
```

### Rate Limiting

The API implements rate limiting to prevent abuse:

- **General endpoints**: 100 requests per 15 minutes per IP
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **Search endpoints**: 30 requests per minute per IP

Rate limit headers are included in responses:
- `RateLimit-Limit`: Request limit for the time window
- `RateLimit-Remaining`: Remaining requests in current window
- `RateLimit-Reset`: Time when the rate limit resets

### API Testing

You can test the API using various tools:

#### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "age": 25,
    "university": "Test University"
  }'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'

# Get users (with token)
curl -X GET http://localhost:8080/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Using Postman

Import the provided Postman collection (`postman-collection.json`) for comprehensive API testing with pre-configured requests and environment variables.

#### Using JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE = 'http://localhost:8080/api';

// Login and get token
async function login() {
  const response = await axios.post(`${API_BASE}/auth/login`, {
    username: 'testuser',
    password: 'password123'
  });
  return response.data.token;
}

// Get users with authentication
async function getUsers(token) {
  const response = await axios.get(`${API_BASE}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
}
```


## Database Schema

The application uses MongoDB as its primary database with Mongoose ODM for schema definition and validation. The database design follows NoSQL best practices with proper indexing for optimal performance.

### Collections Overview

#### Users Collection

The users collection stores all user account information with authentication and profile data.

**Schema Structure:**
```javascript
{
  "_id": ObjectId,
  "name": String,           // Full name (2-100 characters)
  "username": String,       // Unique username (3-30 alphanumeric)
  "email": String,          // Unique email address
  "password": String,       // Hashed password (bcrypt)
  "age": Number,            // Age (13-120)
  "university": String,     // University name
  "school": String,         // Faculty/School (optional)
  "work": String,           // Work description (optional)
  "role": String,           // "user" or "admin"
  "active": Boolean,        // Account status
  "lastLogin": Date,        // Last login timestamp
  "loginCount": Number,     // Total login count
  "createdAt": Date,        // Account creation date
  "updatedAt": Date         // Last update date
}
```

**Indexes:**
- `username` (unique)
- `email` (unique)
- `active`
- `university`
- `age`
- `createdAt`
- Compound: `{active: 1, university: 1}`

**Example Document:**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "name": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "password": "$2a$12$...",
  "age": 25,
  "university": "University of Colombo",
  "school": "Faculty of Science",
  "work": "Software Engineer",
  "role": "user",
  "active": true,
  "lastLogin": "2024-01-15T10:30:00.000Z",
  "loginCount": 5,
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Universities Collection

The universities collection manages educational institution data with location and faculty information.

**Schema Structure:**
```javascript
{
  "_id": ObjectId,
  "name": String,           // Unique university name
  "description": String,    // University description
  "location": String,       // Geographic location
  "website": String,        // Official website URL
  "contactEmail": String,   // Contact email
  "contactPhone": String,   // Contact phone number
  "faculties": [String],    // Array of faculty names
  "active": Boolean,        // University status
  "establishedYear": Number,// Year established
  "type": String,           // "public", "private", "international"
  "ranking": {
    "national": Number,     // National ranking
    "international": Number // International ranking
  },
  "studentCount": Number,   // Total student count
  "createdAt": Date,
  "updatedAt": Date
}
```

**Indexes:**
- `name` (unique)
- `location`
- `active`
- `faculties`
- `type`
- `ranking.national`

#### Faculties Collection

The faculties collection stores faculty/department information within universities.

**Schema Structure:**
```javascript
{
  "_id": ObjectId,
  "name": String,           // Faculty name
  "description": String,    // Faculty description
  "universityId": ObjectId, // Reference to university
  "dean": String,           // Dean name
  "contactEmail": String,   // Faculty contact email
  "contactPhone": String,   // Faculty contact phone
  "subjects": [String],     // Array of subjects offered
  "active": Boolean,        // Faculty status
  "establishedYear": Number,// Year established
  "studentCount": Number,   // Faculty student count
  "staffCount": Number,     // Faculty staff count
  "departments": [{         // Sub-departments
    "name": String,
    "head": String,
    "studentCount": Number
  }],
  "createdAt": Date,
  "updatedAt": Date
}
```

**Indexes:**
- `name`
- `universityId`
- `active`
- `subjects`
- Compound: `{universityId: 1, active: 1}`

#### Carts Collection

The carts collection manages shopping cart functionality for users.

**Schema Structure:**
```javascript
{
  "_id": ObjectId,
  "name": String,           // Cart name
  "userId": ObjectId,       // Reference to user
  "items": [{               // Cart items array
    "_id": ObjectId,        // Item ID
    "productId": String,    // Product identifier
    "productName": String,  // Product name
    "quantity": Number,     // Item quantity
    "price": Number,        // Item price
    "addedAt": Date         // When item was added
  }],
  "totalAmount": Number,    // Calculated total amount
  "status": String,         // "ACTIVE", "COMPLETED", "CANCELLED"
  "active": Boolean,        // Cart status
  "notes": String,          // Optional notes
  "completedAt": Date,      // Completion timestamp
  "expiresAt": Date,        // Expiration timestamp
  "createdAt": Date,
  "updatedAt": Date
}
```

**Indexes:**
- `userId`
- `status`
- `active`
- Compound: `{userId: 1, status: 1, active: 1}`
- TTL: `{expiresAt: 1}` (automatic expiration)

#### Queries Collection

The queries collection stores dynamic query templates for flexible data retrieval.

**Schema Structure:**
```javascript
{
  "_id": ObjectId,
  "name": String,           // Unique query name
  "description": String,    // Query description
  "collection": String,     // Target collection
  "query": Mixed,           // MongoDB query object
  "parameters": [{          // Query parameters
    "name": String,         // Parameter name
    "type": String,         // "string", "number", "boolean", "date", "objectId"
    "required": Boolean,    // Is parameter required
    "description": String,  // Parameter description
    "defaultValue": Mixed,  // Default value
    "validation": {         // Validation rules
      "min": Number,
      "max": Number,
      "pattern": String,
      "enum": [String]
    }
  }],
  "active": Boolean,        // Query status
  "category": String,       // "search", "filter", "aggregate", "report"
  "executionCount": Number, // Times executed
  "lastExecuted": Date,     // Last execution time
  "averageExecutionTime": Number, // Average execution time
  "createdBy": ObjectId,    // Creator user ID
  "tags": [String],         // Query tags
  "createdAt": Date,
  "updatedAt": Date
}
```

**Indexes:**
- `name` (unique)
- `collection`
- `active`
- `category`
- `tags`
- `createdAt`

### Database Relationships

#### User-University Relationship
- Users reference universities by name (string field)
- No foreign key constraint (NoSQL flexibility)
- Allows for university name variations

#### University-Faculty Relationship
- Faculties reference universities via `universityId` (ObjectId)
- Universities maintain a `faculties` array for quick access
- Bidirectional relationship for efficient queries

#### User-Cart Relationship
- Carts reference users via `userId` (ObjectId)
- One-to-many relationship (user can have multiple carts)
- Soft delete preserves cart history

#### Query-User Relationship
- Queries optionally reference creators via `createdBy` (ObjectId)
- Tracks query authorship and permissions

### Data Validation

#### Field Validation Rules

**String Fields:**
- Minimum and maximum length constraints
- Pattern matching for specific formats (email, phone, URL)
- Trimming of whitespace
- Case normalization where appropriate

**Numeric Fields:**
- Range validation (min/max values)
- Integer vs. decimal constraints
- Non-negative constraints for counts

**Date Fields:**
- Automatic timestamp generation
- Future date validation where applicable
- Date range validation

**Array Fields:**
- Maximum array length limits
- Element validation
- Duplicate prevention

#### Custom Validation

**Password Validation:**
- Minimum 6 characters
- Complexity requirements (configurable)
- Common password prevention
- Strength scoring

**Email Validation:**
- RFC-compliant email format
- Domain validation
- Uniqueness enforcement

**Age Validation:**
- Reasonable age ranges (13-120)
- Numeric validation
- Required field enforcement

### Performance Optimization

#### Indexing Strategy

**Single Field Indexes:**
- Unique constraints on username and email
- Status fields (active, role) for filtering
- Timestamp fields for sorting

**Compound Indexes:**
- `{active: 1, university: 1}` for filtered university queries
- `{userId: 1, status: 1, active: 1}` for user cart queries
- `{universityId: 1, active: 1}` for faculty queries

**Text Indexes:**
- Full-text search on name fields
- Search optimization for user and university names

#### Query Optimization

**Aggregation Pipelines:**
- Efficient data grouping and statistics
- Optimized sorting and limiting
- Index utilization in pipeline stages

**Projection:**
- Field selection to reduce data transfer
- Exclusion of sensitive fields (passwords)
- Optimized response sizes

**Pagination:**
- Skip and limit optimization
- Cursor-based pagination for large datasets
- Total count optimization

### Data Migration and Seeding

#### Initial Data Setup

The application includes scripts for database initialization:

```bash
# Create indexes
npm run migrate

# Seed initial data
npm run seed
```

#### Sample Data Structure

**Admin User:**
```json
{
  "name": "System Administrator",
  "username": "admin",
  "email": "admin@diyawanna.edu",
  "password": "admin123",
  "age": 30,
  "university": "System",
  "role": "admin",
  "active": true
}
```

**Sample Universities:**
```json
[
  {
    "name": "University of Colombo",
    "location": "Colombo, Sri Lanka",
    "type": "public",
    "establishedYear": 1921,
    "faculties": ["Faculty of Science", "Faculty of Arts", "Faculty of Medicine"]
  },
  {
    "name": "University of Peradeniya",
    "location": "Peradeniya, Sri Lanka",
    "type": "public",
    "establishedYear": 1942,
    "faculties": ["Faculty of Engineering", "Faculty of Agriculture"]
  }
]
```

#### Data Backup and Recovery

**Backup Strategy:**
- Regular automated backups using MongoDB tools
- Point-in-time recovery capabilities
- Cross-region backup replication

**Recovery Procedures:**
- Database restoration from backups
- Data consistency verification
- Application state recovery

## Security

The Diyawanna Sup Backend implements comprehensive security measures to protect user data, prevent unauthorized access, and ensure system integrity. Security is implemented at multiple layers of the application architecture.

### Authentication Security

#### JWT (JSON Web Tokens)

**Token Structure:**
- **Header**: Algorithm and token type
- **Payload**: User claims and metadata
- **Signature**: HMAC SHA256 signature for verification

**Security Features:**
- Stateless authentication (no server-side session storage)
- Configurable token expiration (default: 1 hour)
- Refresh token mechanism for extended sessions
- Token invalidation on logout

**Best Practices:**
- Use strong, randomly generated secret keys (minimum 256 bits)
- Implement token rotation for enhanced security
- Store tokens securely on client side (httpOnly cookies recommended)
- Validate tokens on every protected request

#### Password Security

**Hashing Algorithm:**
- bcrypt with salt rounds: 12 (configurable)
- Automatic salt generation for each password
- Resistance to rainbow table attacks
- Adaptive cost factor for future-proofing

**Password Policies:**
- Minimum length: 6 characters (configurable)
- Complexity requirements (optional)
- Common password prevention
- Password strength scoring and feedback

**Security Measures:**
- Passwords never stored in plain text
- Password fields excluded from query results by default
- Secure password reset mechanisms
- Password change requires current password verification

### Authorization and Access Control

#### Role-Based Access Control (RBAC)

**User Roles:**
- **User**: Standard user with limited permissions
- **Admin**: Administrative user with full system access

**Permission Matrix:**

| Resource | User | Admin |
|----------|------|-------|
| Own Profile | Read/Write | Read/Write |
| Other Profiles | Read | Read/Write/Delete |
| Users Management | - | Full Access |
| Universities | Read | Full Access |
| Faculties | Read | Full Access |
| Own Carts | Full Access | Full Access |
| Other Carts | - | Read/Write |
| Queries | Execute | Full Access |
| System Admin | - | Full Access |

#### Endpoint Protection

**Authentication Middleware:**
- JWT token validation on protected routes
- User existence and status verification
- Token expiration checking
- Automatic token refresh handling

**Authorization Middleware:**
- Role-based access control
- Resource ownership verification
- Admin privilege checking
- Self-or-admin access patterns

### Input Validation and Sanitization

#### Request Validation

**Joi Schema Validation:**
- Comprehensive input validation for all endpoints
- Type checking and format validation
- Range and length constraints
- Custom validation rules

**Validation Examples:**
```javascript
// User registration validation
{
  name: Joi.string().min(2).max(100).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  age: Joi.number().integer().min(13).max(120).required()
}
```

#### Data Sanitization

**Input Sanitization:**
- HTML tag removal from text inputs
- Script injection prevention
- Special character escaping
- Whitespace trimming and normalization

**Output Sanitization:**
- Sensitive data exclusion (passwords, tokens)
- Response data filtering
- Error message sanitization
- Stack trace removal in production

### Network Security

#### CORS (Cross-Origin Resource Sharing)

**Configuration:**
- Configurable allowed origins
- Credential support control
- Method and header restrictions
- Preflight request handling

**Production Settings:**
```javascript
{
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
```

#### Security Headers

**Helmet.js Integration:**
- Content Security Policy (CSP)
- X-Frame-Options (clickjacking protection)
- X-Content-Type-Options (MIME sniffing prevention)
- X-XSS-Protection (XSS attack prevention)
- Strict-Transport-Security (HTTPS enforcement)

### Rate Limiting and DDoS Protection

#### Rate Limiting Strategy

**Endpoint-Specific Limits:**
- General API endpoints: 100 requests/15 minutes
- Authentication endpoints: 5 requests/15 minutes
- Search endpoints: 30 requests/minute

**Implementation:**
- IP-based rate limiting
- Sliding window algorithm
- Configurable limits per endpoint
- Rate limit headers in responses

**Rate Limit Headers:**
```
RateLimit-Limit: 100
RateLimit-Remaining: 95
RateLimit-Reset: 1642234567
```

#### DDoS Protection

**Application-Level Protection:**
- Request size limits (10MB default)
- Connection timeout configuration
- Slow request detection and termination
- Resource usage monitoring

**Infrastructure Recommendations:**
- Reverse proxy with rate limiting (Nginx, Cloudflare)
- Load balancing for traffic distribution
- CDN for static content delivery
- WAF (Web Application Firewall) integration

### Database Security

#### MongoDB Security

**Authentication:**
- Database user authentication required
- Role-based database access control
- Connection string encryption
- SSL/TLS connection enforcement

**Data Protection:**
- Field-level encryption for sensitive data
- Audit logging for database operations
- Backup encryption
- Network isolation

#### Query Security

**Injection Prevention:**
- Parameterized queries using Mongoose
- Input validation before database operations
- NoSQL injection attack prevention
- Dynamic query sanitization

**Access Control:**
- Principle of least privilege
- Database user role restrictions
- Connection pool security
- Query timeout enforcement

### Error Handling and Information Disclosure

#### Secure Error Handling

**Error Response Strategy:**
- Generic error messages in production
- Detailed errors only in development
- Stack trace removal in production
- Error logging without sensitive data exposure

**Error Categories:**
```javascript
// Production error response
{
  "success": false,
  "error": "Authentication failed"
}

// Development error response (additional details)
{
  "success": false,
  "error": "Authentication failed",
  "details": "Invalid JWT token signature",
  "stack": "Error: Invalid signature..."
}
```

#### Information Disclosure Prevention

**Sensitive Data Protection:**
- Password field exclusion from responses
- Token information sanitization
- Database error message filtering
- System information hiding

### Logging and Monitoring

#### Security Logging

**Audit Trail:**
- Authentication attempts (success/failure)
- Authorization failures
- Sensitive operation logging
- Admin action tracking

**Log Security:**
- Structured logging format
- Log rotation and archival
- Access control for log files
- Sensitive data exclusion from logs

#### Security Monitoring

**Real-time Monitoring:**
- Failed authentication attempt tracking
- Unusual access pattern detection
- Rate limit violation monitoring
- Error rate spike detection

**Alerting:**
- Security incident notifications
- Threshold-based alerts
- Integration with monitoring systems
- Automated response triggers

### Deployment Security

#### Environment Security

**Configuration Management:**
- Environment variable usage for secrets
- Configuration file encryption
- Secret rotation procedures
- Development/production separation

**Container Security:**
- Minimal base images
- Non-root user execution
- Resource limits
- Security scanning

#### Network Security

**HTTPS Enforcement:**
- SSL/TLS certificate configuration
- HTTP to HTTPS redirection
- Secure cookie settings
- HSTS header implementation

**Network Isolation:**
- Private network deployment
- Firewall configuration
- VPN access for administration
- Database network isolation

### Security Best Practices

#### Development Security

**Secure Coding:**
- Regular security code reviews
- Dependency vulnerability scanning
- Static code analysis
- Security testing integration

**Dependency Management:**
- Regular dependency updates
- Vulnerability scanning with npm audit
- License compliance checking
- Minimal dependency principle

#### Operational Security

**Access Management:**
- Multi-factor authentication for admin access
- Regular access review and cleanup
- Principle of least privilege
- Secure key management

**Incident Response:**
- Security incident response plan
- Breach notification procedures
- Recovery and remediation processes
- Post-incident analysis and improvement

## Performance Optimizations

The Diyawanna Sup Backend is designed with performance as a primary consideration, implementing multiple optimization strategies to ensure fast response times, efficient resource utilization, and scalability under load.

### Database Performance

#### Connection Pooling

**MongoDB Connection Pool Configuration:**
```javascript
{
  maxPoolSize: 20,        // Maximum connections in pool
  minPoolSize: 5,         // Minimum connections maintained
  maxIdleTimeMS: 30000,   // Close idle connections after 30s
  serverSelectionTimeoutMS: 5000,  // Server selection timeout
  socketTimeoutMS: 45000  // Socket timeout
}
```

**Benefits:**
- Reduced connection overhead
- Better resource utilization
- Improved concurrent request handling
- Automatic connection management

#### Database Indexing

**Strategic Index Creation:**
- Primary key indexes on all collections
- Unique indexes for username and email fields
- Compound indexes for common query patterns
- Text indexes for search functionality

**Index Performance Monitoring:**
- Query execution plan analysis
- Index usage statistics
- Slow query identification
- Index optimization recommendations

#### Query Optimization

**Efficient Query Patterns:**
- Projection to limit returned fields
- Aggregation pipeline optimization
- Proper use of sort and limit
- Avoiding N+1 query problems

**Example Optimized Query:**
```javascript
// Optimized user search with projection
User.find(
  { university: /colombo/i, active: true },
  { name: 1, email: 1, university: 1, age: 1 }
)
.sort({ createdAt: -1 })
.limit(20)
.lean(); // Returns plain objects instead of Mongoose documents
```

### Caching Strategy

#### Multi-Level Caching

**Cache Hierarchy:**
1. **Application Cache**: NodeCache for frequently accessed data
2. **Database Cache**: MongoDB's internal caching
3. **HTTP Cache**: Response caching for static content

**Cache Configuration:**
```javascript
const cacheConfig = {
  users: { ttl: 1800 },      // 30 minutes
  universities: { ttl: 3600 }, // 1 hour
  faculties: { ttl: 3600 },   // 1 hour
  carts: { ttl: 900 },        // 15 minutes
  queries: { ttl: 7200 },     // 2 hours
  performance: { ttl: 300 }   // 5 minutes
};
```

#### Cache Strategies

**Cache-Aside Pattern:**
- Check cache before database query
- Update cache after database write
- Cache invalidation on data changes
- Fallback to database on cache miss

**Cache Key Design:**
```javascript
// Hierarchical cache keys
'users:list:page:1:limit:20:sort:name'
'users:profile:64f8a1b2c3d4e5f6a7b8c9d0'
'universities:location:colombo'
'stats:users:daily'
```

#### Cache Performance

**Cache Hit Ratio Optimization:**
- Monitoring cache hit/miss ratios
- Cache warming for frequently accessed data
- Intelligent cache eviction policies
- Cache size optimization

**Memory Management:**
- Maximum cache size limits
- LRU (Least Recently Used) eviction
- Memory usage monitoring
- Garbage collection optimization

### Response Optimization

#### Data Serialization

**JSON Response Optimization:**
- Minimal data transfer
- Field selection based on client needs
- Nested object flattening where appropriate
- Consistent response structure

**Pagination Optimization:**
```javascript
// Efficient pagination with total count
const [data, total] = await Promise.all([
  Model.find(filter).sort(sort).skip(skip).limit(limit).lean(),
  Model.countDocuments(filter)
]);
```

#### Compression

**Response Compression:**
- Gzip compression for all responses
- Compression level optimization
- Content-type specific compression
- Compression threshold configuration

**Compression Benefits:**
- Reduced bandwidth usage
- Faster response times
- Lower data transfer costs
- Improved user experience

### Memory Management

#### Memory Usage Optimization

**Efficient Data Structures:**
- Use of lean queries for read-only operations
- Streaming for large data sets
- Object pooling for frequently created objects
- Memory leak prevention

**Memory Monitoring:**
```javascript
// Memory usage tracking
const memoryUsage = process.memoryUsage();
console.log({
  heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
  heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
  external: Math.round(memoryUsage.external / 1024 / 1024),
  rss: Math.round(memoryUsage.rss / 1024 / 1024)
});
```

#### Garbage Collection

**GC Optimization:**
- Proper object lifecycle management
- Avoiding memory leaks in closures
- Efficient event listener cleanup
- Regular memory profiling

### Asynchronous Processing

#### Non-Blocking Operations

**Async/Await Pattern:**
- Proper error handling in async functions
- Parallel execution where possible
- Avoiding callback hell
- Promise optimization

**Example Parallel Processing:**
```javascript
// Parallel database operations
const [users, universities, stats] = await Promise.all([
  User.find({ active: true }).lean(),
  University.find({ active: true }).lean(),
  User.getStatistics()
]);
```

#### Event Loop Optimization

**CPU-Intensive Task Handling:**
- Worker threads for heavy computations
- Process.nextTick() usage optimization
- SetImmediate for I/O operations
- Avoiding blocking operations

### Network Performance

#### HTTP/2 Support

**Protocol Optimization:**
- HTTP/2 server push capabilities
- Multiplexed connections
- Header compression
- Binary protocol efficiency

#### Keep-Alive Connections

**Connection Reuse:**
- HTTP keep-alive headers
- Connection pooling for external APIs
- Persistent database connections
- WebSocket for real-time features

### Monitoring and Profiling

#### Performance Metrics

**Key Performance Indicators:**
- Response time percentiles (P50, P95, P99)
- Throughput (requests per second)
- Error rates
- Resource utilization

**Metrics Collection:**
```javascript
// Response time tracking
const startTime = Date.now();
// ... process request
const responseTime = Date.now() - startTime;
console.log(`Request processed in ${responseTime}ms`);
```

#### Application Profiling

**Performance Profiling Tools:**
- Node.js built-in profiler
- Memory heap snapshots
- CPU profiling
- Event loop lag monitoring

**Continuous Monitoring:**
- Real-time performance dashboards
- Automated performance testing
- Performance regression detection
- Capacity planning metrics

### Scalability Considerations

#### Horizontal Scaling

**Load Balancing:**
- Stateless application design
- Session data externalization
- Database connection distribution
- Health check endpoints for load balancers

#### Vertical Scaling

**Resource Optimization:**
- CPU usage optimization
- Memory allocation tuning
- I/O operation optimization
- Database query optimization

#### Auto-Scaling

**Dynamic Resource Allocation:**
- CPU and memory-based scaling triggers
- Request queue length monitoring
- Response time-based scaling
- Predictive scaling based on patterns

### Performance Testing

#### Load Testing

**Testing Strategy:**
- Gradual load increase testing
- Peak load testing
- Stress testing beyond normal capacity
- Endurance testing for memory leaks

**Testing Tools:**
- Artillery.js for load testing
- Apache Bench for simple tests
- Custom Node.js testing scripts
- Continuous performance testing

#### Performance Benchmarks

**Baseline Metrics:**
- Single request response time: < 100ms
- Concurrent user capacity: 1000+ users
- Database query time: < 50ms average
- Cache hit ratio: > 80%

**Performance Goals:**
- 99th percentile response time: < 500ms
- System availability: 99.9%
- Error rate: < 0.1%
- Memory usage: < 80% of available

## Testing

The Diyawanna Sup Backend includes a comprehensive testing strategy that covers unit tests, integration tests, and end-to-end testing to ensure code quality, functionality, and reliability.

### Testing Framework

#### Jest Configuration

The application uses Jest as the primary testing framework with the following configuration:

```json
{
  "testEnvironment": "node",
  "collectCoverageFrom": [
    "src/**/*.js",
    "!src/app.js",
    "!server.js"
  ],
  "coverageDirectory": "coverage",
  "coverageReporters": ["text", "lcov", "html"],
  "testMatch": ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  "setupFilesAfterEnv": ["<rootDir>/tests/setup.js"]
}
```

#### Test Scripts

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- user.test.js

# Run tests matching pattern
npm test -- --testNamePattern="authentication"
```

### Unit Testing

#### Service Layer Testing

Unit tests focus on testing individual functions and methods in isolation, particularly in the service layer where business logic resides.

**Example: User Service Tests**

```javascript
// tests/unit/services/userService.test.js
const UserService = require('../../../src/services/userService');
const User = require('../../../src/models/User');
const { CacheManager } = require('../../../src/config/cache');

// Mock dependencies
jest.mock('../../../src/models/User');
jest.mock('../../../src/config/cache');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return paginated users with default parameters', async () => {
      // Arrange
      const mockUsers = [
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ];
      
      User.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue(mockUsers)
            })
          })
        })
      });
      
      User.countDocuments.mockResolvedValue(2);
      CacheManager.get.mockReturnValue(null);

      // Act
      const result = await UserService.getAllUsers();

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUsers);
      expect(result.meta.totalItems).toBe(2);
      expect(User.find).toHaveBeenCalledWith({ active: true });
    });

    it('should apply university filter when provided', async () => {
      // Arrange
      const query = { university: 'Colombo' };
      User.find.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              lean: jest.fn().mockResolvedValue([])
            })
          })
        })
      });
      User.countDocuments.mockResolvedValue(0);
      CacheManager.get.mockReturnValue(null);

      // Act
      await UserService.getAllUsers(query);

      // Assert
      expect(User.find).toHaveBeenCalledWith({
        active: true,
        university: expect.any(RegExp)
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      };

      const mockUser = {
        _id: '123',
        ...userData,
        save: jest.fn().mockResolvedValue(true),
        toJSON: jest.fn().mockReturnValue({ _id: '123', ...userData })
      };

      User.findOne.mockResolvedValue(null);
      User.mockImplementation(() => mockUser);

      // Act
      const result = await UserService.createUser(userData);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data._id).toBe('123');
      expect(mockUser.save).toHaveBeenCalled();
      expect(CacheManager.clear).toHaveBeenCalledWith('users');
    });

    it('should throw error if username already exists', async () => {
      // Arrange
      const userData = { username: 'existinguser' };
      const existingUser = { username: 'existinguser' };
      User.findOne.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('Username already exists');
    });
  });
});
```

#### Utility Function Testing

```javascript
// tests/unit/utils/helpers.test.js
const {
  isValidObjectId,
  parsePagination,
  createPaginationMeta,
  sanitizeInput
} = require('../../../src/utils/helpers');

describe('Helper Functions', () => {
  describe('isValidObjectId', () => {
    it('should return true for valid ObjectId', () => {
      expect(isValidObjectId('64f8a1b2c3d4e5f6a7b8c9d0')).toBe(true);
    });

    it('should return false for invalid ObjectId', () => {
      expect(isValidObjectId('invalid-id')).toBe(false);
      expect(isValidObjectId('123')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
    });
  });

  describe('parsePagination', () => {
    it('should return default pagination values', () => {
      const result = parsePagination({});
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should parse custom pagination values', () => {
      const query = { page: '3', limit: '20', sort: 'name', order: 'asc' };
      const result = parsePagination(query);
      
      expect(result.page).toBe(3);
      expect(result.limit).toBe(20);
      expect(result.skip).toBe(40);
      expect(result.sort).toEqual({ name: 1 });
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>test'))
        .toBe('alert("xss")test');
    });

    it('should remove javascript: protocol', () => {
      expect(sanitizeInput('javascript:alert("xss")'))
        .toBe('alert("xss")');
    });
  });
});
```

### Integration Testing

#### API Endpoint Testing

Integration tests verify that different components work together correctly, particularly testing API endpoints with database interactions.

**Example: Authentication Integration Tests**

```javascript
// tests/integration/controllers/authController.test.js
const request = require('supertest');
const app = require('../../../src/app');
const User = require('../../../src/models/User');
const { connectDatabase, disconnectDatabase } = require('../../../src/config/database');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.password).toBeUndefined();

      // Verify user was created in database
      const user = await User.findOne({ username: userData.username });
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    it('should return error for duplicate username', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...userData, email: 'different@example.com' })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('already exists');
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User'
          // Missing required fields
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('required');
    });
  });

  describe('POST /api/auth/login', () => {
    let testUser;

    beforeEach(async () => {
      testUser = new User({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      });
      await testUser.save();
    });

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
      expect(response.body.user.username).toBe('testuser');
    });

    it('should reject invalid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid');
    });

    it('should reject inactive user', async () => {
      testUser.active = false;
      await testUser.save();

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('inactive');
    });
  });
});
```

#### Database Integration Testing

```javascript
// tests/integration/models/user.test.js
const User = require('../../../src/models/User');
const { connectDatabase, disconnectDatabase } = require('../../../src/config/database');

describe('User Model Integration', () => {
  beforeAll(async () => {
    await connectDatabase();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('User Creation', () => {
    it('should create user with hashed password', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      };

      const user = new User(userData);
      await user.save();

      expect(user.password).not.toBe('password123');
      expect(user.password).toMatch(/^\$2[aby]\$\d+\$/);
    });

    it('should enforce unique constraints', async () => {
      const userData = {
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      };

      await User.create(userData);

      await expect(User.create(userData))
        .rejects
        .toThrow(/duplicate key/);
    });
  });

  describe('User Methods', () => {
    let user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Test User',
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        age: 25,
        university: 'Test University'
      });
    });

    it('should compare passwords correctly', async () => {
      const isValid = await user.comparePassword('password123');
      expect(isValid).toBe(true);

      const isInvalid = await user.comparePassword('wrongpassword');
      expect(isInvalid).toBe(false);
    });

    it('should update login info', async () => {
      const originalLoginCount = user.loginCount;
      await user.updateLoginInfo();

      expect(user.loginCount).toBe(originalLoginCount + 1);
      expect(user.lastLogin).toBeDefined();
    });
  });

  describe('Static Methods', () => {
    beforeEach(async () => {
      await User.create([
        {
          name: 'User 1',
          username: 'user1',
          email: 'user1@example.com',
          password: 'password123',
          age: 25,
          university: 'University A'
        },
        {
          name: 'User 2',
          username: 'user2',
          email: 'user2@example.com',
          password: 'password123',
          age: 30,
          university: 'University B'
        }
      ]);
    });

    it('should find users by university', async () => {
      const users = await User.findByUniversity('University A');
      expect(users).toHaveLength(1);
      expect(users[0].university).toBe('University A');
    });

    it('should find users by age range', async () => {
      const users = await User.findByAgeRange(20, 28);
      expect(users).toHaveLength(1);
      expect(users[0].age).toBe(25);
    });

    it('should get user statistics', async () => {
      const stats = await User.getStatistics();
      expect(stats.totalUsers).toBe(2);
      expect(stats.activeUsers).toBe(2);
      expect(stats.averageAge).toBe(27.5);
    });
  });
});
```

### Test Coverage

#### Coverage Goals

The project maintains high test coverage standards:

- **Overall Coverage**: > 90%
- **Function Coverage**: > 95%
- **Line Coverage**: > 90%
- **Branch Coverage**: > 85%

#### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View HTML coverage report
open coverage/lcov-report/index.html
```

**Coverage Report Example:**
```
=============================== Coverage summary ===============================
Statements   : 92.5% ( 1850/2000 )
Branches     : 87.3% ( 873/1000 )
Functions    : 95.2% ( 476/500 )
Lines        : 91.8% ( 1836/2000 )
================================================================================
```

### Test Data Management

#### Test Database Setup

```javascript
// tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
```

#### Test Data Factories

```javascript
// tests/factories/userFactory.js
const User = require('../../src/models/User');

const userFactory = {
  build: (overrides = {}) => ({
    name: 'Test User',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    age: 25,
    university: 'Test University',
    ...overrides
  }),

  create: async (overrides = {}) => {
    const userData = userFactory.build(overrides);
    return await User.create(userData);
  },

  createMany: async (count, overrides = {}) => {
    const users = [];
    for (let i = 0; i < count; i++) {
      const userData = userFactory.build({
        username: `testuser${i}`,
        email: `test${i}@example.com`,
        ...overrides
      });
      users.push(userData);
    }
    return await User.create(users);
  }
};

module.exports = userFactory;
```

### Continuous Integration

#### GitHub Actions Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run tests
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
```

### Performance Testing

#### Load Testing with Artillery

```yaml
# tests/load/load-test.yml
config:
  target: 'http://localhost:8080'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100

scenarios:
  - name: "Authentication Flow"
    weight: 30
    flow:
      - post:
          url: "/api/auth/register"
          json:
            name: "Load Test User"
            username: "loadtest{{ $randomString() }}"
            email: "loadtest{{ $randomString() }}@example.com"
            password: "password123"
            age: 25
            university: "Load Test University"
      - post:
          url: "/api/auth/login"
          json:
            username: "{{ username }}"
            password: "password123"
          capture:
            - json: "$.token"
              as: "token"

  - name: "User Operations"
    weight: 70
    flow:
      - get:
          url: "/api/users"
          headers:
            Authorization: "Bearer {{ token }}"
      - get:
          url: "/api/users/stats"
          headers:
            Authorization: "Bearer {{ token }}"
```

```bash
# Run load tests
npx artillery run tests/load/load-test.yml
```

### Testing Best Practices

#### Test Organization

**File Structure:**
```
tests/
├── unit/
│   ├── services/
│   ├── utils/
│   └── models/
├── integration/
│   ├── controllers/
│   └── middleware/
├── load/
├── factories/
└── setup.js
```

#### Test Writing Guidelines

1. **Descriptive Test Names**: Use clear, descriptive test names that explain what is being tested
2. **AAA Pattern**: Arrange, Act, Assert structure for test clarity
3. **Test Isolation**: Each test should be independent and not rely on other tests
4. **Mock External Dependencies**: Mock external services and databases in unit tests
5. **Test Edge Cases**: Include tests for error conditions and edge cases
6. **Consistent Test Data**: Use factories for consistent test data generation

#### Debugging Tests

```bash
# Run tests in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand

# Run specific test file in debug mode
node --inspect-brk node_modules/.bin/jest --runInBand user.test.js

# Run tests with verbose output
npm test -- --verbose

# Run tests and watch for changes
npm run test:watch
```


## Error Handling

The Diyawanna Sup Backend implements a comprehensive error handling strategy that provides meaningful error messages, maintains system stability, and ensures proper logging for debugging and monitoring purposes.

### Error Handling Architecture

#### Global Error Handler

The application uses a centralized error handling middleware that catches all errors and formats them consistently:

```javascript
// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new AppError(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error'
  });
};
```

#### Custom Error Classes

**Base Error Class:**
```javascript
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
```

**Specific Error Types:**
- `AuthenticationError`: Authentication failures (401)
- `AuthorizationError`: Authorization failures (403)
- `ValidationError`: Input validation errors (400)
- `NotFoundError`: Resource not found (404)
- `ConflictError`: Resource conflicts (409)
- `RateLimitError`: Rate limit exceeded (429)

### Error Response Format

#### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully"
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* additional error details */ }
}
```

#### Validation Error Response
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "Name is required",
    "Email must be valid",
    "Age must be between 13 and 120"
  ]
}
```

### Error Logging

#### Structured Logging

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});
```

#### Error Categories

- **System Errors**: Database connection failures, server crashes
- **Application Errors**: Business logic violations, validation failures
- **Security Errors**: Authentication failures, authorization violations
- **Performance Errors**: Timeout errors, resource exhaustion

### Error Recovery

#### Graceful Degradation

- Cache fallback when database is unavailable
- Default responses for non-critical failures
- Circuit breaker pattern for external services
- Retry mechanisms for transient failures

#### Health Monitoring

- Automatic error rate monitoring
- Alert thresholds for critical errors
- Health check endpoints for system status
- Performance metric tracking

## Deployment

The Diyawanna Sup Backend supports multiple deployment strategies to accommodate different environments and requirements, from development to production-scale deployments.

### Environment Preparation

#### Production Environment Requirements

**System Requirements:**
- Node.js 22.14.0 or higher
- MongoDB 7.0+ (Atlas recommended for production)
- Minimum 2GB RAM
- Minimum 1 CPU core
- 10GB storage space

**Network Requirements:**
- HTTPS certificate (Let's Encrypt recommended)
- Domain name configuration
- Firewall configuration (ports 80, 443, 8080)
- Load balancer setup (for high availability)

### Docker Deployment

#### Dockerfile

```dockerfile
# Use official Node.js runtime as base image
FROM node:22.14.0-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["npm", "start"]
```

#### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - mongo
    restart: unless-stopped
    networks:
      - app-network

  mongo:
    image: mongo:7.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_ROOT_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_ROOT_PASSWORD}
    volumes:
      - mongo-data:/data/db
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - app-network

volumes:
  mongo-data:

networks:
  app-network:
    driver: bridge
```

#### Deployment Commands

```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Update application
docker-compose pull
docker-compose up -d
```

### Cloud Deployment

#### AWS Deployment

**Using AWS ECS:**
```json
{
  "family": "diyawanna-sup-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "app",
      "image": "your-account.dkr.ecr.region.amazonaws.com/diyawanna-sup-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "MONGODB_URI",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:mongodb-uri"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/diyawanna-sup-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

#### Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create Heroku app
heroku create diyawanna-sup-backend

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-jwt-secret

# Deploy application
git push heroku main

# View logs
heroku logs --tail
```

#### DigitalOcean App Platform

```yaml
# .do/app.yaml
name: diyawanna-sup-backend
services:
- name: api
  source_dir: /
  github:
    repo: your-username/diyawanna-sup-backend
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
  - key: MONGODB_URI
    value: ${MONGODB_URI}
    type: SECRET
  - key: JWT_SECRET
    value: ${JWT_SECRET}
    type: SECRET
  http_port: 8080
  health_check:
    http_path: /api/health
```

### Reverse Proxy Configuration

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/diyawanna-sup-backend
upstream backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
    server 127.0.0.1:8082;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /api/health {
        proxy_pass http://backend;
        access_log off;
    }
}
```

### Process Management

#### PM2 Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'diyawanna-sup-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 8080
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js --env production

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Restart application
pm2 restart diyawanna-sup-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

### Monitoring and Logging

#### Application Monitoring

```javascript
// monitoring.js
const prometheus = require('prom-client');

// Create metrics
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

const httpRequestTotal = new prometheus.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Middleware to collect metrics
const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route ? req.route.path : req.path;
    
    httpRequestDuration
      .labels(req.method, route, res.statusCode)
      .observe(duration);
    
    httpRequestTotal
      .labels(req.method, route, res.statusCode)
      .inc();
  });
  
  next();
};

module.exports = { metricsMiddleware };
```

#### Log Aggregation

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  app:
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200

volumes:
  elasticsearch-data:
```

### Backup and Recovery

#### Database Backup

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="diyawanna_sup_main"

# Create backup
mongodump --uri="$MONGODB_URI" --db="$DB_NAME" --out="$BACKUP_DIR/$DATE"

# Compress backup
tar -czf "$BACKUP_DIR/$DATE.tar.gz" -C "$BACKUP_DIR" "$DATE"

# Remove uncompressed backup
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$DATE.tar.gz"
```

#### Automated Backup with Cron

```bash
# Add to crontab
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Security Considerations

#### SSL/TLS Configuration

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Firewall Configuration

```bash
# UFW firewall setup
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### Environment Security

```bash
# Secure environment variables
chmod 600 .env
chown root:root .env

# Use secrets management
export MONGODB_URI=$(aws secretsmanager get-secret-value --secret-id mongodb-uri --query SecretString --output text)
```

## Contributing

We welcome contributions to the Diyawanna Sup Backend project! This section provides guidelines for contributing code, reporting issues, and suggesting improvements.

### Getting Started

#### Development Setup

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/diyawanna-sup-backend-nodejs.git
   cd diyawanna-sup-backend-nodejs
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

#### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following project conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Test Changes**
   ```bash
   npm test
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Standards

#### Coding Conventions

**JavaScript Style:**
- Use ES6+ features and async/await
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for functions and classes

**File Organization:**
- Group related functionality in modules
- Use consistent file naming (camelCase)
- Keep files focused and reasonably sized
- Follow established directory structure

**Example Code Style:**
```javascript
/**
 * Create a new user account
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @returns {Promise<Object>} Created user object
 * @throws {ValidationError} When user data is invalid
 */
async function createUser(userData) {
  try {
    // Validate input data
    const validatedData = await validateUserData(userData);
    
    // Check for existing user
    const existingUser = await User.findOne({ 
      email: validatedData.email 
    });
    
    if (existingUser) {
      throw new ConflictError('User already exists');
    }
    
    // Create new user
    const user = new User(validatedData);
    await user.save();
    
    return user.toJSON();
  } catch (error) {
    logger.error('Failed to create user', { error: error.message });
    throw error;
  }
}
```

#### Testing Standards

**Test Requirements:**
- Write unit tests for all new functions
- Add integration tests for API endpoints
- Maintain test coverage above 90%
- Use descriptive test names and clear assertions

**Test Example:**
```javascript
describe('UserService.createUser', () => {
  it('should create a new user with valid data', async () => {
    // Arrange
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    };
    
    // Act
    const result = await UserService.createUser(userData);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.data.email).toBe(userData.email);
    expect(result.data.password).toBeUndefined();
  });
});
```

### Contribution Types

#### Bug Reports

When reporting bugs, please include:

1. **Bug Description**: Clear description of the issue
2. **Steps to Reproduce**: Detailed steps to recreate the bug
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Node.js version, OS, etc.
6. **Error Messages**: Full error messages and stack traces

**Bug Report Template:**
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Step one
2. Step two
3. Step three

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node.js version: 22.14.0
- npm version: 10.9.2
- OS: Ubuntu 22.04
- MongoDB version: 7.0

## Error Messages
```
Error message here
```

## Additional Context
Any additional information
```

#### Feature Requests

For feature requests, please provide:

1. **Feature Description**: Clear description of the proposed feature
2. **Use Case**: Why this feature would be useful
3. **Implementation Ideas**: Suggestions for implementation
4. **Alternatives**: Alternative solutions considered

#### Pull Requests

**Pull Request Guidelines:**

1. **Clear Title**: Descriptive title following conventional commits
2. **Description**: Detailed description of changes
3. **Testing**: Evidence that changes have been tested
4. **Documentation**: Updated documentation if needed
5. **Breaking Changes**: Note any breaking changes

**Pull Request Template:**
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added for new functionality
```

### Code Review Process

#### Review Criteria

**Code Quality:**
- Follows project coding standards
- Includes appropriate tests
- Has clear, readable code
- Includes necessary documentation

**Functionality:**
- Solves the intended problem
- Doesn't introduce new bugs
- Maintains backward compatibility
- Follows security best practices

#### Review Timeline

- **Initial Review**: Within 2-3 business days
- **Follow-up Reviews**: Within 1-2 business days
- **Merge**: After approval from at least one maintainer

### Community Guidelines

#### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- Be respectful and constructive in discussions
- Welcome newcomers and help them get started
- Focus on what is best for the community
- Show empathy towards other community members

#### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and discussions
- **Pull Requests**: Code contributions and reviews

### Recognition

Contributors will be recognized in:

- **CONTRIBUTORS.md**: List of all contributors
- **Release Notes**: Major contributions highlighted
- **GitHub**: Contributor badges and statistics

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License

```
MIT License

Copyright (c) 2024 Diyawanna Sup Backend Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Third-Party Licenses

This project uses several open-source packages. Key dependencies and their licenses:

- **Express.js**: MIT License
- **Mongoose**: MIT License
- **bcryptjs**: MIT License
- **jsonwebtoken**: MIT License
- **joi**: BSD-3-Clause License
- **helmet**: MIT License
- **cors**: MIT License
- **morgan**: MIT License
- **compression**: MIT License
- **nodemon**: MIT License
- **jest**: MIT License

For a complete list of dependencies and their licenses, run:
```bash
npm list --depth=0
```

### Contributing License Agreement

By contributing to this project, you agree that your contributions will be licensed under the same MIT License that covers the project. You also represent that you have the right to make such contributions.

---

## Support

If you encounter any issues or have questions about the Diyawanna Sup Backend, please:

1. **Check the Documentation**: Review this README and the API documentation
2. **Search Existing Issues**: Look through GitHub issues for similar problems
3. **Create a New Issue**: If you can't find a solution, create a detailed issue report
4. **Contact the Team**: For urgent matters, contact the development team

### Useful Resources

- **API Documentation**: Comprehensive API endpoint documentation
- **Postman Collection**: Pre-configured API testing collection
- **Example Configurations**: Sample configuration files for different environments
- **Troubleshooting Guide**: Common issues and solutions

### Version Information

- **Current Version**: 1.0.0
- **Node.js Compatibility**: 22.14.0+
- **MongoDB Compatibility**: 7.0+
- **Last Updated**: January 2024

---

**Built with ❤️ by the Diyawanna Sup Backend Team**

*This project is a complete Node.js re-implementation of the original Java Spring Boot application, designed to provide modern, scalable, and maintainable backend services for educational institutions.*

