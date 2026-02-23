const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a grade name'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teachers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Grade', gradeSchema);
