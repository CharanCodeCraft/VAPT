const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { verifyToken } = require('../middleware/auth');

// VULNERABLE: Search students - returns UUIDs
router.get('/getlimitedsearchresult', verifyToken, async (req, res) => {
  try {
    const { name, usn } = req.query;
    const query = {};
    
    if (name) query.name = { $regex: name, $options: 'i' };
    if (usn) query.usn = { $regex: usn, $options: 'i' };

    const students = await Student.find(query)
      .select('_id name usn profileImage department')
      .limit(20);

    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VULNERABLE IDOR: No validation that requestorid matches authenticated user
router.get('/getdetails/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { requestorid } = req.query;

    // VULNERABILITY: Not checking if req.user.id === requestorid
    // This allows any authenticated user to fetch any student's data
    
    const student = await Student.findById(id)
      .select('-password'); // Everything except password

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
