import { api } from './api';

export interface NewmanWork {
  title: string;
  description: string;
}

export interface NewmanQuote {
  text: string;
  author: string;
}

export interface NewmanCategory {
  slug: string;
  title: string;
  description?: string;
  content?: string;
  order: number;
}

export interface Newman {
  title: string;
  fullName: string;
  birthDate: string;
  deathDate: string;
  birthPlace: string;
  conversionYear: number;
  ordinationYear: number;
  cardinalYear: number;
  beatificationYear: number;
  canonizationYear: number;
  canonizationDate: string;
  motto: string;
  mottoTranslation: string;
  biography: string;
  legacy: string;
  photo?: {
    url: string;
    alternativeText?: string;
  };
  works: NewmanWork[];
  quotes: NewmanQuote[];
  categories?: NewmanCategory[];
}

export interface NewmanResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    fullName: string;
    birthDate: string;
    deathDate: string;
    birthPlace: string;
    conversionYear: number;
    ordinationYear: number;
    cardinalYear: number;
    beatificationYear: number;
    canonizationYear: number;
    canonizationDate: string;
    motto: string;
    mottoTranslation: string;
    biography: string;
    legacy: string;
    photo?: {
      url: string;
      alternativeText?: string;
    };
    works: NewmanWork[];
    quotes: NewmanQuote[];
    categories?: NewmanCategory[];
  };
  meta: Record<string, unknown>;
}

export const newmanService = {
  /**
   * Buscar biografia de Newman
   */
  async get(): Promise<Newman> {
    const { data } = await api.get<NewmanResponse>('/newman', {
      params: {
        populate: 'photo',
      },
    });

    return {
      title: data.data.title,
      fullName: data.data.fullName,
      birthDate: data.data.birthDate,
      deathDate: data.data.deathDate,
      birthPlace: data.data.birthPlace,
      conversionYear: data.data.conversionYear,
      ordinationYear: data.data.ordinationYear,
      cardinalYear: data.data.cardinalYear,
      beatificationYear: data.data.beatificationYear,
      canonizationYear: data.data.canonizationYear,
      canonizationDate: data.data.canonizationDate,
      motto: data.data.motto,
      mottoTranslation: data.data.mottoTranslation,
      biography: data.data.biography,
      legacy: data.data.legacy,
      photo: data.data.photo,
      works: data.data.works || [],
      quotes: data.data.quotes || [],
      categories: data.data.categories || [],
    };
  },
};

export default newmanService;
