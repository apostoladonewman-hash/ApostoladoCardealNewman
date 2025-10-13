import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import Layout from '@/components/site/Layout';
import SkipToContent from '@/components/SkipToContent';

// Lazy load pages
const Index = lazy(() => import('@/pages/Index'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Artigo = lazy(() => import('@/pages/Artigo'));
const Depoimento = lazy(() => import('@/pages/Depoimento'));
const Registro = lazy(() => import('@/pages/Registro'));
const Login = lazy(() => import('@/pages/Login'));
const Perfil = lazy(() => import('@/pages/Perfil'));
const AdminPainel = lazy(() => import('@/pages/AdminPainel'));
const Sobre = lazy(() => import('@/pages/Sobre'));
const Newman = lazy(() => import('@/pages/Newman'));
const Testemunhos = lazy(() => import('@/pages/Testemunhos'));
const Artigos = lazy(() => import('@/pages/Artigos'));
const Links = lazy(() => import('@/pages/Links'));
const Biblioteca = lazy(() => import('@/pages/Biblioteca'));
const Contato = lazy(() => import('@/pages/Contato'));

// New pages - Sistema de Contribuição
const MeuTestemunho = lazy(() => import('@/pages/MeuTestemunho'));
const SubmeterArtigo = lazy(() => import('@/pages/SubmeterArtigo'));
const MeusArtigos = lazy(() => import('@/pages/MeusArtigos'));
const Moderacao = lazy(() => import('@/pages/Moderacao'));
const Admin = lazy(() => import('@/pages/Admin'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <SkipToContent />
          <Layout>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/sobre" element={<Sobre />} />
                <Route path="/newman" element={<Newman />} />
                <Route path="/testemunhos" element={<Testemunhos />} />
                <Route path="/artigos" element={<Artigos />} />
                <Route path="/links" element={<Links />} />
                <Route path="/biblioteca" element={<Biblioteca />} />
                <Route path="/contato" element={<Contato />} />
                <Route path="/artigo/:id" element={<Artigo />} />
                <Route path="/testemunho/:id" element={<Depoimento />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/login" element={<Login />} />

                {/* Rotas Protegidas - Usuários Autenticados */}
                <Route
                  path="/perfil"
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meu-testemunho"
                  element={
                    <ProtectedRoute>
                      <MeuTestemunho />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/submeter-artigo"
                  element={
                    <ProtectedRoute>
                      <SubmeterArtigo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/meus-artigos"
                  element={
                    <ProtectedRoute>
                      <MeusArtigos />
                    </ProtectedRoute>
                  }
                />

                {/* Rotas Protegidas - Moderadores e Administradores */}
                <Route
                  path="/moderacao"
                  element={
                    <ProtectedRoute>
                      <Moderacao />
                    </ProtectedRoute>
                  }
                />

                {/* Rotas Protegidas - Apenas Administradores */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/painel"
                  element={
                    <ProtectedRoute>
                      <AdminPainel />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
