import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import DOMPurify from 'dompurify';
import { authService } from '@/services/auth';

const API_URL = import.meta.env.VITE_API_URL;

interface PendingContent {
  id: number;
  type: 'Artigo' | 'Testemunho';
  title: string;
  autor_contribuidor?: { nome_completo: string };
  categoria?: { name: string };
  createdAt: string;
  content: string;
}

// Definição de tipo correta para a estrutura de erro da API
interface ApiErrorData {
  error: {
    message: string;
  };
}

export default function AdminPainel() {
  const [pendingContents, setPendingContents] = useState<PendingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadPendingContents = useCallback(async () => {
    const token = authService.getToken();
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/pending-contents/pending`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'pagination[withCount]': true,
        },
      });
      setPendingContents(response.data.data);
      setTotal(response.data.meta.pagination.total);
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message ||
          'Erro ao carregar conteúdos pendentes.',
      );
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    loadPendingContents();
  }, [loadPendingContents]);

  const handleApprove = async (id: number, type: string) => {
    const token = authService.getToken();
    if (processingId || !token) return;
    setProcessingId(id);
    try {
      await axios.post(
        `${API_URL}/api/pending-contents/${id}/approve`,
        { type },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast.success('Conteúdo aprovado e publicado com sucesso!');
      await loadPendingContents();
    } catch (err) {
      const axiosError = err as AxiosError<ApiErrorData>;
      toast.error(
        axiosError.response?.data?.error?.message || 'Erro ao aprovar conteúdo',
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: number, type: string) => {
    const token = authService.getToken();
    const reason = prompt(
      'Por favor, insira o motivo da rejeição (será enviado ao autor):',
    );
    if (reason) {
      if (processingId || !token) return;
      setProcessingId(id);
      try {
        await axios.post(
          `${API_URL}/api/pending-contents/${id}/reject`,
          {
            type,
            reason,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        toast.success('Conteúdo rejeitado com sucesso!');
        await loadPendingContents();
      } catch (err) {
        const axiosError = err as AxiosError<ApiErrorData>;
        toast.error(
          axiosError.response?.data?.error?.message ||
            'Erro ao rejeitar conteúdo',
        );
      } finally {
        setProcessingId(null);
      }
    }
  };

  if (
    !user ||
    !user.role ||
    (user.role.name !== 'Administrator' && user.role.name !== 'Moderator')
  ) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold">Acesso Negado</h1>
        <p>Você não tem permissão para acessar esta página.</p>
        <Button onClick={() => navigate('/')} className="mt-4">
          Voltar para a Home
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Painel de Moderação</title>
      </Helmet>
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Painel de Moderação</h1>
          <Button onClick={() => navigate('/admin')} variant="outline">
            Gerenciar Usuários
          </Button>
        </div>

        {loading ? (
          <p>Carregando...</p>
        ) : pendingContents.length === 0 ? (
          <Card className="text-center p-8">
            <div className="w-16 h-16 text-muted-foreground mx-auto mb-4">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Tudo em ordem!</h2>
            <p className="text-muted-foreground">
              Não há nenhum conteúdo pendente para moderação no momento.
            </p>
          </Card>
        ) : (
          <div className="space-y-6">
            {pendingContents.map((content) => (
              <Card key={content.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-start">
                    <div>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded-md ${
                          content.type === 'Artigo'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {content.type}
                      </span>
                      <h3 className="text-xl font-bold mt-2">
                        {content.title}
                      </h3>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>
                        <strong>Autor:</strong>{' '}
                        {content.autor_contribuidor?.nome_completo ||
                          'Não informado'}
                      </p>
                      {content.categoria && (
                        <p>
                          <strong>Categoria:</strong> {content.categoria.name}
                        </p>
                      )}
                      <p>
                        <strong>Enviado em:</strong>{' '}
                        {new Date(content.createdAt).toLocaleDateString(
                          'pt-BR',
                          {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                          },
                        )}
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none border-t pt-4">
                    <p className="font-semibold mb-2">Conteúdo:</p>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(content.content, {
                          ALLOWED_TAGS: [
                            'p',
                            'br',
                            'strong',
                            'em',
                            'u',
                            'h1',
                            'h2',
                            'h3',
                            'h4',
                            'h5',
                            'h6',
                            'ul',
                            'ol',
                            'li',
                            'a',
                            'blockquote',
                          ],
                          ALLOWED_ATTR: ['href', 'target'],
                        }),
                      }}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(content.id, content.type)}
                      disabled={processingId === content.id}
                    >
                      Rejeitar
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => handleApprove(content.id, content.type)}
                      disabled={processingId === content.id}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Aprovar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Anterior
              </Button>
              {Array.from(
                { length: Math.ceil(total / pageSize) },
                (_, i) => i + 1,
              )
                .filter(
                  (p) =>
                    p === 1 ||
                    p === Math.ceil(total / pageSize) ||
                    Math.abs(p - page) <= 1,
                )
                .map((p, index, arr) => (
                  <div key={p} className="flex items-center">
                    {index > 0 && p - arr[index - 1] > 1 && (
                      <span className="text-muted-foreground mx-2">...</span>
                    )}
                    <Button
                      variant={p === page ? 'default' : 'outline'}
                      onClick={() => setPage(p)}
                    >
                      {p}
                    </Button>
                  </div>
                ))}

              <Button
                onClick={() =>
                  setPage((p) => Math.min(Math.ceil(total / pageSize), p + 1))
                }
                disabled={page === Math.ceil(total / pageSize)}
              >
                Próximo
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
