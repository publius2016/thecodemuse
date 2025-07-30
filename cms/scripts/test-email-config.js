const emailService = require('../dist/src/api/contact-submission/services/email-service.js').default;

async function testEmailConfiguration() {
  console.log('🧪 Testing Email Configuration...\n');
  
  // Test welcome email
  console.log('📧 Testing Welcome Email...');
  const welcomeResult = await emailService.sendWelcomeEmail({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Email Configuration Test',
    message: 'This is a test to verify that the email configuration is working correctly.'
  });
  
  console.log('Welcome Email Result:', welcomeResult);
  console.log('');
  
  // Test admin notification
  console.log('📧 Testing Admin Notification...');
  const adminResult = await emailService.sendAdminNotification({
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Email Configuration Test',
    message: 'This is a test to verify that the email configuration is working correctly.',
    documentId: 'test-123',
    createdAt: new Date().toISOString(),
    ipAddress: '127.0.0.1',
    userAgent: 'Test Script'
  });
  
  console.log('Admin Notification Result:', adminResult);
  console.log('');
  
  // Summary
  console.log('📋 Test Summary:');
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Email Provider: ${process.env.EMAIL_PROVIDER || 'sendgrid'}`);
  console.log(`From Email: ${process.env.FROM_EMAIL || 'hello@thecodemuse.com'}`);
  console.log(`Admin Email: ${process.env.ADMIN_EMAIL || 'admin@thecodemuse.com'}`);
  console.log('');
  
  if (welcomeResult.success && adminResult.success) {
    console.log('✅ All email tests passed!');
  } else {
    console.log('❌ Some email tests failed. Check the configuration.');
  }
  
  process.exit(0);
}

testEmailConfiguration().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
}); 