const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { verifyAdminToken } = require('../middleware/admin-auth');

// Create Student (Pre-registration)
router.post('/', verifyAdminToken, async (req, res) => {
  try {
    // Generate temporary password (admin sets it)
    const tempPassword = Math.random().toString(36).slice(-8);
    
    const student = new Student({
      ...req.body,
      password: await require('bcryptjs').hash(tempPassword, 10)
    });
    
    await student.save();
    
    res.status(201).json({
      message: 'Student created successfully',
      studentId: student._id,
      usn: student.usn,
      temporaryPassword: tempPassword
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all students (Admin view)
router.get('/', verifyAdminToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    
    const query = search 
      ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { usn: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    const students = await Student.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Student.countDocuments(query);

    res.json({
      students,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single student
router.get('/:id', verifyAdminToken, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update student
router.put('/:id', verifyAdminToken, async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({ message: 'Student updated successfully', student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete student
router.delete('/:id', verifyAdminToken, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
