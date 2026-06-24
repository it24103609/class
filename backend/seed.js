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

    // Create courses
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
      },
      {
        name: 'Python for Data Science & Machine Learning',
        price: 399,
        durationMonths: 4,
        description: 'Learn Python, Pandas, NumPy, Scikit-learn, and build real-world ML models.',
        category: 'Data Science',
        published: true,
        featured: true,
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Mobile App Development with React Native',
        price: 449,
        durationMonths: 5,
        description: 'Build cross-platform iOS and Android apps using React Native.',
        category: 'Programming',
        published: true,
        featured: false,
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Cloud Computing with AWS',
        price: 549,
        durationMonths: 6,
        description: 'Master AWS services including EC2, S3, Lambda, and DynamoDB.',
        category: 'Cloud',
        published: true,
        featured: true,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Cybersecurity Fundamentals',
        price: 349,
        durationMonths: 3,
        description: 'Learn ethical hacking, network security, and penetration testing.',
        category: 'Security',
        published: true,
        featured: false,
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'Digital Marketing & SEO Mastery',
        price: 249,
        durationMonths: 3,
        description: 'Learn SEO, social media marketing, Google Ads, and content strategy.',
        category: 'Marketing',
        published: true,
        featured: false,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
      },
      {
        name: 'DevOps & CI/CD Pipeline with Docker & Kubernetes',
        price: 599,
        durationMonths: 5,
        description: 'Learn Docker, Kubernetes, Jenkins, GitHub Actions, and infrastructure as code.',
        category: 'DevOps',
        published: true,
        featured: true,
        image: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80'
      }
    ]);

    console.log('========================================');
    console.log('✅ Data Seeded Successfully!');
    console.log('========================================');
    console.log('📋 Admin Credentials:');
    console.log('   Name:     Admin User');
    console.log('   Email:    admin@quicklearn.com');
    console.log('   Password: admin123');
    console.log('   Role:     admin');
    console.log('----------------------------------------');
    console.log('📋 Student Credentials:');
    console.log('   Name:     Student User');
    console.log('   Email:    user@quicklearn.com');
    console.log('   Password: user123');
    console.log('   Role:     student');
    console.log('----------------------------------------');
    console.log('📚 Courses Added: 8');
    console.log('   1. Full Stack Development Course with AI');
    console.log('   2. Advanced UI/UX Design Masterclass');
    console.log('   3. Python for Data Science & Machine Learning');
    console.log('   4. Mobile App Development with React Native');
    console.log('   5. Cloud Computing with AWS');
    console.log('   6. Cybersecurity Fundamentals');
    console.log('   7. Digital Marketing & SEO Mastery');
    console.log('   8. DevOps & CI/CD Pipeline with Docker & Kubernetes');
    console.log('========================================');
    
    process.exit();
  } catch (error) {
    console.error('Error with seed data:', error);
    process.exit(1);
  }
};

seedData();