const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

mongoose
  .connect(mongoUri, {
    // For latest mongoose versions, these options are often not needed,
    // but you can keep them if no warnings
  })
  .then(() => console.log('MongoDB Atlas connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// routes...
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/password', require('./routes/password'));
app.use('/api/admin/auth', require('./routes/admin-auth'));
app.use('/api/admin/students', require('./routes/admin-students'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
