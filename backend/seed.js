const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Resource = require('./models/Resource');
const Ticket = require('./models/Ticket');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Resource.deleteMany({});
  await Ticket.deleteMany({});

  // Create users
  const password = await bcrypt.hash('password123', 10);

  const admin = await User.create({
    name: 'Admin User', email: 'admin@skillnest.lk',
    password, role: 'admin'
  });

  const tutor1 = await User.create({
    name: 'Dr. Kamal Perera', email: 'kamal@skillnest.lk',
    password, role: 'tutor',
    tutorModules: ['Data Structures', 'Algorithms', 'Mathematics', 'Machine Learning'],
    academicProfile: { degreeProgram: 'BSc Computer Science', currentSemester: 'Semester 6' }
  });

  const tutor2 = await User.create({
    name: 'Ms. Nimali Silva', email: 'nimali@skillnest.lk',
    password, role: 'tutor',
    tutorModules: ['Web Development', 'Database Management', 'Networking'],
    academicProfile: { degreeProgram: 'BSc Software Engineering', currentSemester: 'Semester 5' }
  });

  const student1 = await User.create({
    name: 'David Silva', email: 'david@skillnest.lk',
    password, role: 'student',
    academicProfile: {
      degreeProgram: 'BSc Computer Science', currentSemester: 'Semester 3',
      subjects: ['Data Structures', 'Networking', 'Database Management'],
      gpa: 3.8, semesterGpa: 3.2,
      skills: [
        { name: 'Programming', rating: 4, type: 'strength' },
        { name: 'Mathematics', rating: 3, type: 'neutral' },
        { name: 'Data Analysis', rating: 2, type: 'weakness' },
        { name: 'Web Development', rating: 4, type: 'strength' },
      ],
      profileCompletion: 75
    }
  });

  const student2 = await User.create({
    name: 'Amara Jayasinghe', email: 'amara@skillnest.lk',
    password, role: 'student',
    academicProfile: {
      degreeProgram: 'BSc Information Technology', currentSemester: 'Semester 2',
      subjects: ['Web Development', 'Mathematics'],
      gpa: 3.2, semesterGpa: 3.0,
      profileCompletion: 50
    }
  });

  // Create resources
  await Resource.create([
    {
      title: 'Introduction to Data Structures', subject: 'Data Structures',
      semester: 'Semester 3', resourceType: 'pdf',
      description: 'Comprehensive guide covering arrays, linked lists, trees and graphs.',
      uploadedBy: tutor1._id, status: 'approved', tags: ['arrays', 'trees', 'graphs'],
      averageRating: 4.5, downloadCount: 120
    },
    {
      title: 'TCP/IP Networking Fundamentals', subject: 'Networking',
      semester: 'Semester 3', resourceType: 'pdf',
      description: 'Complete notes on TCP/IP protocols, OSI model, and network architecture.',
      uploadedBy: tutor2._id, status: 'approved', tags: ['tcp', 'osi', 'protocols'],
      averageRating: 4.2, downloadCount: 89
    },
    {
      title: 'SQL & Database Design Tutorial', subject: 'Database Management',
      semester: 'Semester 2', resourceType: 'link',
      description: 'Step-by-step SQL tutorial with practical exercises.',
      externalLink: 'https://www.w3schools.com/sql/',
      uploadedBy: tutor2._id, status: 'approved', tags: ['sql', 'mysql', 'databases'],
      averageRating: 4.7, downloadCount: 200
    },
    {
      title: 'React.js Complete Guide 2024', subject: 'Web Development',
      semester: 'Semester 4', resourceType: 'link',
      description: 'Full React.js tutorial covering hooks, routing, and state management.',
      externalLink: 'https://react.dev',
      uploadedBy: tutor2._id, status: 'approved', tags: ['react', 'javascript', 'frontend'],
      averageRating: 4.8, downloadCount: 310
    },
    {
      title: 'Machine Learning Basics', subject: 'Machine Learning',
      semester: 'Semester 6', resourceType: 'notes',
      description: 'Introductory notes on ML algorithms, regression, and classification.',
      uploadedBy: tutor1._id, status: 'pending', tags: ['ml', 'python', 'sklearn'],
    },
  ]);

  // Create tickets
  await Ticket.create([
    {
      student: student1._id, tutor: tutor1._id,
      module: 'Data Structures', subject: 'Binary Trees - Traversal Methods',
      description: 'I am struggling with in-order, pre-order and post-order tree traversals. Can you help me understand the differences and when to use each?',
      helpType: 'tutor_support', priority: 'medium', status: 'in_progress',
      ticketNumber: 'TKT-001001'
    },
    {
      student: student1._id, tutor: tutor2._id,
      module: 'Database Management', subject: 'SQL JOIN types confusion',
      description: 'I do not understand the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN and FULL OUTER JOIN.',
      helpType: 'quiz_help', priority: 'high', status: 'open',
      ticketNumber: 'TKT-001002'
    },
    {
      student: student2._id, tutor: tutor2._id,
      module: 'Web Development', subject: 'React useState hook',
      description: 'Need help understanding how useState works and when to use it vs useEffect.',
      helpType: 'assignment_help', priority: 'low', status: 'resolved',
      ticketNumber: 'TKT-001003'
    },
  ]);

  console.log('\n✅ Seed complete!\n');
  console.log('Demo Accounts:');
  console.log('  Admin:   admin@skillnest.lk   / password123');
  console.log('  Tutor:   kamal@skillnest.lk   / password123');
  console.log('  Tutor:   nimali@skillnest.lk  / password123');
  console.log('  Student: david@skillnest.lk   / password123');
  console.log('  Student: amara@skillnest.lk   / password123\n');

  await mongoose.disconnect();
}

seed().catch(console.error);
