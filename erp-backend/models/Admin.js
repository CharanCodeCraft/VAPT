const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: String,
  role: { type: String, default: 'admin' },
  permissions: {
    createStudents: { type: Boolean, default: true },
    editStudents: { type: Boolean, default: true },
    deleteStudents: { type: Boolean, default: true },
    viewAllStudents: { type: Boolean, default: true }
  }
}, { timestamps: true });

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
