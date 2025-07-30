import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::contact-submission.contact-submission', {
  config: {
    find: {
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
    findOne: {
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
    create: {
      auth: false // Public endpoint for form submissions
    },
    update: {
      auth: {
        scope: ['admin::is-authenticated']
      }
    },
    delete: {
      auth: {
        scope: ['admin::is-authenticated']
      }
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 