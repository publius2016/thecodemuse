import { factories } from '@strapi/strapi';
import emailService from './email-service';

export default factories.createCoreService('api::contact-submission.contact-submission');

// Export the email service for use in controllers
export { emailService }; 