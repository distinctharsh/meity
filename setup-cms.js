#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Cabinet Secretariat CMS Admin Panel...\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
  console.error('❌ package.json not found. Please run this script from the project root directory.');
  process.exit(1);
}

// Create uploads directory
const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('✅ Created uploads directory');
} else {
  console.log('✅ Uploads directory already exists');
}

// Create .env.local if it doesn't exist
const envFile = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envFile)) {
  const envContent = `# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=meity_clone

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-${Date.now()}

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-${Date.now()}
`;

  fs.writeFileSync(envFile, envContent);
  console.log('✅ Created .env.local file');
} else {
  console.log('✅ .env.local file already exists');
}

// Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('\n🎉 CMS setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Set up your MySQL database and run the SQL schema from lib/cms-schema.sql');
console.log('2. Update the database credentials in .env.local');
console.log('3. Start the development server: npm run dev');
console.log('4. Access the admin panel at: http://localhost:3000/admin/login');
console.log('5. Use default credentials: admin / admin123');
console.log('\n⚠️  Remember to change the default password after first login!');
console.log('\n📖 For detailed setup instructions, see CMS_SETUP.md');
