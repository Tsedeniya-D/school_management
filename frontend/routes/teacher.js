const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Mark = require('../models/Mark');

// All teacher routes require authentication and teacher role
router.use(protect);
router.use(authorize('Teacher'));

// @route   GET /api/teacher/students
// @desc    Get assigned students
// @access  Private/Teacher
router.get('/students', async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id)
      .populate('assignedStudents', 'name email grade')
      .populate('subjects', 'name');

    res.json({
      success: true,
      students: teacher.assignedStudents || [],
      subjects: teacher.subjects || []
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/teacher/students/:id
// @desc    Get single student details
// @access  Private/Teacher
router.get('/students/:id', async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    const student = await User.findById(req.params.id)
      .select('-password')
      .populate('grade', 'name')
      .populate('subjects', 'name description');

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Check if student is assigned to this teacher
    if (!teacher.assignedStudents.includes(student._id)) {
      return res.status(403).json({ message: 'Student not assigned to you' });
    }

    // Get student marks
    const marks = await Mark.find({ student: student._id })
      .populate('subject', 'name')
      .populate('teacher', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      student,
      marks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/teacher/marks
// @desc    Assign marks to student
// @access  Private/Teacher
router.post('/marks', [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('subject').notEmpty().withMessage('Subject ID is required'),
  body('marks').isNumeric().withMessage('Marks must be a number').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student, subject, marks, examType, remarks } = req.body;

    // Verify student exists and is assigned to teacher
    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== 'Student') {
      return res.status(404).json({ message: 'Student not found' });
    }

    const teacher = await User.findById(req.user.id);
    if (!teacher.assignedStudents.includes(student)) {
      return res.status(403).json({ message: 'Student not assigned to you' });
    }

    // Verify subject exists and teacher teaches it
    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (!teacher.subjects.includes(subject)) {
      return res.status(403).json({ message: 'You are not assigned to teach this subject' });
    }

    // Check if student is enrolled in this subject
    if (!studentUser.subjects.includes(subject)) {
      return res.status(400).json({ message: 'Student is not enrolled in this subject' });
    }

    // Create or update mark
    const mark = await Mark.findOneAndUpdate(
      { student, subject, examType: examType || 'Quiz' },
      {
        student,
        subject,
        teacher: req.user.id,
        marks: parseFloat(marks),
        examType: examType || 'Quiz',
        remarks: remarks || ''
      },
      { new: true, upsert: true, runValidators: true }
    )
      .populate('student', 'name email')
      .populate('subject', 'name')
      .populate('teacher', 'name');

    res.status(201).json({
      success: true,
      mark
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Mark already exists for this exam type' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/teacher/marks
// @desc    Get all marks assigned by teacher
// @access  Private/Teacher
router.get('/marks', async (req, res) => {
  try {
    const { student, subject } = req.query;
    const query = { teacher: req.user.id };
    
    if (student) query.student = student;
    if (subject) query.subject = subject;

    const marks = await Mark.find(query)
      .populate('student', 'name email')
      .populate('subject', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: marks.length,
      marks
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/teacher/marks/:id
// @desc    Update mark
// @access  Private/Teacher
router.put('/marks/:id', [
  body('marks').optional().isNumeric().withMessage('Marks must be a number').isFloat({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    // Verify teacher owns this mark
    if (mark.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this mark' });
    }

    const { marks, remarks } = req.body;
    if (marks !== undefined) mark.marks = parseFloat(marks);
    if (remarks !== undefined) mark.remarks = remarks;

    await mark.save();

    const updatedMark = await Mark.findById(req.params.id)
      .populate('student', 'name email')
      .populate('subject', 'name')
      .populate('teacher', 'name');

    res.json({
      success: true,
      mark: updatedMark
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/teacher/marks/:id
// @desc    Delete mark
// @access  Private/Teacher
router.delete('/marks/:id', async (req, res) => {
  try {
    const mark = await Mark.findById(req.params.id);
    if (!mark) {
      return res.status(404).json({ message: 'Mark not found' });
    }

    // Verify teacher owns this mark
    if (mark.teacher.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this mark' });
    }

    await mark.deleteOne();

    res.json({
      success: true,
      message: 'Mark deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
