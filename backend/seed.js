const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();

    // Create users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const userPassword = await bcrypt.hash('user123', salt);

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@quicklearn.com',
      password: adminPassword,
      role: 'admin'
    });

    const user = await User.create({
      name: 'Student User',
      email: 'user@quicklearn.com',
      password: userPassword,
      role: 'student'
    });

    // Create dummy courses
    await Course.create([
      {
        name: 'Full Stack Development Course with AI',
        price: 499,
        durationMonths: 6,
        description: 'Learn full-stack development (MERN) alongside cutting-edge AI integrations.',
        category: 'Programming',
        published: true,
        featured: true,
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Advanced UI/UX Design Masterclass',
        price: 299,
        durationMonths: 3,
        description: 'Master Figma and Adobe XD to create stunning user interfaces.',
        category: 'Design',
        published: true,
        featured: false,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80'
      }
    ]);

    console.log('Data Seeded Successfully');
    console.log('Admin Email: admin@quicklearn.com | Password: admin123');
    console.log('User Email: user@quicklearn.com | Password: user123');
    
    process.exit();
  } catch (error) {
    console.error('Error with seed data:', error);
    process.exit(1);
  }
};

seedData();
