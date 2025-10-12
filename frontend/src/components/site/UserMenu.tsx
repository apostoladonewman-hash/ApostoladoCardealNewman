import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Shield,
  Settings,
  BookOpen,
  FileText,
  FolderOpen,
  ChevronDown,
} from 'lucide-react';

export default function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAvatarUrl = () => {
    if (!user?.foto_perfil) return null;

    // Caso 1: Array de arquivos (Strapi retorna array)
    if (Array.isArray(user.foto_perfil) && user.foto_perfil.length > 0) {
      const firstFile = user.foto_perfil[0];
      if (firstFile.url) {
        return `http://localhost:1337${firstFile.url}`;
      }
    }

    // Caso 2: Objeto único com data.url (formato Strapi v4+)
    if (user.foto_perfil.data) {
      if (Array.isArray(user.foto_perfil.data) && user.foto_perfil.data.length > 0) {
        return `http://localhost:1337${user.foto_perfil.data[0].attributes.url}`;
      }
      if (user.foto_perfil.data.attributes?.url) {
        return `http://localhost:1337${user.foto_perfil.data.attributes.url}`;
      }
    }

    // Caso 3: Objeto com url direto
    if (typeof user.foto_perfil === 'object' && user.foto_perfil.url) {
      return `http://localhost:1337${user.foto_perfil.url}`;
    }

    // Caso 4: String (URL direta)
    if (typeof user.foto_perfil === 'string') {
      return `http://localhost:1337${user.foto_perfil}`;
    }

    return null;
  };

  const avatarUrl = getAvatarUrl();
  const userLevel = user.userLevel || 'Usuário';
  const isModerador = userLevel === 'Moderador' || userLevel === 'Administrador';
  const isAdmin = userLevel === 'Administrador';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none group">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border-2 border-white shadow-md group-hover:shadow-lg transition-all">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
              <span className="text-white text-sm font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Seta */}
        <ChevronDown className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="font-semibold">{user.username}</span>
            <span className="text-xs text-muted-foreground font-normal">{user.email}</span>
            <span className="text-xs text-primary font-medium mt-1">{userLevel}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/perfil" className="flex items-center gap-2 cursor-pointer">
            <User className="w-4 h-4" />
            <span>Meu Perfil</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/meu-testemunho" className="flex items-center gap-2 cursor-pointer">
            <BookOpen className="w-4 h-4" />
            <span>Meu Testemunho</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/submeter-artigo" className="flex items-center gap-2 cursor-pointer">
            <FileText className="w-4 h-4" />
            <span>Submeter Artigo</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/meus-artigos" className="flex items-center gap-2 cursor-pointer">
            <FolderOpen className="w-4 h-4" />
            <span>Meus Artigos</span>
          </Link>
        </DropdownMenuItem>

        {isModerador && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/moderacao" className="flex items-center gap-2 cursor-pointer">
                <Shield className="w-4 h-4" />
                <span>Moderação</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              <span>Administração</span>
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
        >
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
