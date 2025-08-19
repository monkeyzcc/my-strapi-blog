/**
 * article controller
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::article.article', ({ strapi }) => ({
  async find(ctx) {
    // Use the default core controller to fetch data first
    const response = await super.find(ctx);

    try {
      const filters = (ctx?.request?.query as any)?.filters || {};
      const slugFilter = filters?.slug;
      // If fetching a single article by slug, increment views
      if (slugFilter) {
        const dataArray = Array.isArray((response as any)?.data) ? (response as any).data : [];
        if (dataArray.length === 1) {
          const article = dataArray[0];
          const id = article?.id;
          const currentViews = article?.views ?? 0;
          if (id) {
            await strapi.entityService.update('api::article.article', id, {
              data: { views: Number(currentViews) + 1 },
            });
          }
        }
      }
    } catch (e) {
      strapi.log.warn(`Failed to auto-increment views: ${e instanceof Error ? e.message : String(e)}`);
    }

    return response;
  },
}));
