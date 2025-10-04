import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Artigo from '@/pages/Artigo';
import Depoimento from '@/pages/Depoimento';
import Registro from '@/pages/Registro';
import Login from '@/pages/Login';
import Perfil from '@/pages/Perfil';
import AdminPainel from '@/pages/AdminPainel';
import Sobre from '@/pages/Sobre';
import Newman from '@/pages/Newman';
import Testemunhos from '@/pages/Testemunhos';
import Artigos from '@/pages/Artigos';
import Links from '@/pages/Links';
import Biblioteca from '@/pages/Biblioteca';
import Contato from '@/pages/Contato';
import Layout from '@/components/site/Layout';

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
          <Layout>
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
              <Route path="/perfil" element={<ProtectedRoute><Perfil /></ProtectedRoute>} />
              <Route path="/admin/painel" element={<ProtectedRoute><AdminPainel /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
