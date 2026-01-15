const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./Admin');
const dotenv = require('dotenv');

dotenv.config();

const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, {
  })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));


async function seedAdmin() {
  const admin = new Admin({
    username: 'admin',
    email: 'admin@erp.com',
    password: 'admin123',
    fullName: 'ERP Administrator'
  });
  
  await admin.save();
  console.log('Admin created: admin@erp.com / admin123');
  process.exit();
}

seedAdmin();
