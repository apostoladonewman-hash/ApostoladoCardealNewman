import { api, buildStrapiQuery } from './api';
import type { StrapiResponse, StrapiSingleResponse, Article, QueryParams } from '@/types/strapi';

export const articlesService = {
  /**
   * Buscar todos os artigos
   */
  async getAll(params?: QueryParams): Promise<StrapiResponse<Article>> {
    const query = buildStrapiQuery(params);
    const { data } = await api.get<StrapiResponse<Article>>('/articles', { params: query });
    return data;
  },

  /**
   * Buscar artigo por slug
   */
  async getBySlug(slug: string): Promise<Article | null> {
    const query = buildStrapiQuery({
      filters: { slug: { $eq: slug } },
      populate: ['author', 'category', 'cover', 'blocks'],
    });

    const { data } = await api.get<StrapiResponse<Article>>('/articles', { params: query });
    return data.data[0] || null;
  },

  /**
   * Buscar artigo por ID
   */
  async getById(id: string): Promise<Article> {
    const { data } = await api.get<StrapiSingleResponse<Article>>(`/articles/${id}`, {
      params: buildStrapiQuery({
        populate: ['author', 'category', 'cover', 'blocks'],
      }),
    });
    return data.data;
  },

  /**
   * Buscar artigos por categoria
   */
  async getByCategory(categorySlug: string, params?: QueryParams): Promise<StrapiResponse<Article>> {
    const query = buildStrapiQuery({
      ...params,
      filters: {
        ...params?.filters,
        category: { slug: { $eq: categorySlug } },
      },
      populate: ['author', 'category', 'cover'],
    });

    const { data } = await api.get<StrapiResponse<Article>>('/articles', { params: query });
    return data;
  },

  /**
   * Buscar artigos recentes
   */
  async getRecent(limit = 3): Promise<Article[]> {
    const { data } = await this.getAll({
      pagination: { limit },
      sort: ['publishedAt:desc'],
      populate: {
        author: {
          populate: ['avatar']
        },
        category: true,
        cover: true
      },
    });
    return data;
  },
};

export default articlesService;
