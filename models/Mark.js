const mongoose = require('mongoose');

const markSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a student']
  },
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: [true, 'Please provide a subject']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide a teacher']
  },
  marks: {
    type: Number,
    required: [true, 'Please provide marks'],
    min: 0,
    max: 100
  },
  examType: {
    type: String,
    enum: ['Quiz', 'Midterm', 'Final', 'Assignment'],
    default: 'Quiz'
  },
  remarks: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate entries
markSchema.index({ student: 1, subject: 1, examType: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
