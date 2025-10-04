import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '@/services/categories';
import type { QueryParams } from '@/types/strapi';

/**
 * Hook para buscar todas as categorias
 */
export const useCategories = (params?: QueryParams) => {
  return useQuery({
    queryKey: ['categories', params],
    queryFn: () => categoriesService.getAll(params),
  });
};

/**
 * Hook para buscar categoria por slug
 */
export const useCategory = (slug: string) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesService.getBySlug(slug),
    enabled: !!slug,
  });
};
