const emailService = require('../src/services/email-service.js');

async function testEmail() {
  try {
    console.log('Testing email functionality...');
    
    // Test welcome email
    const welcomeResult = await emailService.sendWelcomeEmail({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test message to verify email functionality.'
    });
    
    console.log('Welcome email result:', welcomeResult);
    
    // Test admin notification
    const adminResult = await emailService.sendAdminNotification({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test message to verify email functionality.',
      documentId: 'test-123',
      createdAt: new Date().toISOString(),
      ipAddress: '127.0.0.1',
      userAgent: 'Test Script'
    });
    
    console.log('Admin notification result:', adminResult);
    
    console.log('Email tests completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error testing email:', error);
    process.exit(1);
  }
}

testEmail(); 