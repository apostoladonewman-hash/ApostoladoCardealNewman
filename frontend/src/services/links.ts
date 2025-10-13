import { api } from './api';
import type { StrapiResponse } from '@/types/strapi';

export interface Link {
  id: number;
  documentId: string;
  title: string;
  url: string;
  description: string;
  category:
    | 'Sites Católicos'
    | 'Sobre Newman'
    | 'Formação e Espiritualidade'
    | 'Outros';
  order: number;
}

export const linksService = {
  /**
   * Buscar todos os links
   */
  async getAll(): Promise<Link[]> {
    const { data } = await api.get<StrapiResponse<Link>>('/links', {
      params: {
        sort: 'order:asc',
        pagination: {
          limit: 100,
        },
      },
    });
    return data.data;
  },

  /**
   * Buscar links por categoria
   */
  async getByCategory(category: string): Promise<Link[]> {
    const { data } = await api.get<StrapiResponse<Link>>('/links', {
      params: {
        filters: {
          category: { $eq: category },
        },
        sort: 'order:asc',
      },
    });
    return data.data;
  },

  /**
   * Agrupar links por categoria
   */
  async getAllGrouped(): Promise<Record<string, Link[]>> {
    const links = await this.getAll();

    const grouped: Record<string, Link[]> = {};

    links.forEach((link) => {
      if (!grouped[link.category]) {
        grouped[link.category] = [];
      }
      grouped[link.category].push(link);
    });

    return grouped;
  },
};

export default linksService;
