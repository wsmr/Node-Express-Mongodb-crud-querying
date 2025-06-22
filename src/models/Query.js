/**
 * Query Model
 * 
 * This file defines the Query schema for MongoDB using Mongoose.
 */

const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Parameter name is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Parameter type is required'],
    enum: ['string', 'number', 'boolean', 'date', 'objectId'],
    default: 'string'
  },
  required: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [200, 'Parameter description cannot exceed 200 characters']
  },
  defaultValue: {
    type: mongoose.Schema.Types.Mixed
  },
  validation: {
    min: Number,
    max: Number,
    pattern: String,
    enum: [String]
  }
}, {
  _id: false
});

const querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Query name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Query name must be at least 2 characters long'],
    maxlength: [100, 'Query name cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  collection: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true,
    enum: ['users', 'universities', 'faculties', 'carts'],
    lowercase: true
  },
  query: {
    type: mongoose.Schema.Types.Mixed,
    required: [true, 'Query object is required']
  },
  parameters: [parameterSchema],
  active: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    enum: ['search', 'filter', 'aggregate', 'report'],
    default: 'search'
  },
  executionCount: {
    type: Number,
    default: 0
  },
  lastExecuted: {
    type: Date
  },
  averageExecutionTime: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
querySchema.index({ name: 1 }, { unique: true });
querySchema.index({ collection: 1 });
querySchema.index({ active: 1 });
querySchema.index({ category: 1 });
querySchema.index({ tags: 1 });
querySchema.index({ createdAt: 1 });

// Virtual for query summary
querySchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    description: this.description,
    collection: this.collection,
    category: this.category,
    parameterCount: this.parameters.length,
    executionCount: this.executionCount,
    active: this.active,
    lastExecuted: this.lastExecuted
  };
});

// Static method to find active queries
querySchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find by collection
querySchema.statics.findByCollection = function(collection) {
  return this.find({ collection, active: true });
};

// Static method to find by category
querySchema.statics.findByCategory = function(category) {
  return this.find({ category, active: true });
};

// Static method to search by name or description
querySchema.statics.search = function(searchTerm) {
  return this.find({
    $or: [
      { name: new RegExp(searchTerm, 'i') },
      { description: new RegExp(searchTerm, 'i') },
      { tags: new RegExp(searchTerm, 'i') }
    ],
    active: true
  });
};

// Instance method to validate parameters
querySchema.methods.validateParameters = function(providedParams) {
  const errors = [];
  
  // Check required parameters
  for (const param of this.parameters) {
    if (param.required && !providedParams.hasOwnProperty(param.name)) {
      errors.push(`Required parameter '${param.name}' is missing`);
    }
  }
  
  // Validate parameter types and values
  for (const [paramName, paramValue] of Object.entries(providedParams)) {
    const paramDef = this.parameters.find(p => p.name === paramName);
    
    if (!paramDef) {
      errors.push(`Unknown parameter '${paramName}'`);
      continue;
    }
    
    // Type validation
    switch (paramDef.type) {
      case 'number':
        if (isNaN(paramValue)) {
          errors.push(`Parameter '${paramName}' must be a number`);
        }
        break;
      case 'boolean':
        if (typeof paramValue !== 'boolean') {
          errors.push(`Parameter '${paramName}' must be a boolean`);
        }
        break;
      case 'date':
        if (isNaN(Date.parse(paramValue))) {
          errors.push(`Parameter '${paramName}' must be a valid date`);
        }
        break;
      case 'objectId':
        if (!mongoose.Types.ObjectId.isValid(paramValue)) {
          errors.push(`Parameter '${paramName}' must be a valid ObjectId`);
        }
        break;
    }
    
    // Range validation for numbers
    if (paramDef.type === 'number' && !isNaN(paramValue)) {
      if (paramDef.validation) {
        if (paramDef.validation.min !== undefined && paramValue < paramDef.validation.min) {
          errors.push(`Parameter '${paramName}' must be at least ${paramDef.validation.min}`);
        }
        if (paramDef.validation.max !== undefined && paramValue > paramDef.validation.max) {
          errors.push(`Parameter '${paramName}' must be at most ${paramDef.validation.max}`);
        }
      }
    }
    
    // Enum validation
    if (paramDef.validation && paramDef.validation.enum) {
      if (!paramDef.validation.enum.includes(paramValue)) {
        errors.push(`Parameter '${paramName}' must be one of: ${paramDef.validation.enum.join(', ')}`);
      }
    }
  }
  
  return errors;
};

// Instance method to substitute parameters in query
querySchema.methods.substituteParameters = function(parameters) {
  let queryString = JSON.stringify(this.query);
  
  // Replace parameter placeholders with actual values
  for (const [paramName, paramValue] of Object.entries(parameters)) {
    const placeholder = `{{${paramName}}}`;
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    
    // Handle different parameter types
    let substitutionValue;
    const paramDef = this.parameters.find(p => p.name === paramName);
    
    if (paramDef) {
      switch (paramDef.type) {
        case 'number':
          substitutionValue = Number(paramValue);
          break;
        case 'boolean':
          substitutionValue = Boolean(paramValue);
          break;
        case 'date':
          substitutionValue = new Date(paramValue);
          break;
        case 'objectId':
          substitutionValue = new mongoose.Types.ObjectId(paramValue);
          break;
        default:
          substitutionValue = paramValue;
      }
    } else {
      substitutionValue = paramValue;
    }
    
    queryString = queryString.replace(regex, JSON.stringify(substitutionValue));
  }
  
  return JSON.parse(queryString);
};

// Instance method to record execution
querySchema.methods.recordExecution = function(executionTime) {
  this.executionCount += 1;
  this.lastExecuted = new Date();
  
  // Update average execution time
  if (this.averageExecutionTime === 0) {
    this.averageExecutionTime = executionTime;
  } else {
    this.averageExecutionTime = (this.averageExecutionTime + executionTime) / 2;
  }
  
  return this.save();
};

// Static method to get query statistics
querySchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalQueries: { $sum: 1 },
        activeQueries: {
          $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
        },
        inactiveQueries: {
          $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] }
        },
        totalExecutions: { $sum: '$executionCount' },
        averageExecutionTime: { $avg: '$averageExecutionTime' },
        collections: { $addToSet: '$collection' },
        categories: { $addToSet: '$category' }
      }
    },
    {
      $project: {
        _id: 0,
        totalQueries: 1,
        activeQueries: 1,
        inactiveQueries: 1,
        totalExecutions: 1,
        averageExecutionTime: { $round: ['$averageExecutionTime', 2] },
        collectionsCount: { $size: '$collections' },
        categoriesCount: { $size: '$categories' }
      }
    }
  ]);

  return stats[0] || {
    totalQueries: 0,
    activeQueries: 0,
    inactiveQueries: 0,
    totalExecutions: 0,
    averageExecutionTime: 0,
    collectionsCount: 0,
    categoriesCount: 0
  };
};

// Static method to get popular queries
querySchema.statics.getPopularQueries = function(limit = 10) {
  return this.find({ active: true })
    .sort({ executionCount: -1 })
    .limit(limit)
    .select('name description collection category executionCount lastExecuted');
};

module.exports = mongoose.model('Query', querySchema);

