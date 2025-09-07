import { factories } from '@strapi/strapi';
import crypto from 'crypto';
import emailServiceClient from '../../../services/email-service-client';

// Helper function to generate verification token
function generateVerificationToken() {
  return crypto.randomBytes(32).toString('hex');
}

export default factories.createCoreController('api::newsletter-signup.newsletter-signup', ({ strapi }) => ({
  // Create a new newsletter signup
  async create(ctx) {
    try {
      const { body } = ctx.request;
      
      // Validate required fields
      if (!body.email) {
        return ctx.badRequest('Email is required');
      }

      // Check if email already exists
      const existingSignup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { email: body.email }
      });

      if (existingSignup.length > 0) {
        return ctx.badRequest('Email already subscribed to newsletter');
      }

      // Prepare signup data
      const signupData = {
        ...body,
        subscriptionStatus: 'pending',
        subscriptionDate: new Date(),
        verified: false,
        verificationToken: generateVerificationToken(),
        verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        source: body.source || 'api',
        sourceUrl: body.sourceUrl || 'https://thecodemuse.com',
        ipAddress: ctx.request.ip,
        userAgent: ctx.request.headers['user-agent'],
        consent: {
          marketingConsent: true,
          consentDate: new Date(),
          consentVersion: '1.0',
          consentSource: ctx.request.url,
          ipAddress: ctx.request.ip,
          userAgent: ctx.request.headers['user-agent'],
          optInMethod: 'form_submission'
        },
        preferences: body.preferences || {
          frequency: 'weekly',
          format: 'html',
          language: 'en',
          includeBlogPosts: true
        },
        location: body.location || {}
      };

      // Log what we're sending to Strapi
      strapi.log.info('Signup data being sent to Strapi - Email:', signupData.email);
      strapi.log.info('Signup data being sent to Strapi - SubscriptionStatus:', signupData.subscriptionStatus);
      strapi.log.info('Signup data being sent to Strapi - Verified:', signupData.verified);
      strapi.log.info('Signup data being sent to Strapi - Source:', signupData.source);

      // Create the signup
      const signup = await strapi.entityService.create('api::newsletter-signup.newsletter-signup', {
        data: signupData
      });

      // Log what Strapi actually stored
      strapi.log.info('Record created by Strapi - ID:', signup.id);
      strapi.log.info('Record created by Strapi - Email:', signup.email);
      strapi.log.info('Record created by Strapi - SubscriptionStatus:', signup.subscriptionStatus);
      strapi.log.info('Record created by Strapi - Verified:', signup.verified);
      strapi.log.info('Record created by Strapi - Source:', signup.source);

      // Log the verification token for development only
      if (process.env.NODE_ENV === 'development') {
        strapi.log.info('Newsletter signup created successfully:', {
          email: signupData.email,
          id: signup.id,
          verificationToken: signupData.verificationToken,
          verificationExpires: signupData.verificationExpires
        });
      } else {
        // Production logging - no sensitive data
        strapi.log.info('Newsletter signup created successfully:', {
          email: signupData.email,
          id: signup.id,
          subscriptionStatus: signupData.subscriptionStatus
        });
      }

      // Send verification email
      try {
        // Prepare clean data for email service (only required fields)
        const emailData = {
          email: signupData.email,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          verificationToken: signupData.verificationToken,
          source: signupData.source,
          sourceUrl: signupData.sourceUrl
        };
        
        const emailResult = await emailServiceClient.sendNewsletterVerificationEmail(emailData);
        strapi.log.info('Verification email sent successfully:', {
          email: signupData.email,
          messageId: emailResult.messageId,
          success: emailResult.success
        });
      } catch (emailError) {
        strapi.log.error('Failed to send verification email:', emailError);
        // Don't fail the signup if email fails - user can request resend later
      }

      // Return success response
      ctx.send({
        message: 'Newsletter signup successful! Please check your email to verify your subscription.',
        data: {
          id: signup.id,
          email: signup.email,
          subscriptionStatus: signup.subscriptionStatus,
          verified: signup.verified,
          verificationRequired: true
        }
      });

    } catch (error) {
      strapi.log.error('Newsletter signup error:', error);
      ctx.internalServerError('Failed to create newsletter signup');
    }
  },

  // Get all newsletter signups (admin only)
  async find(ctx) {
    try {
      const { page = 1, pageSize = 25, subscriptionStatus, source, search } = ctx.query;

      const filters: any = {};
      
      if (subscriptionStatus) filters.subscriptionStatus = subscriptionStatus;
      if (source) filters.source = source;
      if (search) {
        filters.$or = [
          { email: { $containsi: search } },
          { firstName: { $containsi: search } },
          { lastName: { $containsi: search } }
        ];
      }

      const signups = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters,
        pagination: {
          page: parseInt(page as string),
          pageSize: parseInt(pageSize as string)
        },
        sort: { subscriptionDate: 'desc' }
      });

      ctx.send(signups);
    } catch (error) {
      strapi.log.error('Newsletter signup find error:', error);
      ctx.internalServerError('Failed to fetch newsletter signups');
    }
  },

  // Get a single newsletter signup
  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      
      const signup = await strapi.entityService.findOne('api::newsletter-signup.newsletter-signup', id);

      if (!signup) {
        return ctx.notFound('Newsletter signup not found');
      }

      ctx.send(signup);
    } catch (error) {
      strapi.log.error('Newsletter signup findOne error:', error);
      ctx.internalServerError('Failed to fetch newsletter signup');
    }
  },

  // Update newsletter signup
  async update(ctx) {
    try {
      const { id } = ctx.params;
      const { body } = ctx.request;

      const signup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', id, {
        data: body
      });

      ctx.send(signup);
    } catch (error) {
      strapi.log.error('Newsletter signup update error:', error);
      ctx.internalServerError('Failed to update newsletter signup');
    }
  },

  // Delete newsletter signup
  async delete(ctx) {
    try {
      const { id } = ctx.params;
      
      await strapi.entityService.delete('api::newsletter-signup.newsletter-signup', id);
      
      ctx.send({ message: 'Newsletter signup deleted successfully' });
    } catch (error) {
      strapi.log.error('Newsletter signup delete error:', error);
      ctx.internalServerError('Failed to delete newsletter signup');
    }
  },

  // Verify email subscription
  async verify(ctx) {
    try {
      const { token } = ctx.params;

      const signup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { 
          verificationToken: token,
          verified: false,
          verificationExpires: { $gt: new Date() }
        }
      });

      if (signup.length === 0) {
        return ctx.badRequest('Invalid or expired verification token');
      }

      const signupToVerify = signup[0];

      // Update signup status
      const updatedSignup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', signupToVerify.id, {
        data: {
          subscriptionStatus: 'active',
          verified: true,
          verificationToken: null,
          verificationExpires: null
        }
      });

      // Send welcome email
      try {
        // Ensure we have the required fields for the email service
        const welcomeEmailData = {
          email: updatedSignup.email,
          firstName: updatedSignup.firstName,
          lastName: updatedSignup.lastName,
          verificationToken: '', // Not needed for welcome email
          source: updatedSignup.source || 'verification',
          sourceUrl: updatedSignup.sourceUrl || ''
        };
        
        const emailResult = await emailServiceClient.sendNewsletterWelcomeEmail(welcomeEmailData);
        strapi.log.info('Welcome email sent successfully:', {
          email: updatedSignup.email,
          success: emailResult.success,
          messageId: emailResult.messageId
        });
      } catch (emailError) {
        strapi.log.error('Failed to send welcome email:', {
          email: updatedSignup.email,
          error: emailError.message
        });
        // Don't fail verification if welcome email fails
      }

      ctx.send({
        message: 'Email verified successfully! You are now subscribed to our newsletter.',
        data: updatedSignup
      });

    } catch (error) {
      strapi.log.error('Newsletter verification error:', error);
      ctx.internalServerError('Failed to verify newsletter subscription');
    }
  },

  // Unsubscribe from newsletter
  async unsubscribe(ctx) {
    try {
      const { email } = ctx.request.body;

      if (!email) {
        return ctx.badRequest('Email is required');
      }

      const signup = await strapi.entityService.findMany('api::newsletter-signup.newsletter-signup', {
        filters: { email }
      });

      if (signup.length === 0) {
        return ctx.notFound('Email not found in newsletter subscriptions');
      }

      const signupToUpdate = signup[0];

      // Update signup status
      const updatedSignup = await strapi.entityService.update('api::newsletter-signup.newsletter-signup', signupToUpdate.id, {
        data: {
          subscriptionStatus: 'unsubscribed'
        }
      });

      ctx.send({
        message: 'Successfully unsubscribed from newsletter',
        data: updatedSignup
      });

    } catch (error) {
      strapi.log.error('Newsletter unsubscribe error:', error);
      ctx.internalServerError('Failed to unsubscribe from newsletter');
    }
  },

  // Get newsletter statistics
  async stats(ctx) {
    try {
      const totalSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup');
      const activeSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { subscriptionStatus: 'active' }
      });
      const pendingSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { subscriptionStatus: 'pending' }
      });
      const unsubscribedSubscribers = await strapi.entityService.count('api::newsletter-signup.newsletter-signup', {
        filters: { subscriptionStatus: 'unsubscribed' }
      });

      // Get signups by source
      const signupsBySource = await strapi.db.connection
        .from('newsletter_signups')
        .select('source')
        .count('* as count')
        .groupBy('source');

      ctx.send({
        total: totalSubscribers,
        active: activeSubscribers,
        pending: pendingSubscribers,
        unsubscribed: unsubscribedSubscribers,
        bySource: signupsBySource
      });

    } catch (error) {
      strapi.log.error('Newsletter stats error:', error);
      ctx.internalServerError('Failed to fetch newsletter statistics');
    }
  }
}));
