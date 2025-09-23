import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Artigo from '@/pages/Artigo';
import Depoimento from '@/pages/Depoimento';
import Layout from '@/components/site/Layout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/artigos/:slug" element={<Artigo />} />
            <Route path="/depoimentos/:slug" element={<Depoimento />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;
