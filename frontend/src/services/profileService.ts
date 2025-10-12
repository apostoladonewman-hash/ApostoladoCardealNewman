import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  nome_completo: string;
  foto_perfil?: any;
  biografia?: string;
  denominacao_anterior?: string;
  profissao?: string;
  testemunho_breve?: string;
  ex_protestante: boolean;
  userLevel: 'Usuário' | 'Moderador' | 'Administrador';
  telefone?: string;
  twoFactorEnabled: boolean;
}

export interface UpdateProfileData {
  nome_completo?: string;
  biografia?: string;
  denominacao_anterior?: string;
  profissao?: string;
  testemunho_breve?: string;
  ex_protestante?: boolean;
  telefone?: string;
}

class ProfileService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getMyProfile(): Promise<UserProfile> {
    const response = await axios.get(`${API_URL}/users/me?populate[0]=foto_perfil`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  async uploadProfilePhoto(file: File): Promise<UserProfile> {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');

    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'plugin::users-permissions.user');
    formData.append('refId', userId || '');
    formData.append('field', 'foto_perfil');

    await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    // Retorna o perfil atualizado
    return this.getMyProfile();
  }

  async deleteProfilePhoto(): Promise<void> {
    const token = localStorage.getItem('token');
    const profile = await this.getMyProfile();

    if (profile.foto_perfil?.id) {
      await axios.delete(`${API_URL}/upload/files/${profile.foto_perfil.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
}

export default new ProfileService();
