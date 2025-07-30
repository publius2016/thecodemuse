import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::author.author', {
  config: {
    find: {
      middlewares: ['api::author.author-populate-relations']
    },
    findOne: {
      middlewares: ['api::author.author-populate-relations']
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 