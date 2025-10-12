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
  userLevel?: 'Usuário' | 'Moderador' | 'Administrador';
  nome_completo?: string;
  foto_perfil?: any;
  role?: {
    id: number;
    name: string;
    type: string;
  };
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

    // Salvar token temporariamente
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('userId', data.user.id.toString());

      // Buscar dados completos do usuário incluindo foto_perfil
      const fullUser = await this.me();

      // Retornar resposta com dados completos
      return {
        jwt: data.jwt,
        user: fullUser
      };
    }

    return data;
  },

  /**
   * Registro de novo usuário
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/local/register', userData);

    // Salvar token e dados do usuário no localStorage
    if (data.jwt) {
      localStorage.setItem('token', data.jwt);
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id.toString());
    }

    return data;
  },

  /**
   * Logout do usuário
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
  },

  /**
   * Buscar usuário atual
   */
  async me(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }

    const { data } = await api.get<User>('/users/me?populate=*', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('🔍 DEBUG /users/me resposta completa:', data);

    // Salvar também o userId no localStorage
    if (data.id) {
      localStorage.setItem('userId', data.id.toString());
    }

    // Atualizar localStorage com dados completos incluindo role e userLevel
    localStorage.setItem('user', JSON.stringify(data));

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
    const user = this.getUser();
    if (!user || !user.role) {
      return false;
    }

    // Verificar se o role type é 'authenticated' (admin padrão do Strapi)
    // ou se o nome do role contém 'admin'
    return user.role.type === 'admin' ||
           user.role.name.toLowerCase().includes('admin') ||
           user.role.type === 'authenticated'; // Temporário: ajustar conforme configuração
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
