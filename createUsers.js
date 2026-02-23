const mongoose = require('mongoose');
const User = require('./models/User'); // adjust path if needed
const bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost:27017/school_management', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'));

async function createUsers() {
  const users = [
    { name: 'Admin User', email: 'admin@example.com', password: 'password123', role: 'Admin' },
    { name: 'Teacher User', email: 'teacher@example.com', password: 'password123', role: 'Teacher' },
    { name: 'Student User', email: 'student@example.com', password: 'password123', role: 'Student' },
  ];

  for (let u of users) {
    u.password = await bcrypt.hash(u.password, 10);
    const user = new User(u);
    await user.save();
    console.log(`Created ${u.role}: ${u.name}`);
  }

  mongoose.disconnect();
}

createUsers();