// Tipos base do Strapi
export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface StrapiEntity {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Tipos de negócio
export interface Article extends StrapiEntity {
  title: string;
  description: string;
  slug: string;
  cover?: {
    url: string;
    alternativeText?: string;
  };
  author?: Author;
  category?: Category;
  blocks?: Block[];
  fonte_original?: string;
}

export interface Author extends StrapiEntity {
  nome_pessoa: string;
  email?: string;
  biografia?: string;
  denominacao_anterior?: string;
  data_conversao?: string;
  ano_nascimento?: number;
  cidade_natural?: string;
  cidade_atual?: string;
  profissao?: string;
  testemunho_completo?: string;
  id_testemunhos?: string;
  avatar?: {
    url: string;
    alternativeText?: string;
  };
}

export interface Category extends StrapiEntity {
  name: string;
  slug: string;
  description?: string;
}

export interface Block {
  __component: string;
  body?: string;
  [key: string]: unknown;
}

// Parâmetros de query
export interface QueryParams {
  filters?: Record<string, unknown>;
  populate?: string | string[] | Record<string, unknown>;
  sort?: string | string[];
  pagination?: {
    page?: number;
    pageSize?: number;
    start?: number;
    limit?: number;
  };
}
