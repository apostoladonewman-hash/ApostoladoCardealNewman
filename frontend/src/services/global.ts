import { api } from './api';

export interface GlobalSettings {
  siteName: string;
  motto: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsappUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  favicon?: {
    url: string;
    alternativeText?: string;
  };
}

export interface GlobalResponse {
  data: {
    id: number;
    documentId: string;
    siteName: string;
    motto: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    whatsappUrl: string;
    youtubeUrl: string;
    instagramUrl: string;
    favicon?: {
      url: string;
      alternativeText?: string;
    };
  };
  meta: Record<string, unknown>;
}

export const globalService = {
  /**
   * Buscar configurações globais
   */
  async get(): Promise<GlobalSettings> {
    const { data } = await api.get<GlobalResponse>('/global', {
      params: {
        populate: 'favicon',
      },
    });

    return {
      siteName: data.data.siteName,
      motto: data.data.motto,
      siteDescription: data.data.siteDescription,
      contactEmail: data.data.contactEmail,
      contactPhone: data.data.contactPhone,
      whatsappUrl: data.data.whatsappUrl,
      youtubeUrl: data.data.youtubeUrl,
      instagramUrl: data.data.instagramUrl,
      favicon: data.data.favicon,
    };
  },
};

export default globalService;
