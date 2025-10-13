import { useState } from 'react';
import { useAuth, LoginCredentials } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';
import { AxiosError } from 'axios';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ApiErrorData {
  error: {
    message: string;
  };
}

export default function Login() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    identifier: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(credentials);
      toast.success('Login realizado com sucesso!');
      navigate('/perfil');
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message ||
          'Identificador ou senha inválidos.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Login - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Acessar Conta
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Bem-vindo de volta!</p>
        </div>

        <Card className="p-8 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Email ou Nome de Usuário
              </label>
              <input
                id="identifier"
                type="text"
                name="identifier"
                value={credentials.identifier}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="seu@email.com ou nomedeusuario"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-foreground mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Sua senha"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{' '}
              <Link
                to="/registro"
                className="text-primary font-semibold hover:underline"
              >
                Criar Conta
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
