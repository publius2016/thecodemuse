import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::post.post', {
  config: {
    find: {
      middlewares: ['api::post.post-populate-relations']
    },
    findOne: {
      middlewares: ['api::post.post-populate-relations']
    }
  },
  only: ['find', 'findOne', 'create', 'update', 'delete'],
  except: []
}); 