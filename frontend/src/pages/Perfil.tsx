import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Perfil() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

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
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Sidebar */}
          <Card className="p-6 h-fit">
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">{user.username}</h2>
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
          </Card>
        </div>
      </div>
    </div>
  );
}
