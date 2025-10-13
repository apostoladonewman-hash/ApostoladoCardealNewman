import { useQuery } from '@tanstack/react-query';
import { articlesService } from '@/services/articles';
import type { QueryParams } from '@/types/strapi';

/**
 * Hook para buscar todos os artigos
 */
export const useArticles = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesService.getAll(params),
  });
};

/**
 * Hook para buscar artigo por slug ou ID
 */
export const useArticle = (slugOrId: string) => {
  return useQuery({
    queryKey: ['article', slugOrId],
    queryFn: async () => {
      // Primeiro tenta buscar por slug
      const articleBySlug = await articlesService.getBySlug(slugOrId);
      if (articleBySlug) return articleBySlug;

      // Se não encontrar, tenta por ID
      try {
        return await articlesService.getById(slugOrId);
      } catch {
        return null;
      }
    },
    enabled: !!slugOrId,
  });
};

/**
 * Hook para buscar artigos recentes
 */
export const useRecentArticles = (limit = 3) => {
  return useQuery({
    queryKey: ['articles', 'recent', limit],
    queryFn: () => articlesService.getRecent(limit),
  });
};

/**
 * Hook para buscar artigos por categoria
 */
export const useArticlesByCategory = (
  categorySlug: string,
  params?: QueryParams,
) => {
  return useQuery({
    queryKey: ['articles', 'category', categorySlug, params],
    queryFn: () => articlesService.getByCategory(categorySlug, params),
    enabled: !!categorySlug,
  });
};
