import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
// A importação está correta, os erros eram de tipagem
import adminService, { UserWithLevel } from '@/services/adminService';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Shield, User, UserCog } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/ui/search-bar';
import { AxiosError } from 'axios';

// Definição de tipo correta para a estrutura de erro da API
interface ApiErrorData {
  error: {
    message: string;
  };
}

export default function Admin() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserWithLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message ||
          'Erro ao carregar usuários',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUserLevel = async (
    userId: number,
    newLevel: 'Usuário' | 'Moderador' | 'Administrador',
  ) => {
    if (processing) return;
    setProcessing(userId);
    try {
      // Correção: Usando o nome correto da função do serviço
      await adminService.changeUserLevel(userId, newLevel);
      toast.success('Nível de usuário alterado com sucesso!');
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, userLevel: newLevel } : u,
        ),
      );
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message ||
          'Erro ao alterar nível do usuário',
      );
    } finally {
      setProcessing(null);
    }
  };

  const handleToggleUserStatus = async (userId: number, isBlocked: boolean) => {
    if (processing) return;
    setProcessing(userId);
    try {
      // Correção: Usando o nome correto da função do serviço
      await adminService.blockUser(userId, !isBlocked);
      toast.success(
        `Usuário ${!isBlocked ? 'bloqueado' : 'desbloqueado'} com sucesso!`,
      );
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === userId ? { ...u, blocked: !isBlocked } : u,
        ),
      );
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message ||
          'Erro ao alterar status do usuário',
      );
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'Administrador':
        return <Shield className="w-4 h-4 text-red-600" />;
      case 'Moderador':
        return <UserCog className="w-4 h-4 text-blue-600" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.nome_completo &&
        user.nome_completo.toLowerCase().includes(searchTerm.toLowerCase())),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Carregando usuários...</p>
      </div>
    );
  }

  const getStats = () => {
    const total = filteredUsers.length;
    const moderators = filteredUsers.filter(
      (u) => u.userLevel === 'Moderador',
    ).length;
    const admins = filteredUsers.filter(
      (u) => u.userLevel === 'Administrador',
    ).length;

    return { total, moderators, admins };
  };

  const stats = getStats();

  return (
    <>
      <Helmet>
        <title>Painel de Administração - {currentUser?.username}</title>
      </Helmet>
      <main className="container mx-auto py-10 px-4 md:px-6">
        <div className="space-y-8">
          <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Gerenciamento de Usuários
            </h1>
            <p className="text-muted-foreground">
              Visualize, edite e gerencie todos os usuários da plataforma.
            </p>
          </header>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total de Usuários
                </CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  (na visualização atual)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Moderadores
                </CardTitle>
                <UserCog className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.moderators}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Administradores
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                <SearchBar
                  placeholder="Buscar por nome, username ou e-mail..."
                  onSearch={setSearchTerm}
                  className="mt-4"
                />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Nome Completo
                      </TableHead>
                      <TableHead>Nível</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <TableCell>
                          <div className="font-medium">{user.username}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {user.nome_completo}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getLevelIcon(user.userLevel)}
                            {user.userLevel}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.blocked ? 'destructive' : 'default'}
                          >
                            {user.blocked ? 'Bloqueado' : 'Ativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                disabled={
                                  processing === user.id ||
                                  user.id === currentUser?.id
                                }
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleChangeUserLevel(user.id, 'Usuário')
                                }
                              >
                                Tornar Usuário
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleChangeUserLevel(user.id, 'Moderador')
                                }
                              >
                                Tornar Moderador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleChangeUserLevel(
                                    user.id,
                                    'Administrador',
                                  )
                                }
                              >
                                Tornar Administrador
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onSelect={() =>
                                  handleToggleUserStatus(user.id, user.blocked)
                                }
                                className={
                                  user.blocked
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                }
                              >
                                {user.blocked ? 'Desbloquear' : 'Bloquear'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800">
              Gerenciamento de Conteúdo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700">
              A gestão de artigos e testemunhos pendentes foi movida para o
              Painel do Moderador para centralizar as tarefas de moderação.
            </p>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
