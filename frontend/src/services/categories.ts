import { api, buildStrapiQuery } from './api';
import type { StrapiResponse, StrapiSingleResponse, Category, QueryParams } from '@/types/strapi';

export const categoriesService = {
  /**
   * Buscar todas as categorias
   */
  async getAll(params?: QueryParams): Promise<StrapiResponse<Category>> {
    const query = buildStrapiQuery(params);
    const { data } = await api.get<StrapiResponse<Category>>('/categories', { params: query });
    return data;
  },

  /**
   * Buscar categoria por slug
   */
  async getBySlug(slug: string): Promise<Category | null> {
    const query = buildStrapiQuery({
      filters: { slug: { $eq: slug } },
    });

    const { data } = await api.get<StrapiResponse<Category>>('/categories', { params: query });
    return data.data[0] || null;
  },

  /**
   * Buscar categoria por ID
   */
  async getById(id: number): Promise<Category> {
    const { data } = await api.get<StrapiSingleResponse<Category>>(`/categories/${id}`);
    return data.data;
  },
};

export default categoriesService;
