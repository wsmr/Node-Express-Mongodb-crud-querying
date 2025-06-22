/**
 * University Model
 * 
 * This file defines the University schema for MongoDB using Mongoose.
 */

const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'University name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'University name must be at least 2 characters long'],
    maxlength: [200, 'University name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters long'],
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  website: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL']
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^[+]?[0-9\s\-()]+$/, 'Please enter a valid phone number']
  },
  faculties: [{
    type: String,
    trim: true
  }],
  active: {
    type: Boolean,
    default: true
  },
  establishedYear: {
    type: Number,
    min: [1000, 'Established year must be a valid year'],
    max: [new Date().getFullYear(), 'Established year cannot be in the future']
  },
  type: {
    type: String,
    enum: ['public', 'private', 'international'],
    default: 'public'
  },
  ranking: {
    national: Number,
    international: Number
  },
  studentCount: {
    type: Number,
    min: [0, 'Student count cannot be negative']
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
universitySchema.index({ name: 1 }, { unique: true });
universitySchema.index({ location: 1 });
universitySchema.index({ active: 1 });
universitySchema.index({ faculties: 1 });
universitySchema.index({ type: 1 });
universitySchema.index({ 'ranking.national': 1 });

// Virtual for university summary
universitySchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    location: this.location,
    type: this.type,
    facultyCount: this.faculties.length,
    active: this.active,
    establishedYear: this.establishedYear
  };
});

// Static method to find active universities
universitySchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find by location
universitySchema.statics.findByLocation = function(location) {
  return this.find({
    location: new RegExp(location, 'i'),
    active: true
  });
};

// Static method to search by name
universitySchema.statics.searchByName = function(name) {
  return this.find({
    name: new RegExp(name, 'i'),
    active: true
  });
};

// Static method to find by type
universitySchema.statics.findByType = function(type) {
  return this.find({ type, active: true });
};

// Static method to get universities with specific faculty
universitySchema.statics.findWithFaculty = function(faculty) {
  return this.find({
    faculties: new RegExp(faculty, 'i'),
    active: true
  });
};

// Instance method to add faculty
universitySchema.methods.addFaculty = function(facultyName) {
  if (!this.faculties.includes(facultyName)) {
    this.faculties.push(facultyName);
  }
  return this.save();
};

// Instance method to remove faculty
universitySchema.methods.removeFaculty = function(facultyName) {
  this.faculties = this.faculties.filter(faculty => faculty !== facultyName);
  return this.save();
};

// Static method to get university statistics
universitySchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalUniversities: { $sum: 1 },
        activeUniversities: {
          $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
        },
        inactiveUniversities: {
          $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] }
        },
        locations: { $addToSet: '$location' },
        types: { $addToSet: '$type' },
        totalStudents: { $sum: '$studentCount' },
        averageStudents: { $avg: '$studentCount' }
      }
    },
    {
      $project: {
        _id: 0,
        totalUniversities: 1,
        activeUniversities: 1,
        inactiveUniversities: 1,
        locationsCount: { $size: '$locations' },
        typesCount: { $size: '$types' },
        totalStudents: 1,
        averageStudents: { $round: ['$averageStudents', 0] }
      }
    }
  ]);

  return stats[0] || {
    totalUniversities: 0,
    activeUniversities: 0,
    inactiveUniversities: 0,
    locationsCount: 0,
    typesCount: 0,
    totalStudents: 0,
    averageStudents: 0
  };
};

// Pre-save middleware to update faculties array
universitySchema.pre('save', function(next) {
  // Remove duplicates from faculties array
  if (this.faculties) {
    this.faculties = [...new Set(this.faculties)];
  }
  next();
});

module.exports = mongoose.model('University', universitySchema);

