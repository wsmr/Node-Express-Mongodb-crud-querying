/**
 * Faculty Model
 * 
 * This file defines the Faculty schema for MongoDB using Mongoose.
 */

const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Faculty name is required'],
    trim: true,
    minlength: [2, 'Faculty name must be at least 2 characters long'],
    maxlength: [200, 'Faculty name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: [true, 'University ID is required']
  },
  dean: {
    type: String,
    trim: true,
    maxlength: [100, 'Dean name cannot exceed 100 characters']
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
  subjects: [{
    type: String,
    trim: true,
    minlength: [2, 'Subject name must be at least 2 characters long'],
    maxlength: [100, 'Subject name cannot exceed 100 characters']
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
  studentCount: {
    type: Number,
    min: [0, 'Student count cannot be negative']
  },
  staffCount: {
    type: Number,
    min: [0, 'Staff count cannot be negative']
  },
  departments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    head: {
      type: String,
      trim: true
    },
    studentCount: {
      type: Number,
      min: 0
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance optimization
facultySchema.index({ name: 1 });
facultySchema.index({ universityId: 1 });
facultySchema.index({ active: 1 });
facultySchema.index({ subjects: 1 });
facultySchema.index({ universityId: 1, active: 1 });

// Virtual for faculty summary
facultySchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    universityId: this.universityId,
    dean: this.dean,
    subjectCount: this.subjects.length,
    departmentCount: this.departments.length,
    studentCount: this.studentCount,
    active: this.active
  };
});

// Virtual to populate university information
facultySchema.virtual('university', {
  ref: 'University',
  localField: 'universityId',
  foreignField: '_id',
  justOne: true
});

// Static method to find active faculties
facultySchema.statics.findActive = function() {
  return this.find({ active: true });
};

// Static method to find by university
facultySchema.statics.findByUniversity = function(universityId) {
  return this.find({ universityId, active: true });
};

// Static method to search by name
facultySchema.statics.searchByName = function(name) {
  return this.find({
    name: new RegExp(name, 'i'),
    active: true
  });
};

// Static method to find by subject
facultySchema.statics.findBySubject = function(subject) {
  return this.find({
    subjects: new RegExp(subject, 'i'),
    active: true
  });
};

// Instance method to add subject
facultySchema.methods.addSubject = function(subjectName) {
  if (!this.subjects.includes(subjectName)) {
    this.subjects.push(subjectName);
  }
  return this.save();
};

// Instance method to remove subject
facultySchema.methods.removeSubject = function(subjectName) {
  this.subjects = this.subjects.filter(subject => subject !== subjectName);
  return this.save();
};

// Instance method to add department
facultySchema.methods.addDepartment = function(department) {
  const existingDept = this.departments.find(dept => dept.name === department.name);
  if (!existingDept) {
    this.departments.push(department);
  }
  return this.save();
};

// Instance method to remove department
facultySchema.methods.removeDepartment = function(departmentName) {
  this.departments = this.departments.filter(dept => dept.name !== departmentName);
  return this.save();
};

// Static method to get faculty statistics
facultySchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalFaculties: { $sum: 1 },
        activeFaculties: {
          $sum: { $cond: [{ $eq: ['$active', true] }, 1, 0] }
        },
        inactiveFaculties: {
          $sum: { $cond: [{ $eq: ['$active', false] }, 1, 0] }
        },
        totalStudents: { $sum: '$studentCount' },
        totalStaff: { $sum: '$staffCount' },
        averageStudents: { $avg: '$studentCount' },
        averageStaff: { $avg: '$staffCount' },
        universities: { $addToSet: '$universityId' }
      }
    },
    {
      $project: {
        _id: 0,
        totalFaculties: 1,
        activeFaculties: 1,
        inactiveFaculties: 1,
        totalStudents: 1,
        totalStaff: 1,
        averageStudents: { $round: ['$averageStudents', 0] },
        averageStaff: { $round: ['$averageStaff', 0] },
        universitiesCount: { $size: '$universities' }
      }
    }
  ]);

  return stats[0] || {
    totalFaculties: 0,
    activeFaculties: 0,
    inactiveFaculties: 0,
    totalStudents: 0,
    totalStaff: 0,
    averageStudents: 0,
    averageStaff: 0,
    universitiesCount: 0
  };
};

// Pre-save middleware to update subjects array
facultySchema.pre('save', function(next) {
  // Remove duplicates from subjects array
  if (this.subjects) {
    this.subjects = [...new Set(this.subjects)];
  }
  next();
});

// Pre-remove middleware to update university faculties
facultySchema.pre('remove', async function(next) {
  try {
    const University = mongoose.model('University');
    await University.findByIdAndUpdate(
      this.universityId,
      { $pull: { faculties: this.name } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Faculty', facultySchema);

