import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface ArticleSubmission {
  id?: number;
  title: string;
  description?: string;
  content: string;
  category?: number;
  cover?: any;
  status: 'pending' | 'approved' | 'rejected';
  motivo_rejeicao?: string;
  user?: number;
  data_submissao?: string;
}

class ArticleSubmissionService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async submitArticle(data: Partial<ArticleSubmission>): Promise<ArticleSubmission> {
    const userId = localStorage.getItem('userId');

    const response = await axios.post(
      `${API_URL}/articles`,
      {
        data: {
          ...data,
          status: 'pending',
          publishedAt: null, // Não publicar automaticamente
          data_submissao: new Date().toISOString(),
          user: userId,
        },
      },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async getMyArticles(): Promise<ArticleSubmission[]> {
    const userId = localStorage.getItem('userId');

    const response = await axios.get(
      `${API_URL}/articles?filters[user][id][$eq]=${userId}&populate=*`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async updateArticle(id: number, data: Partial<ArticleSubmission>): Promise<ArticleSubmission> {
    const response = await axios.put(
      `${API_URL}/articles/${id}`,
      { data },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async deleteArticle(id: number): Promise<void> {
    await axios.delete(`${API_URL}/articles/${id}`, {
      headers: this.getAuthHeader(),
    });
  }

  async uploadCover(articleId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'api::article.article');
    formData.append('refId', articleId.toString());
    formData.append('field', 'cover');

    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Métodos de moderação
  async getPendingArticles(): Promise<ArticleSubmission[]> {
    const response = await axios.get(
      `${API_URL}/articles?filters[status][$eq]=pending&populate=*`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async approveArticle(id: number): Promise<ArticleSubmission> {
    const response = await axios.put(
      `${API_URL}/articles/${id}`,
      {
        data: {
          status: 'approved',
          publishedAt: new Date().toISOString(),
          data_moderacao: new Date().toISOString(),
        },
      },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async rejectArticle(id: number, motivo: string): Promise<ArticleSubmission> {
    const response = await axios.put(
      `${API_URL}/articles/${id}`,
      {
        data: {
          status: 'rejected',
          motivo_rejeicao: motivo,
          data_moderacao: new Date().toISOString(),
        },
      },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }
}

export default new ArticleSubmissionService();
