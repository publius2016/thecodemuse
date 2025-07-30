import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::category.category', {
  config: {
    find: {
      middlewares: ['api::category.category-populate-relations']
    },
    findOne: {
      middlewares: ['api::category.category-populate-relations']
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 