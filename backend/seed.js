const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');
const Website = require('./models/Website');
const MobileApp = require('./models/MobileApp');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Website.deleteMany();
    await MobileApp.deleteMany();

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

    // Create Websites
    await Website.create([
      {
        name: 'E-Commerce Pro Platform',
        description: 'A fully responsive e-commerce platform with real-time inventory management, payment gateway integration, and an intuitive admin dashboard.',
        imageUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://example-ecommerce.vercel.app',
        price: 14999,
        originalPrice: 24999,
        techStack: 'React, Node.js, MongoDB, Stripe',
        featured: true,
        published: true,
        reviews: [
          { author: 'Rahul S.', rating: 5, comment: 'Incredible quality! The dashboard is super clean.' },
          { author: 'Priya M.', rating: 4, comment: 'Great codebase, easy to customize.' }
        ]
      },
      {
        name: 'SaaS Dashboard Kit',
        description: 'A modern SaaS analytics dashboard with real-time charts, user management, role-based access control, and dark mode support.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://example-saas.vercel.app',
        price: 19999,
        originalPrice: 34999,
        techStack: 'Next.js, Tailwind CSS, Chart.js, Firebase',
        featured: true,
        published: true,
        reviews: [
          { author: 'Amit K.', rating: 5, comment: 'Perfect for my startup. Saved weeks of work.' },
          { author: 'Sneha R.', rating: 5, comment: 'Beautiful design and well-documented code.' }
        ]
      },
      {
        name: 'Portfolio & Blog Template',
        description: 'A stunning personal portfolio and blog template with CMS integration, SEO optimization, and smooth animations.',
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://example-portfolio.vercel.app',
        price: 7999,
        originalPrice: 12999,
        techStack: 'Next.js, MDX, Framer Motion, Sanity CMS',
        featured: false,
        published: true,
        reviews: [
          { author: 'Vikram P.', rating: 4, comment: 'Great template, very easy to set up.' }
        ]
      },
      {
        name: 'Real Estate Listings Platform',
        description: 'A feature-rich real estate platform with property listings, advanced search filters, virtual tour integration, and agent profiles.',
        imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://example-realestate.vercel.app',
        price: 24999,
        originalPrice: 39999,
        techStack: 'React, Django, PostgreSQL, Mapbox',
        featured: true,
        published: true,
        reviews: [
          { author: 'Neha G.', rating: 5, comment: 'Comprehensive solution. The search filters are excellent.' },
          { author: 'Arjun D.', rating: 4, comment: 'Very professional code and design.' }
        ]
      }
    ]);

    // Create Mobile Apps
    await MobileApp.create([
      {
        name: 'Fitness Tracker App',
        description: 'A cross-platform fitness tracking app with workout logging, progress charts, meal planning, and social challenges.',
        imageUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://play.google.com/store/apps/details?id=com.example.fitness',
        price: 29999,
        originalPrice: 49999,
        platform: 'Android & iOS',
        techStack: 'React Native, Firebase, HealthKit API',
        featured: true,
        published: true,
        reviews: [
          { author: 'Karan M.', rating: 5, comment: 'Amazing app! The UI is super smooth.' },
          { author: 'Divya T.', rating: 5, comment: 'Love the workout tracking feature.' }
        ]
      },
      {
        name: 'Food Delivery App',
        description: 'A complete food delivery solution with real-time order tracking, restaurant management, payment integration, and push notifications.',
        imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://apps.apple.com/app/example-food',
        price: 39999,
        originalPrice: 59999,
        platform: 'Android & iOS',
        techStack: 'Flutter, Node.js, Socket.io, Google Maps',
        featured: true,
        published: true,
        reviews: [
          { author: 'Rohit S.', rating: 5, comment: 'Production-ready code. Highly recommended.' },
          { author: 'Ananya P.', rating: 4, comment: 'Great architecture and clean code.' }
        ]
      },
      {
        name: 'Language Learning App',
        description: 'An interactive language learning app with gamified lessons, speech recognition, progress tracking, and offline mode.',
        imageUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://play.google.com/store/apps/details?id=com.example.lingua',
        price: 19999,
        originalPrice: 29999,
        platform: 'Android & iOS',
        techStack: 'React Native, TensorFlow Lite, AWS Polly',
        featured: false,
        published: true,
        reviews: [
          { author: 'Meera J.', rating: 5, comment: 'Fun and engaging! The speech recognition works great.' }
        ]
      },
      {
        name: 'Expense Manager App',
        description: 'A smart expense tracking app with AI-powered categorization, budget planning, receipt scanning, and multi-currency support.',
        imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
        deployLink: 'https://apps.apple.com/app/example-expense',
        price: 14999,
        originalPrice: 24999,
        platform: 'Android & iOS',
        techStack: 'Flutter, Supabase, OpenAI API',
        featured: true,
        published: true,
        reviews: [
          { author: 'Siddharth N.', rating: 5, comment: 'The AI categorization is a game changer!' },
          { author: 'Kavya R.', rating: 4, comment: 'Clean UI and very useful features.' }
        ]
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
    console.log('----------------------------------------');
    console.log('🌐 Websites Added: 4');
    console.log('   1. E-Commerce Pro Platform');
    console.log('   2. SaaS Dashboard Kit');
    console.log('   3. Portfolio & Blog Template');
    console.log('   4. Real Estate Listings Platform');
    console.log('----------------------------------------');
    console.log('📱 Mobile Apps Added: 4');
    console.log('   1. Fitness Tracker App');
    console.log('   2. Food Delivery App');
    console.log('   3. Language Learning App');
    console.log('   4. Expense Manager App');
    console.log('========================================');
    
    process.exit();
  } catch (error) {
    console.error('Error with seed data:', error);
    process.exit(1);
  }
};

seedData();