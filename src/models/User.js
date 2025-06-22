/**
 * User Model
 * 
 * This file defines the User schema for MongoDB using Mongoose.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters'],
    match: [/^[a-zA-Z0-9]+$/, 'Username can only contain alphanumeric characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [13, 'Age must be at least 13'],
    max: [120, 'Age cannot exceed 120']
  },
  university: {
    type: String,
    required: [true, 'University is required'],
    trim: true,
    minlength: [2, 'University name must be at least 2 characters long'],
    maxlength: [200, 'University name cannot exceed 200 characters']
  },
  school: {
    type: String,
    trim: true,
    maxlength: [200, 'School name cannot exceed 200 characters']
  },
  work: {
    type: String,
    trim: true,
    maxlength: [200, 'Work description cannot exceed 200 characters']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  active: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ active: 1 });
userSchema.index({ university: 1 });
userSchema.index({ age: 1 });
userSchema.index({ createdAt: 1 });
userSchema.index({ active: 1, university: 1 });

// Virtual for user's full profile
userSchema.virtual('profile').get(function() {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    email: this.email,
    age: this.age,
    university: this.university,
    school: this.school,
    work: this.work,
    role: this.role,
    active: this.active,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
    lastLogin: this.lastLogin,
    loginCount: this.loginCount
  };
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to update login info
userSchema.methods.updateLoginInfo = async function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return await this.save();
};

// Static method to find active users
userSchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find by university
userSchema.statics.findByUniversity = function(university) {
  return this.find({ university: new RegExp(university, 'i'), active: true });
};

// Static method to find by age range
userSchema.statics.findByAgeRange = function(minAge, maxAge) {
  const query = { active: true };
  
  if (minAge !== undefined) {
    query.age = { $gte: minAge };
  }
  
  if (maxAge !== undefined) {
    query.age = query.age ? { ...query.age, $lte: maxAge } : { $lte: maxAge };
  }
  
  return this.find(query);
};

// Static method to search by name
userSchema.statics.searchByName = function(name) {
  return this.find({
    name: new RegExp(name, 'i'),
    active: true
  });
};

// Static method to get user statistics
userSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
        },
        inactiveUsers: {
          $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] }
        },
        averageAge: { $avg: '$age' },
        universities: { $addToSet: '$university' }
      }
    },
    {
      $project: {
        _id: 0,
        totalUsers: 1,
        activeUsers: 1,
        inactiveUsers: 1,
        averageAge: { $round: ['$averageAge', 1] },
        universitiesRepresented: { $size: '$universities' }
      }
    }
  ]);

  // Get recent registrations (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  const recentRegistrations = await this.countDocuments({
    createdAt: { $gte: sevenDaysAgo }
  });

  return {
    ...stats[0],
    recentRegistrations
  };
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);

