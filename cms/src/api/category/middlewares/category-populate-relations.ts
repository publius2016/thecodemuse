export default (config, { strapi }) => {
  return async (ctx, next) => {
    // Add default populate to query
    if (!ctx.query.populate) {
      ctx.query.populate = {
        posts: {
          populate: ['author', 'featuredImage', 'tags']
        }
      };
    }

    await next();
  };
}; 