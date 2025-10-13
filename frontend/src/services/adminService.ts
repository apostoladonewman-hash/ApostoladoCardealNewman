import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface UserWithLevel {
  id: number;
  username: string;
  email: string;
  nome_completo: string;
  userLevel: 'Usuário' | 'Moderador' | 'Administrador';
  blocked: boolean;
  confirmed: boolean;
  role?: {
    // A propriedade role é opcional
    name: string;
  };
}

// Interface para descrever o objeto de usuário que vem do Strapi
interface StrapiUser {
  id: number;
  username: string;
  email: string;
  nome_completo: string;
  blocked: boolean;
  confirmed: boolean;
  role?: {
    name: string;
  };
}

class AdminService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllUsers(): Promise<UserWithLevel[]> {
    const response = await axios.get<StrapiUser[]>(
      `${API_URL}/users?populate=*`,
      {
        headers: this.getAuthHeader(),
      },
    );
    // Agora 'user' é do tipo 'StrapiUser', não 'any'
    return response.data.map((user) => ({
      ...user,
      userLevel:
        user.role?.name === 'Administrator'
          ? 'Administrador'
          : user.role?.name === 'Moderator'
            ? 'Moderador'
            : 'Usuário',
    }));
  }

  async changeUserLevel(
    userId: number,
    newLevel: 'Usuário' | 'Moderador' | 'Administrador',
  ): Promise<UserWithLevel> {
    const roleId =
      newLevel === 'Administrador' ? 1 : newLevel === 'Moderador' ? 4 : 5; // Use os IDs corretos do seu Strapi

    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { role: roleId },
      {
        headers: this.getAuthHeader(),
      },
    );
    return response.data;
  }

  async blockUser(
    userId: number,
    blockStatus: boolean,
  ): Promise<UserWithLevel> {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { blocked: blockStatus },
      {
        headers: this.getAuthHeader(),
      },
    );
    return response.data;
  }
}

export default new AdminService();
