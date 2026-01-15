const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

// Store OTPs temporarily (in production, use Redis)
const otpStore = new Map();

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Forgot Password - Send OTP
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: 'Email not found' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTP with email
    otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      studentId: student._id
    });

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`
    });

    res.json({ 
      message: 'OTP sent successfully',
      email // Return email for next step
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VULNERABLE: OTP Verification
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedData = otpStore.get(email);
    
    if (!storedData) {
      return res.json({ valid: false, message: 'invalidOTP' });
    }

    // Check if OTP expired (5 minutes)
    if (Date.now() - storedData.timestamp > 300000) {
      otpStore.delete(email);
      return res.json({ valid: false, message: 'expiredOTP' });
    }

    // VULNERABILITY: Response can be manipulated
    if (storedData.otp === otp) {
      return res.json({ 
        valid: true, 
        message: 'validOTP',
        resetToken: email // Simple token for demo
      });
    } else {
      return res.json({ valid: false, message: 'invalidOTP' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    
    // VULNERABILITY: Not properly validating the reset token
    const student = await Student.findOne({ email });
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    // Clean up OTP
    otpStore.delete(email);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
