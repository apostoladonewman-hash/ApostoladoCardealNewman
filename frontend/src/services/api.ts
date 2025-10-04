import axios from 'axios';
import type { QueryParams } from '@/types/strapi';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Helper para construir query string do Strapi
export const buildStrapiQuery = (params?: QueryParams): Record<string, unknown> => {
  if (!params) return {};

  const query: Record<string, unknown> = {};

  // Filters
  if (params.filters) {
    query.filters = params.filters;
  }

  // Populate
  if (params.populate) {
    query.populate = params.populate;
  }

  // Sort
  if (params.sort) {
    query.sort = params.sort;
  }

  // Pagination
  if (params.pagination) {
    query.pagination = params.pagination;
  }

  return query;
};

export default api;
