import emailService from '../../services/email-service';

export default {
  async afterCreate(event) {
    const { result } = event;
    
    // Send admin notification email
    try {
      console.log('📧 Sending admin notification email...');
      await emailService.sendAdminNotification(result);
      console.log('✅ Admin notification email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send admin notification email:', error);
      // Don't fail the contact submission if email fails
    }
    
    // Send welcome email to the user
    try {
      console.log('📧 Sending welcome email...');
      await emailService.sendWelcomeEmail(result);
      console.log('✅ Welcome email sent successfully');
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't fail the contact submission if email fails
    }
    
    // Also log the submission for debugging
    console.log('📝 New contact form submission received:');
    console.log('From:', result.name, '(', result.email, ')');
    console.log('Subject:', result.subject);
    console.log('Submission ID:', result.documentId);
  },
}; 