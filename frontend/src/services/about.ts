import { api } from './api';

export interface About {
  title: string;
  content: string;
}

export interface AboutResponse {
  data: {
    id: number;
    documentId: string;
    title: string;
    content: string;
  };
  meta: Record<string, unknown>;
}

export const aboutService = {
  /**
   * Buscar informações sobre nós
   */
  async get(): Promise<About> {
    const { data } = await api.get<AboutResponse>('/about');
    return {
      title: data.data.title,
      content: data.data.content,
    };
  },
};

export default aboutService;
