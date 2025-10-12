import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { BookOpen, FileText, FolderOpen, Shield, Settings, Camera } from 'lucide-react';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setUploadingPhoto(true);
    setError('');
    setSuccess('');

    try {
      const profileService = await import('@/services/profileService');
      await profileService.default.uploadProfilePhoto(file);
      setSuccess('Foto atualizada com sucesso!');

      // Recarregar dados do usuário
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao fazer upload da foto');
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const getAvatarUrl = () => {
    console.log('🔍 DEBUG foto_perfil:', user?.foto_perfil);

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
  console.log('📸 Avatar URL final:', avatarUrl);

  if (!user) {
    return null;
  }

  const userLevel = user.userLevel || 'Usuário';
  const isModerador = userLevel === 'Moderador' || userLevel === 'Administrador';
  const isAdmin = userLevel === 'Administrador';

  const getBadgeColor = () => {
    switch (userLevel) {
      case 'Administrador':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Moderador':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Meu Perfil - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Meu Perfil
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mx-auto mb-4"></div>

          {/* Badge de Nível do Usuário */}
          <div className="flex justify-center mb-4">
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 font-semibold ${getBadgeColor()}`}>
              {userLevel === 'Administrador' && <Settings className="w-4 h-4" />}
              {userLevel === 'Moderador' && <Shield className="w-4 h-4" />}
              {userLevel}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <Card className="p-6 h-fit">
            {/* Mensagens de Erro/Sucesso */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                {success}
              </div>
            )}

            <div className="text-center mb-6">
              {/* Avatar com botão de upload */}
              <div className="relative w-24 h-24 mx-auto mb-4">
                <div className="w-full h-full rounded-full overflow-hidden bg-primary/10 border-4 border-white shadow-lg">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500">
                      <span className="text-white text-3xl font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Botão de Upload */}
                <label
                  htmlFor="profile-photo-upload"
                  className={`absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-all ${
                    uploadingPhoto ? 'opacity-50 cursor-wait' : ''
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <input
                    id="profile-photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadingPhoto && (
                <p className="text-sm text-blue-600 mb-2">Enviando foto...</p>
              )}

              <h2 className="text-xl font-bold text-foreground mb-1">
                {user.nome_completo || user.username}
              </h2>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>

            <div className="space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                Sair
              </Button>
            </div>
          </Card>

          {/* Main Content */}
          <Card className="md:col-span-2 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-foreground">Informações do Perfil</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Nome de Usuário
                </label>
                <p className="text-muted-foreground">{user.username}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Email
                </label>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status da Conta
                </label>
                <div className="flex gap-2">
                  {user.confirmed ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Confirmado
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs">
                      Aguardando confirmação
                    </span>
                  )}
                  {!user.blocked && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                      Ativo
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Seção de Ações */}
            <div className="mt-8 pt-8 border-t border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Minhas Ações</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Botão: Meu Testemunho */}
                <Button
                  onClick={() => navigate('/meu-testemunho')}
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 hover:bg-blue-50 hover:border-blue-300"
                >
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Meu Testemunho</div>
                    <div className="text-xs text-muted-foreground">Compartilhe sua história</div>
                  </div>
                </Button>

                {/* Botão: Submeter Artigo */}
                <Button
                  onClick={() => navigate('/submeter-artigo')}
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 hover:bg-green-50 hover:border-green-300"
                >
                  <FileText className="w-5 h-5 text-green-600" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Submeter Artigo</div>
                    <div className="text-xs text-muted-foreground">Escreva um artigo</div>
                  </div>
                </Button>

                {/* Botão: Meus Artigos */}
                <Button
                  onClick={() => navigate('/meus-artigos')}
                  variant="outline"
                  className="flex items-center justify-start gap-3 h-auto py-4 px-4 hover:bg-yellow-50 hover:border-yellow-300"
                >
                  <FolderOpen className="w-5 h-5 text-yellow-600" />
                  <div className="text-left">
                    <div className="font-semibold text-foreground">Meus Artigos</div>
                    <div className="text-xs text-muted-foreground">Ver artigos submetidos</div>
                  </div>
                </Button>

                {/* Botão: Moderação (apenas Moderadores e Admins) */}
                {isModerador && (
                  <Button
                    onClick={() => navigate('/moderacao')}
                    variant="outline"
                    className="flex items-center justify-start gap-3 h-auto py-4 px-4 hover:bg-blue-50 hover:border-blue-300"
                  >
                    <Shield className="w-5 h-5 text-blue-700" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Moderação</div>
                      <div className="text-xs text-muted-foreground">Aprovar/Rejeitar conteúdo</div>
                    </div>
                  </Button>
                )}

                {/* Botão: Administração (apenas Admins) */}
                {isAdmin && (
                  <Button
                    onClick={() => navigate('/admin')}
                    variant="outline"
                    className="flex items-center justify-start gap-3 h-auto py-4 px-4 hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Settings className="w-5 h-5 text-purple-700" />
                    <div className="text-left">
                      <div className="font-semibold text-foreground">Administração</div>
                      <div className="text-xs text-muted-foreground">Gerenciar usuários</div>
                    </div>
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
