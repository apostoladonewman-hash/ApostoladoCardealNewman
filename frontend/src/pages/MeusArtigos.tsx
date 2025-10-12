import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import articleSubmissionService, { ArticleSubmission } from '@/services/articleSubmissionService';
import { FileText, Clock, CheckCircle, XCircle, Edit, Plus, AlertCircle } from 'lucide-react';

export default function MeusArtigos() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<ArticleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      const data = await articleSubmissionService.getMyArticles();
      setArticles(data);
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Erro ao carregar artigos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium">
          <Clock className="w-4 h-4" />
          Aguardando Moderação
        </span>
      ),
      approved: (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Aprovado
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
          <XCircle className="w-4 h-4" />
          Rejeitado
        </span>
      ),
    };

    return badges[status as keyof typeof badges] || null;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const canEdit = (article: ArticleSubmission) => {
    return article.status === 'pending' || article.status === 'rejected';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">Carregando seus artigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Meus Artigos - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-6xl">
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Meus Artigos
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mb-4"></div>
              <p className="text-lg text-muted-foreground">
                Gerencie seus artigos submetidos e acompanhe o status da moderação
              </p>
            </div>
            <Button
              onClick={() => navigate('/submeter-artigo')}
              className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Novo Artigo
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive">
            {error}
          </div>
        )}

        {articles.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum artigo submetido</h3>
            <p className="text-muted-foreground mb-6">
              Você ainda não submeteu nenhum artigo. Comece compartilhando seu conhecimento!
            </p>
            <Button
              onClick={() => navigate('/submeter-artigo')}
              className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white"
            >
              <Plus className="w-5 h-5 mr-2" />
              Submeter Primeiro Artigo
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {articles.map((article) => (
              <Card key={article.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-3 mb-2">
                      <FileText className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground mb-1 truncate">
                          {article.title}
                        </h3>
                        {article.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {article.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Submetido em {formatDate(article.data_submissao || '')}</span>
                      </div>
                    </div>

                    {article.status === 'rejected' && article.motivo_rejeicao && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-red-900 mb-1">
                              Motivo da Rejeição:
                            </p>
                            <p className="text-sm text-red-800">{article.motivo_rejeicao}</p>
                            <p className="text-xs text-red-700 mt-2">
                              Você pode editar e reenviar seu artigo.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {article.status === 'approved' && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          Parabéns! Seu artigo foi aprovado e está publicado no site.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-3">
                    {getStatusBadge(article.status)}
                    {canEdit(article) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/editar-artigo/${article.id}`)}
                        className="w-full md:w-auto"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Status dos Artigos
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li className="flex items-start gap-2">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Aguardando Moderação:</strong> Seu artigo está na fila para análise
                pela equipe de moderação.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Aprovado:</strong> Seu artigo foi aprovado e está publicado no site.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>
                <strong>Rejeitado:</strong> Seu artigo foi rejeitado. Verifique o motivo e
                faça as alterações necessárias antes de reenviar.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
