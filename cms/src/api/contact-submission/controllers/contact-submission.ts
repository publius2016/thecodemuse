import { factories } from '@strapi/strapi';
import emailServiceClient from '../../../services/email-service-client';

export default factories.createCoreController('api::contact-submission.contact-submission', ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;

      // Validate required fields
      if (!data.name || !data.email || !data.subject || !data.message) {
        return ctx.badRequest('Missing required fields: name, email, subject, and message are required');
      }

      // Add metadata from request
      const submissionData = {
        ...data,
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
      };

      // Create the contact submission
      const result = await strapi.entityService.create('api::contact-submission.contact-submission', {
        data: submissionData,
      });

      // Send welcome email
      try {
        const emailResult = await emailServiceClient.sendWelcomeEmail(data);
        strapi.log.info('Contact welcome email sent successfully', {
          email: data.email,
          success: emailResult.success,
          messageId: emailResult.messageId
        });
      } catch (error) {
        strapi.log.error('Failed to send welcome email', {
          email: data.email,
          error: error.message
        });
        // Don't fail the contact submission if email fails
      }

      return ctx.created(result);
    } catch (error) {
      console.error('Contact submission error:', error);
      return ctx.internalServerError('An error occurred while processing your submission');
    }
  },
})); 