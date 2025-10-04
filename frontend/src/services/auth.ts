import { api } from './api';

export interface LoginCredentials {
  identifier: string; // email ou username
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: User;
}

export const authService = {
  /**
   * Login do usuário
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/local', credentials);
    
    // Salvar token no localStorage
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  /**
   * Registro de novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/local/register', userData);
    
    // Salvar token no localStorage
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  /**
   * Logout do usuário
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * Buscar usuário atual
   */
  async me(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await api.get<User>('/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return data;
  },

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * Verificar se usuário é administrador
   */
  isAdmin(): boolean {
    // Implementar lógica de verificação de admin quando o backend estiver configurado
    // Por enquanto, retorna false
    return false;
  },

  /**
   * Obter token do localStorage
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * Obter usuário do localStorage
   */
  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  /**
   * Atualizar dados do usuário
   */
  async updateUser(userId: number, data: Partial<User>): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const { data: updatedUser } = await api.put<User>(`/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Atualizar localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));

    return updatedUser;
  },
};

export default authService;
