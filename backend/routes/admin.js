const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const User = require('../models/User');
const Subject = require('../models/Subject');
const Grade = require('../models/Grade');
const Mark = require('../models/Mark');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('Admin'));

// ========== USER MANAGEMENT ==========

// @route   GET /api/admin/users
// @desc    Get all users (with optional role filter)
// @access  Private/Admin
router.get('/users', async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query)
      .select('-password')
      .populate('subjects', 'name')
      .populate('grade', 'name')
      .populate('assignedStudents', 'name email')
      .populate('assignedTeachers', 'name email');

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/admin/users/:id
// @desc    Get single user
// @access  Private/Admin
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('subjects', 'name description')
      .populate('grade', 'name description')
      .populate('assignedStudents', 'name email')
      .populate('assignedTeachers', 'name email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/users
// @desc    Create a new user (teacher or student)
// @access  Private/Admin
router.post('/users', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['Teacher', 'Student']).withMessage('Role must be Teacher or Student')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, subjects, grade } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      subjects: subjects || [],
      grade: grade || null
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/users/:id
// @desc    Update user
// @access  Private/Admin
router.put('/users/:id', async (req, res) => {
  try {
    const { name, email, subjects, grade, assignedStudents, assignedTeachers } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (email) user.email = email;
    if (subjects) user.subjects = subjects;
    if (grade) user.grade = grade;
    if (assignedStudents) user.assignedStudents = assignedStudents;
    if (assignedTeachers) user.assignedTeachers = assignedTeachers;

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== SUBJECT MANAGEMENT ==========

// @route   GET /api/admin/subjects
// @desc    Get all subjects
// @access  Private/Admin
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await Subject.find().sort({ name: 1 });

    res.json({
      success: true,
      count: subjects.length,
      subjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/subjects
// @desc    Create a new subject
// @access  Private/Admin
router.post('/subjects', [
  body('name').trim().notEmpty().withMessage('Subject name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    const subject = await Subject.create({ name, description });

    res.status(201).json({
      success: true,
      subject
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Subject already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/subjects/:id
// @desc    Update subject
// @access  Private/Admin
router.put('/subjects/:id', async (req, res) => {
  try {
    const { name, description } = req.body;

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );

    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    res.json({
      success: true,
      subject
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/subjects/:id
// @desc    Delete subject
// @access  Private/Admin
router.delete('/subjects/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await subject.deleteOne();

    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== GRADE MANAGEMENT ==========

// @route   GET /api/admin/grades
// @desc    Get all grades
// @access  Private/Admin
router.get('/grades', async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('teachers', 'name email')
      .populate('students', 'name email')
      .sort({ name: 1 });

    res.json({
      success: true,
      count: grades.length,
      grades
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/grades
// @desc    Create a new grade
// @access  Private/Admin
router.post('/grades', [
  body('name').trim().notEmpty().withMessage('Grade name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, teachers, students } = req.body;

    const grade = await Grade.create({
      name,
      description,
      teachers: teachers || [],
      students: students || []
    });

    res.status(201).json({
      success: true,
      grade
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Grade already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/admin/grades/:id
// @desc    Update grade and assign teachers/students
// @access  Private/Admin
router.put('/grades/:id', async (req, res) => {
  try {
    const { name, description, teachers, students } = req.body;

    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    if (name) grade.name = name;
    if (description !== undefined) grade.description = description;
    if (teachers) grade.teachers = teachers;
    if (students) grade.students = students;

    await grade.save();

    const updatedGrade = await Grade.findById(req.params.id)
      .populate('teachers', 'name email')
      .populate('students', 'name email');

    res.json({
      success: true,
      grade: updatedGrade
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/admin/grades/:id
// @desc    Delete grade
// @access  Private/Admin
router.delete('/grades/:id', async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await grade.deleteOne();

    res.json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/admin/grades/:id/assign
// @desc    Assign teachers and students to grade
// @access  Private/Admin
router.post('/grades/:id/assign', async (req, res) => {
  try {
    const { teacherIds, studentIds } = req.body;

    const grade = await Grade.findById(req.params.id);
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    if (teacherIds && teacherIds.length > 0) {
      // Verify teachers exist
      const teachers = await User.find({ _id: { $in: teacherIds }, role: 'Teacher' });
      if (teachers.length !== teacherIds.length) {
        return res.status(400).json({ message: 'Some teachers not found' });
      }
      grade.teachers = [...new Set([...grade.teachers, ...teacherIds])];
    }

    if (studentIds && studentIds.length > 0) {
      // Verify students exist
      const students = await User.find({ _id: { $in: studentIds }, role: 'Student' });
      if (students.length !== studentIds.length) {
        return res.status(400).json({ message: 'Some students not found' });
      }
      grade.students = [...new Set([...grade.students, ...studentIds])];
      
      // Update students' grade field
      await User.updateMany(
        { _id: { $in: studentIds } },
        { $set: { grade: grade._id } }
      );
    }

    await grade.save();

    const updatedGrade = await Grade.findById(req.params.id)
      .populate('teachers', 'name email')
      .populate('students', 'name email');

    res.json({
      success: true,
      grade: updatedGrade
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ========== STATISTICS ==========

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
// @access  Private/Admin
router.get('/stats', async (req, res) => {
  try {
    const [teachers, students, subjects, grades, marks] = await Promise.all([
      User.countDocuments({ role: 'Teacher' }),
      User.countDocuments({ role: 'Student' }),
      Subject.countDocuments(),
      Grade.countDocuments(),
      Mark.countDocuments()
    ]);

    res.json({
      success: true,
      stats: {
        teachers,
        students,
        subjects,
        grades,
        marks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
