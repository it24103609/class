const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5000',
  'https://class-chi-nine.vercel.app',
  'https://class-ni3z.vercel.app'
];

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollRoutes = require('./routes/enrollRoutes');
const blogRoutes = require('./routes/blogRoutes');
const courseDayRoutes = require('./routes/courseDayRoutes');
const cvRoutes = require('./routes/cvRoutes');
const websiteRoutes = require('./routes/websiteRoutes');
const mobileAppRoutes = require('./routes/mobileAppRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enroll', enrollRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/coursedays', courseDayRoutes);
app.use('/api/cv', cvRoutes);
app.use('/api/websites', websiteRoutes);
app.use('/api/mobileapps', mobileAppRoutes);
app.use('/api/purchases', purchaseRoutes);

const PORT = process.env.PORT || 5000;

if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
