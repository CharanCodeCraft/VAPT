const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  usn: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  department: String,
  semester: Number,
  profileImage: String,
  address: String,
  dateOfBirth: Date,
  parentContact: String,
  // Sensitive data
  academicRecords: [{
    subject: String,
    marks: Number,
    semester: Number
  }],
  feeDetails: {
    totalFees: Number,
    paidAmount: Number,
    pendingAmount: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
