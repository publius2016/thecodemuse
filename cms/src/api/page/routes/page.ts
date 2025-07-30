import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::page.page', {
  config: {
    find: {
      middlewares: ['api::page.page-populate-relations']
    },
    findOne: {
      middlewares: ['api::page.page-populate-relations']
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 