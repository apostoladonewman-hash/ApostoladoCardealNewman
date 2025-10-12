import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface Testimonial {
  id?: number;
  nome_pessoa: string;
  email?: string;
  denominacao_anterior?: string;
  data_conversao?: string;
  ano_nascimento?: number;
  cidade_natural?: string;
  cidade_atual?: string;
  profissao?: string;
  biografia?: string;
  testemunho_completo: string;
  status: 'pending' | 'approved' | 'rejected';
  motivo_rejeicao?: string;
  data_submissao?:string;
  usuario_vinculado?: number;
  avatar?: any;
}

class TestimonialService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async submitTestimonial(data: Partial<Testimonial>): Promise<Testimonial> {
    const userId = localStorage.getItem('userId');

    const response = await axios.post(
      `${API_URL}/authors`,
      {
        data: {
          ...data,
          status: 'pending',
          data_submissao: new Date().toISOString(),
          usuario_vinculado: userId,
        },
      },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async getMyTestimonial(): Promise<Testimonial | null> {
    const userId = localStorage.getItem('userId');

    const response = await axios.get(
      `${API_URL}/authors?filters[usuario_vinculado][id][$eq]=${userId}&populate[0]=avatar`,
      {
        headers: this.getAuthHeader(),
      }
    );

    return response.data.data[0] || null;
  }

  async updateTestimonial(id: number, data: Partial<Testimonial>): Promise<Testimonial> {
    const response = await axios.put(
      `${API_URL}/authors/${id}`,
      { data },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async uploadAvatar(testimonialId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'api::author.author');
    formData.append('refId', testimonialId.toString());
    formData.append('field', 'avatar');

    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...this.getAuthHeader(),
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Métodos de moderação
  async getPendingTestimonials(): Promise<Testimonial[]> {
    const response = await axios.get(
      `${API_URL}/authors?filters[status][$eq]=pending&populate=*`,
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async approveTestimonial(id: number): Promise<Testimonial> {
    const response = await axios.put(
      `${API_URL}/authors/${id}`,
      {
        data: {
          status: 'approved',
          data_moderacao: new Date().toISOString(),
        },
      },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data.data;
  }

  async rejectTestimonial(id: number, motivo: string): Promise<Testimonial> {
    const response = await axios.put(
      `${API_URL}/authors/${id}`,
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

export default new TestimonialService();
