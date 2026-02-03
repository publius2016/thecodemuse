import emailServiceClient from '../../../../services/email-service-client';

export default {
  async afterCreate(event) {
    const { result } = event;
    
    // Prepare contact data for email service - only send required fields
    const contactData = {
      name: result.name,
      email: result.email,
      subject: result.subject,
      message: result.message,
    };
    
    console.log('📧 Sending welcome email via email service...', { email: result.email });
    
    // Send welcome email to the user via standalone email service
    try {
      const emailResult = await emailServiceClient.sendWelcomeEmail(contactData);
      console.log('✅ Welcome email sent successfully:', emailResult);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
      // Don't fail the contact submission if email fails
    }
    
    // Log the submission for debugging
    console.log('📝 New contact form submission received:');
    console.log('From:', result.name, '(', result.email, ')');
    console.log('Subject:', result.subject);
    console.log('Submission ID:', result.documentId);
  },
}; 