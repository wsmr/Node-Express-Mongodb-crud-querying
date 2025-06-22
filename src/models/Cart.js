/**
 * Cart Model
 * 
 * This file defines the Cart schema for MongoDB using Mongoose.
 */

const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: [true, 'Product ID is required'],
    trim: true
  },
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters long'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    max: [1000, 'Quantity cannot exceed 1000']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
}, {
  _id: true
});

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Cart name is required'],
    trim: true,
    minlength: [2, 'Cart name must be at least 2 characters long'],
    maxlength: [100, 'Cart name cannot exceed 100 characters']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    default: 0,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  active: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  completedAt: {
    type: Date
  },
  expiresAt: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
cartSchema.index({ userId: 1 });
cartSchema.index({ status: 1 });
cartSchema.index({ active: 1 });
cartSchema.index({ userId: 1, status: 1, active: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    userId: this.userId,
    itemCount: this.items.length,
    totalAmount: this.totalAmount,
    status: this.status,
    active: this.active,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
});

// Virtual to populate user information
cartSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true
});

// Pre-save middleware to calculate total amount
cartSchema.pre('save', function(next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce((total, item) => {
      return total + (item.quantity * item.price);
    }, 0);
  } else {
    this.totalAmount = 0;
  }
  
  // Set completedAt when status changes to COMPLETED
  if (this.status === 'COMPLETED' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  next();
});

// Static method to find active carts
cartSchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find by user
cartSchema.statics.findByUser = function(userId) {
  return this.find({ userId, active: true });
};

// Static method to find by status
cartSchema.statics.findByStatus = function(status) {
  return this.find({ status, active: true });
};

// Instance method to add item
cartSchema.methods.addItem = function(item) {
  // Check if item already exists
  const existingItemIndex = this.items.findIndex(
    cartItem => cartItem.productId === item.productId
  );
  
  if (existingItemIndex > -1) {
    // Update existing item quantity
    this.items[existingItemIndex].quantity += item.quantity;
    this.items[existingItemIndex].price = item.price; // Update price
  } else {
    // Add new item
    this.items.push(item);
  }
  
  return this.save();
};

// Instance method to remove item
cartSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId);
  return this.save();
};

// Instance method to update item quantity
cartSchema.methods.updateItemQuantity = function(itemId, quantity) {
  const item = this.items.find(item => item._id.toString() === itemId);
  if (item) {
    item.quantity = quantity;
  }
  return this.save();
};

// Instance method to clear all items
cartSchema.methods.clearItems = function() {
  this.items = [];
  return this.save();
};

// Instance method to complete cart
cartSchema.methods.complete = function() {
  this.status = 'COMPLETED';
  this.completedAt = new Date();
  return this.save();
};

// Instance method to cancel cart
cartSchema.methods.cancel = function() {
  this.status = 'CANCELLED';
  return this.save();
};

// Static method to get cart statistics
cartSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCarts: { $sum: 1 },
        activeCarts: {
          $sum: { $cond: [{ $eq: ['$status', 'ACTIVE'] }, 1, 0] }
        },
        completedCarts: {
          $sum: { $cond: [{ $eq: ['$status', 'COMPLETED'] }, 1, 0] }
        },
        cancelledCarts: {
          $sum: { $cond: [{ $eq: ['$status', 'CANCELLED'] }, 1, 0] }
        },
        totalValue: { $sum: '$totalAmount' },
        averageValue: { $avg: '$totalAmount' },
        totalItems: { $sum: { $size: '$items' } },
        users: { $addToSet: '$userId' }
      }
    },
    {
      $project: {
        _id: 0,
        totalCarts: 1,
        activeCarts: 1,
        completedCarts: 1,
        cancelledCarts: 1,
        totalValue: { $round: ['$totalValue', 2] },
        averageValue: { $round: ['$averageValue', 2] },
        totalItems: 1,
        uniqueUsers: { $size: '$users' }
      }
    }
  ]);

  return stats[0] || {
    totalCarts: 0,
    activeCarts: 0,
    completedCarts: 0,
    cancelledCarts: 0,
    totalValue: 0,
    averageValue: 0,
    totalItems: 0,
    uniqueUsers: 0
  };
};

// Static method to find expired carts
cartSchema.statics.findExpired = function() {
  return this.find({
    expiresAt: { $lt: new Date() },
    status: 'ACTIVE'
  });
};

// Static method to cleanup expired carts
cartSchema.statics.cleanupExpired = async function() {
  const expiredCarts = await this.findExpired();
  
  for (const cart of expiredCarts) {
    cart.status = 'CANCELLED';
    await cart.save();
  }
  
  return expiredCarts.length;
};

module.exports = mongoose.model('Cart', cartSchema);

