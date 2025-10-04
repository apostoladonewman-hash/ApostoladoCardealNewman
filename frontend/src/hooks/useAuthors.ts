import { useQuery } from '@tanstack/react-query';
import { authorsService } from '@/services/authors';
import type { QueryParams } from '@/types/strapi';

/**
 * Hook para buscar todos os autores
 */
export const useAuthors = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['authors', params],
    queryFn: () => authorsService.getAll(params),
  });
};

/**
 * Hook para buscar autor por slug (id_testemunhos) ou ID
 */
export const useAuthor = (slugOrId: string) => {
  return useQuery({
    queryKey: ['author', slugOrId],
    queryFn: async () => {
      // Primeiro tenta buscar por slug (id_testemunhos)
      const authorBySlug = await authorsService.getBySlug(slugOrId);
      if (authorBySlug) return authorBySlug;

      // Se não encontrar, tenta por ID
      try {
        return await authorsService.getById(slugOrId);
      } catch {
        return null;
      }
    },
    enabled: !!slugOrId,
  });
};

/**
 * Hook para buscar testemunhos recentes
 */
export const useRecentTestimonials = (limit = 3) => {
  return useQuery({
    queryKey: ['authors', 'recent', limit],
    queryFn: () => authorsService.getRecent(limit),
  });
};
