import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337/api';

export interface User {
  id: number;
  username: string;
  email: string;
  nome_completo: string;
  userLevel: 'Usuário' | 'Moderador' | 'Administrador';
  blocked: boolean;
  confirmed: boolean;
}

class AdminService {
  private getAuthHeader() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getAllUsers(): Promise<User[]> {
    const response = await axios.get(`${API_URL}/users?populate=*`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async promoteUser(userId: number, newLevel: 'Moderador' | 'Administrador'): Promise<User> {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { userLevel: newLevel },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  async demoteUser(userId: number, newLevel: 'Usuário' | 'Moderador'): Promise<User> {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { userLevel: newLevel },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  async blockUser(userId: number): Promise<User> {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { blocked: true },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }

  async unblockUser(userId: number): Promise<User> {
    const response = await axios.put(
      `${API_URL}/users/${userId}`,
      { blocked: false },
      {
        headers: this.getAuthHeader(),
      }
    );
    return response.data;
  }
}

export default new AdminService();
