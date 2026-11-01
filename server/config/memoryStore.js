// In-memory fallback database for local execution without a running MongoDB daemon
const memoryStore = {
  users: [],
  resumes: [],
  jobDescriptions: [],
  analyses: [],
  reports: []
};

// Seed initial admin & candidate accounts into memory store
const bcrypt = require('bcryptjs');

const seedDefaultUsers = async () => {
  if (memoryStore.users.length === 0) {
    const salt = await bcrypt.genSalt(10);
    const candidatePassword = await bcrypt.hash('password123', salt);
    const adminPassword = await bcrypt.hash('admin123', salt);

    memoryStore.users.push(
      {
        _id: 'usr_candidate_demo',
        fullName: 'Demo Candidate',
        email: 'candidate@resumeiq.com',
        passwordHash: candidatePassword,
        role: 'candidate',
        createdAt: new Date()
      },
      {
        _id: 'usr_admin_demo',
        fullName: 'Platform Admin',
        email: 'admin@resumeiq.com',
        passwordHash: adminPassword,
        role: 'admin',
        createdAt: new Date()
      }
    );
  }
};

seedDefaultUsers();

module.exports = memoryStore;
