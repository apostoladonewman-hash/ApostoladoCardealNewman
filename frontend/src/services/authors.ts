import { api, buildStrapiQuery } from './api';
import type {
  StrapiResponse,
  StrapiSingleResponse,
  Author,
  QueryParams,
} from '@/types/strapi';

export const authorsService = {
  /**
   * Buscar todos os autores (testemunhos)
   */
  async getAll(params?: QueryParams): Promise<StrapiResponse<Author>> {
    const query = buildStrapiQuery(params);
    const { data } = await api.get<StrapiResponse<Author>>('/authors', {
      params: query,
    });
    return data;
  },

  /**
   * Buscar autor por slug (id_testemunhos)
   */
  async getBySlug(slug: string): Promise<Author | null> {
    const query = buildStrapiQuery({
      filters: { id_testemunhos: { $eq: slug } },
      populate: ['avatar'],
    });

    const { data } = await api.get<StrapiResponse<Author>>('/authors', {
      params: query,
    });
    return data.data[0] || null;
  },

  /**
   * Buscar autor por ID
   */
  async getById(id: string): Promise<Author> {
    const { data } = await api.get<StrapiSingleResponse<Author>>(
      `/authors/${id}`,
      {
        params: buildStrapiQuery({
          populate: ['avatar'],
        }),
      },
    );
    return data.data;
  },

  /**
   * Buscar testemunhos recentes
   */
  async getRecent(limit = 3): Promise<Author[]> {
    const query = buildStrapiQuery({
      filters: {
        testemunho_completo: { $notNull: true },
      },
      pagination: { limit },
      sort: ['publishedAt:desc'],
      populate: ['avatar'],
    });

    const { data } = await api.get<StrapiResponse<Author>>('/authors', {
      params: query,
    });
    return data.data;
  },
};

export default authorsService;
