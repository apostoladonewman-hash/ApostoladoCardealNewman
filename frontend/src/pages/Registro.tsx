import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { PasswordStrengthMeter } from '@/components/PasswordStrengthMeter';
import { validatePassword } from '@/utils/password-validation';

export default function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar senha antes de enviar
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message || 'Senha não atende aos requisitos de segurança');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/perfil');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || err.message || 'Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Criar Conta - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Criar Conta
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Junte-se à comunidade do Apostolado Cardeal Newman
          </p>
        </div>

        <Card className="p-8 shadow-lg">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nome de Usuário *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="nomedeusuario"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Mínimo 8 caracteres"
              />
              <PasswordStrengthMeter password={formData.password} />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Fazer Login
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
}
