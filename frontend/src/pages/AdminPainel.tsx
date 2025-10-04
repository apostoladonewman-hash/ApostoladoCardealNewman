import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { authService } from '@/services/auth';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

interface PendingContent {
  id: number;
  documentId: string;
  tipo_conteudo: string;
  titulo: string;
  conteudo: string;
  status_aprovacao: string;
  data_submissao: string;
  autor_contribuidor: {
    nome_completo: string;
    email: string;
  };
  categoria: {
    name: string;
  };
}

export default function AdminPainel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [pendingContents, setPendingContents] = useState<PendingContent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<PendingContent | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!authService.isAuthenticated() || !authService.isAdmin()) {
      navigate('/');
      return;
    }

    loadPendingContents();
  }, [navigate]);

  const loadPendingContents = async () => {
    try {
      const token = authService.getToken();
      const response = await axios.get(`${API_URL}/api/pending-contents/pending`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPendingContents(response.data.data);
    } catch (err: any) {
      setError('Erro ao carregar conteúdos pendentes');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    setError(null);
    setSuccess(null);

    try {
      const token = authService.getToken();
      await axios.put(
        `${API_URL}/api/pending-contents/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Conteúdo aprovado e publicado com sucesso!');
      await loadPendingContents();
      setSelectedContent(null);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao aprovar conteúdo');
    }
  };

  const handleReject = async (id: number) => {
    if (!rejectionReason.trim()) {
      setError('Por favor, informe o motivo da rejeição');
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const token = authService.getToken();
      await axios.put(
        `${API_URL}/api/pending-contents/${id}/reject`,
        {
          data: {
            motivo_rejeicao: rejectionReason
          }
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSuccess('Conteúdo rejeitado com sucesso!');
      await loadPendingContents();
      setSelectedContent(null);
      setRejectionReason('');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao rejeitar conteúdo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Painel de Administração - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Painel de Administração
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mb-4"></div>
            <p className="text-lg text-muted-foreground">
              Gerencie conteúdos pendentes de aprovação
            </p>
          </div>
          <Button
            onClick={() => navigate('/perfil')}
            variant="outline"
          >
            Voltar ao Perfil
          </Button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {pendingContents.length === 0 ? (
          <Card className="p-12 text-center">
            <svg className="w-16 h-16 text-muted-foreground mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-bold text-foreground mb-2">
              Nenhum conteúdo pendente
            </h3>
            <p className="text-muted-foreground">
              Não há conteúdos aguardando aprovação no momento.
            </p>
          </Card>
        ) : (
          <div className="grid gap-6">
            {pendingContents.map((content) => (
              <Card key={content.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-foreground">
                        {content.titulo}
                      </h3>
                      <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary">
                        {content.tipo_conteudo === 'article' ? 'Artigo' : content.tipo_conteudo}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Por: {content.autor_contribuidor?.nome_completo || 'Desconhecido'}
                      </span>
                      {content.categoria && (
                        <span>
                          Categoria: {content.categoria.name}
                        </span>
                      )}
                      <span>
                        {new Date(content.data_submissao).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setSelectedContent(content)}
                      variant="outline"
                      size="sm"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                </div>

                {selectedContent?.id === content.id && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="mb-6">
                      <h4 className="font-semibold text-foreground mb-3">Conteúdo:</h4>
                      <div
                        className="prose prose-sm max-w-none p-4 bg-muted/30 rounded-lg"
                        dangerouslySetInnerHTML={{ __html: content.conteudo }}
                      />
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Motivo da rejeição (se aplicável):
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                          placeholder="Descreva o motivo da rejeição..."
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          onClick={() => handleApprove(content.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Aprovar e Publicar
                        </Button>
                        <Button
                          onClick={() => handleReject(content.id)}
                          variant="outline"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-white"
                        >
                          Rejeitar
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedContent(null);
                            setRejectionReason('');
                          }}
                          variant="outline"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
