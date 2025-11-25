const { createAdmin } = require('../service/adminService');

async function createAdminUser() {
  try {
    console.log('🔄 Creating admin user...');
    
    const admin = await createAdmin({
      admin_username: 'admin',
      admin_email: 'admin@hotelhimalayas.com',
      admin_password: 'Admin@12345',
      contact_no: '9876543210'
    });

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Password: Admin@12345');
    console.log('Please change this password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

createAdminUser();