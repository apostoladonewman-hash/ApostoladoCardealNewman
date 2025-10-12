import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import adminService, { User } from '@/services/adminService';
import {
  Users,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Unlock,
  Loader2,
  CheckCircle,
  AlertCircle,
  Search,
} from 'lucide-react';

export default function Admin() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is admin
  const isAdmin = currentUser?.userLevel === 'Administrador';

  useEffect(() => {
    if (!isAdmin) {
      navigate('/perfil');
      return;
    }
    loadUsers();
  }, [isAdmin, navigate]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await adminService.getAllUsers();
      // Sort users by userLevel and then by name
      const sortedUsers = data.sort((a, b) => {
        const levelOrder = { Administrador: 0, Moderador: 1, 'Usuário': 2 };
        const levelA = levelOrder[a.userLevel] ?? 3;
        const levelB = levelOrder[b.userLevel] ?? 3;
        if (levelA !== levelB) return levelA - levelB;
        return a.username.localeCompare(b.username);
      });
      setUsers(sortedUsers);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao carregar usuários');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserLevel = async (userId: number, newLevel: 'Usuário' | 'Moderador' | 'Administrador') => {
    if (userId === currentUser?.id) {
      setError('Você não pode alterar seu próprio nível de acesso');
      return;
    }

    setProcessing(userId);
    setError('');
    setSuccess('');

    try {
      if (newLevel === 'Moderador' || newLevel === 'Administrador') {
        await adminService.promoteUser(userId, newLevel);
      } else {
        await adminService.demoteUser(userId, newLevel);
      }
      setSuccess(`Nível de usuário alterado com sucesso para ${newLevel}`);
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao alterar nível do usuário');
      console.error(err);
    } finally {
      setProcessing(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const handleBlockUser = async (userId: number, blocked: boolean) => {
    if (userId === currentUser?.id) {
      setError('Você não pode bloquear sua própria conta');
      return;
    }

    setProcessing(userId);
    setError('');
    setSuccess('');

    try {
      if (blocked) {
        await adminService.blockUser(userId);
        setSuccess('Usuário bloqueado com sucesso');
      } else {
        await adminService.unblockUser(userId);
        setSuccess('Usuário desbloqueado com sucesso');
      }
      await loadUsers();
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao alterar status do usuário');
      console.error(err);
    } finally {
      setProcessing(null);
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const getUserLevelIcon = (userLevel: string) => {
    switch (userLevel) {
      case 'Administrador':
        return <ShieldCheck className="w-5 h-5 text-red-600" />;
      case 'Moderador':
        return <Shield className="w-5 h-5 text-blue-600" />;
      default:
        return <Users className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUserLevelBadge = (userLevel: string) => {
    const badges = {
      Administrador: 'bg-red-100 text-red-800 border-red-200',
      Moderador: 'bg-blue-100 text-blue-800 border-blue-200',
      Usuário: 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return badges[userLevel as keyof typeof badges] || badges.Usuário;
  };

  // Função de filtro
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      user.username?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term) ||
      user.nome_completo?.toLowerCase().includes(term)
    );
  });

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Painel de Administração - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-7xl">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-10 h-10 text-red-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Painel de Administração
            </h1>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Gerencie usuários, permissões e acesso ao sistema
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-destructive">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg flex items-start gap-2">
            <CheckCircle className="w-5 h-5 text-green-800 mt-0.5 flex-shrink-0" />
            <div className="text-green-800">{success}</div>
          </div>
        )}

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por nome, username ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              aria-label="Pesquisar usuários"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-muted-foreground">
              {filteredUsers.length} usuário(s) encontrado(s)
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gray-100">
                <Users className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Usuários</p>
                <p className="text-2xl font-bold">{filteredUsers.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-blue-100">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Moderadores</p>
                <p className="text-2xl font-bold">
                  {filteredUsers.filter((u) => u.userLevel === 'Moderador').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-red-100">
                <ShieldCheck className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Administradores</p>
                <p className="text-2xl font-bold">
                  {filteredUsers.filter((u) => u.userLevel === 'Administrador').length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Users Table */}
        <Card className="overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6" />
              Gerenciar Usuários
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Nível de Acesso
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {getUserLevelIcon(user.userLevel)}
                        <div>
                          <p className="font-semibold text-foreground">{user.username}</p>
                          {user.nome_completo && (
                            <p className="text-sm text-muted-foreground">{user.nome_completo}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.userLevel}
                        onChange={(e) =>
                          handleChangeUserLevel(
                            user.id,
                            e.target.value as 'Usuário' | 'Moderador' | 'Administrador'
                          )
                        }
                        disabled={processing === user.id || user.id === currentUser?.id}
                        className={`px-3 py-1.5 rounded-full border text-sm font-medium ${getUserLevelBadge(
                          user.userLevel
                        )} disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="Usuário">Usuário</option>
                        <option value="Moderador">Moderador</option>
                        <option value="Administrador">Administrador</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      {user.blocked ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                          <Lock className="w-3 h-3" />
                          Bloqueado
                        </span>
                      ) : user.confirmed ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                          <CheckCircle className="w-3 h-3" />
                          Ativo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        onClick={() => handleBlockUser(user.id, !user.blocked)}
                        disabled={processing === user.id || user.id === currentUser?.id}
                        size="sm"
                        variant="outline"
                        className={
                          user.blocked
                            ? 'border-green-600 text-green-600 hover:bg-green-50'
                            : 'border-red-600 text-red-600 hover:bg-red-50'
                        }
                      >
                        {processing === user.id ? (
                          <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        ) : user.blocked ? (
                          <Unlock className="w-4 h-4 mr-1" />
                        ) : (
                          <Lock className="w-4 h-4 mr-1" />
                        )}
                        {user.blocked ? 'Desbloquear' : 'Bloquear'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Informações Importantes
          </h3>
          <ul className="text-sm text-yellow-800 space-y-2">
            <li>
              <strong>Administrador:</strong> Acesso total ao sistema, incluindo gestão de
              usuários, moderação e configurações.
            </li>
            <li>
              <strong>Moderador:</strong> Pode aprovar/rejeitar testemunhos e artigos
              submetidos pelos usuários.
            </li>
            <li>
              <strong>Usuário:</strong> Pode submeter artigos e testemunhos para moderação.
            </li>
            <li>
              <strong>Bloqueado:</strong> Usuário bloqueado não pode acessar o sistema.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
