import { api } from './api';

export const strapiService = {
  async getTestimonies() {
    const response = await api.get('/authors', {
      params: {
        populate: {
          avatar: true
        },
        sort: ['publishedAt:desc']
      }
    });
    return response.data.data;
  },

  async getArticles() {
    const response = await api.get('/articles', {
      params: {
        populate: {
          autor: {
            populate: ['foto']
          },
          categoria: true
        },
        sort: ['publishedAt:desc']
      }
    });
    return response.data.data;
  }
};
