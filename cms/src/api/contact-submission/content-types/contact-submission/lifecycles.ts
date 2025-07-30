import emailService from '../../services/email-service';

export default {
  async afterCreate(event) {
    const { result } = event;
    
    // Send admin notification email
    try {
      await emailService.sendAdminNotification(result);
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Don't fail the contact submission if email fails
    }
    
    // Also log the submission for debugging
    console.log('New contact form submission received:');
    console.log('From:', result.name, '(', result.email, ')');
    console.log('Subject:', result.subject);
    console.log('Submission ID:', result.documentId);
  },
}; 