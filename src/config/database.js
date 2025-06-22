/**
 * Database Configuration
 * 
 * This file handles MongoDB connection setup, configuration, and connection management.
 */

const mongoose = require('mongoose');

/**
 * MongoDB connection options
 */
const connectionOptions = {
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 20,
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE) || 5,
  maxIdleTimeMS: parseInt(process.env.MONGODB_MAX_IDLE_TIME) || 30000,
  serverSelectionTimeoutMS: parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT) || 45000,
  bufferMaxEntries: 0,
  bufferCommands: false,
};

/**
 * Connect to MongoDB database
 */
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }

    // Set mongoose options
    mongoose.set('strictQuery', false);

    // Connect to MongoDB
    await mongoose.connect(mongoUri, connectionOptions);

    console.log(`📊 Connected to MongoDB: ${mongoose.connection.name}`);

    // Connection event handlers
    mongoose.connection.on('error', (error) => {
      console.error('❌ MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('📊 MongoDB connection closed through app termination');
    });

    return mongoose.connection;

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

/**
 * Disconnect from MongoDB database
 */
async function disconnectDatabase() {
  try {
    await mongoose.connection.close();
    console.log('📊 MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
    throw error;
  }
}

/**
 * Get database connection status
 */
function getConnectionStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  return {
    status: states[mongoose.connection.readyState] || 'unknown',
    host: mongoose.connection.host,
    port: mongoose.connection.port,
    name: mongoose.connection.name
  };
}

/**
 * Create database indexes for optimization
 */
async function createIndexes() {
  try {
    const db = mongoose.connection.db;

    // Users collection indexes
    await db.collection('users').createIndexes([
      { key: { username: 1 }, unique: true },
      { key: { email: 1 }, unique: true },
      { key: { active: 1 } },
      { key: { university: 1 } },
      { key: { age: 1 } },
      { key: { createdAt: 1 } },
      { key: { active: 1, university: 1 } }
    ]);

    // Universities collection indexes
    await db.collection('universities').createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { location: 1 } },
      { key: { active: 1 } },
      { key: { faculties: 1 } }
    ]);

    // Faculties collection indexes
    await db.collection('faculties').createIndexes([
      { key: { name: 1 } },
      { key: { universityId: 1 } },
      { key: { active: 1 } },
      { key: { subjects: 1 } },
      { key: { universityId: 1, active: 1 } }
    ]);

    // Carts collection indexes
    await db.collection('carts').createIndexes([
      { key: { userId: 1 } },
      { key: { status: 1 } },
      { key: { active: 1 } },
      { key: { userId: 1, status: 1, active: 1 } }
    ]);

    // Queries collection indexes
    await db.collection('queries').createIndexes([
      { key: { name: 1 }, unique: true },
      { key: { collection: 1 } },
      { key: { active: 1 } },
      { key: { createdAt: 1 } }
    ]);

    console.log('📊 Database indexes created successfully');

  } catch (error) {
    console.error('❌ Error creating database indexes:', error.message);
    // Don't throw error as indexes might already exist
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
  getConnectionStatus,
  createIndexes
};

