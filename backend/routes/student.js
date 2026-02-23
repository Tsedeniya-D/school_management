const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const Mark = require('../models/Mark');
const Subject = require('../models/Subject');
const User = require('../models/User');

// All student routes require authentication and student role
router.use(protect);
router.use(authorize('Student'));

// @route   GET /api/student/grades
// @desc    Get student's grades and marks
// @access  Private/Student
router.get('/grades', async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .populate('subjects', 'name description')
      .populate('grade', 'name description');

    // Get all marks for this student, only for enrolled subjects
    const marks = await Mark.find({ student: req.user.id })
      .populate('subject', 'name description')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    // Filter marks to only show subjects the student is enrolled in
    const enrolledSubjectIds = student.subjects.map(s => s._id.toString());
    const filteredMarks = marks.filter(mark => 
      enrolledSubjectIds.includes(mark.subject._id.toString())
    );

    // Calculate average marks per subject
    const subjectMarks = {};
    filteredMarks.forEach(mark => {
      const subjectId = mark.subject._id.toString();
      if (!subjectMarks[subjectId]) {
        subjectMarks[subjectId] = {
          subject: mark.subject,
          marks: [],
          average: 0
        };
      }
      subjectMarks[subjectId].marks.push(mark);
    });

    // Calculate averages
    Object.keys(subjectMarks).forEach(subjectId => {
      const marks = subjectMarks[subjectId].marks;
      const sum = marks.reduce((acc, m) => acc + m.marks, 0);
      subjectMarks[subjectId].average = marks.length > 0 ? (sum / marks.length).toFixed(2) : 0;
    });

    res.json({
      success: true,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        grade: student.grade,
        subjects: student.subjects
      },
      marks: filteredMarks,
      subjectMarks: Object.values(subjectMarks)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/student/grades/:subjectId
// @desc    Get marks for a specific subject
// @access  Private/Student
router.get('/grades/:subjectId', async (req, res) => {
  try {
    const student = await User.findById(req.user.id);

    // Verify student is enrolled in this subject
    if (!student.subjects.includes(req.params.subjectId)) {
      return res.status(403).json({ message: 'You are not enrolled in this subject' });
    }

    const marks = await Mark.find({
      student: req.user.id,
      subject: req.params.subjectId
    })
      .populate('subject', 'name description')
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    const subject = await Subject.findById(req.params.subjectId);

    res.json({
      success: true,
      subject,
      marks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/student/profile
// @desc    Get student profile
// @access  Private/Student
router.get('/profile', async (req, res) => {
  try {
    const student = await User.findById(req.user.id)
      .select('-password')
      .populate('subjects', 'name description')
      .populate('grade', 'name description')
      .populate('assignedTeachers', 'name email');

    res.json({
      success: true,
      student
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
