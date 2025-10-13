import { api } from './api';
import type { StrapiResponse } from '@/types/strapi';

export interface Book {
  id: number;
  documentId: string;
  title: string;
  author: string;
  description: string;
  category: 'Obras de Newman' | 'Sobre Newman' | 'Formação Católica' | 'Outros';
  cover?: {
    url: string;
    alternativeText?: string;
  };
  pdfFile?: {
    url: string;
    name: string;
  };
  available: boolean;
  externalUrl?: string;
  order: number;
}

export const booksService = {
  /**
   * Buscar todos os livros
   */
  async getAll(): Promise<Book[]> {
    const { data } = await api.get<StrapiResponse<Book>>('/books', {
      params: {
        sort: 'order:asc',
        populate: ['cover', 'pdfFile'],
        pagination: {
          limit: 100,
        },
      },
    });
    return data.data;
  },

  /**
   * Buscar livros por categoria
   */
  async getByCategory(category: string): Promise<Book[]> {
    const { data } = await api.get<StrapiResponse<Book>>('/books', {
      params: {
        filters: {
          category: { $eq: category },
        },
        sort: 'order:asc',
        populate: ['cover', 'pdfFile'],
      },
    });
    return data.data;
  },

  /**
   * Agrupar livros por categoria
   */
  async getAllGrouped(): Promise<Record<string, Book[]>> {
    const books = await this.getAll();

    const grouped: Record<string, Book[]> = {};

    books.forEach((book) => {
      if (!grouped[book.category]) {
        grouped[book.category] = [];
      }
      grouped[book.category].push(book);
    });

    return grouped;
  },
};

export default booksService;
