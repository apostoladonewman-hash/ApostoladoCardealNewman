import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import testimonialService, { Testimonial } from '@/services/testimonialService';
import articleSubmissionService, {
  ArticleSubmission,
} from '@/services/articleSubmissionService';
import {
  FileText,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  MessageSquare,
  Search,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';

// Interface para a estrutura esperada do erro da API
interface ApiErrorData {
  error: {
    message: string;
  };
}

export default function Moderacao() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'testimonials' | 'articles'>(
    'testimonials',
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [articles, setArticles] = useState<ArticleSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState<{ [key: number]: string }>(
    {},
  );
  const [showRejectForm, setShowRejectForm] = useState<{
    [key: number]: boolean;
  }>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user has permission
  const hasPermission =
    user?.userLevel === 'Moderador' || user?.userLevel === 'Administrador';

  useEffect(() => {
    if (!hasPermission) {
      navigate('/perfil');
      return;
    }
    loadData();
  }, [hasPermission, navigate]);

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [testimonialsData, articlesData] = await Promise.all([
        testimonialService.getPendingTestimonials(),
        articleSubmissionService.getPendingArticles(),
      ]);
      setTestimonials(testimonialsData);
      setArticles(articlesData);
    } catch (err) {
      let errorMessage = 'Erro ao carregar dados';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTestimonial = async (id: number) => {
    setProcessing(id);
    try {
      await testimonialService.approveTestimonial(id);
      setTestimonials(testimonials.filter((t) => t.id !== id));
    } catch (err) {
      let errorMessage = 'Erro ao aprovar testemunho';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectTestimonial = async (id: number) => {
    const reason = rejectReason[id];
    if (!reason || reason.trim().length < 10) {
      setError('Por favor, forneça um motivo detalhado (mínimo 10 caracteres)');
      return;
    }

    setProcessing(id);
    try {
      await testimonialService.rejectTestimonial(id, reason);
      setTestimonials(testimonials.filter((t) => t.id !== id));
      setRejectReason({ ...rejectReason, [id]: '' });
      setShowRejectForm({ ...showRejectForm, [id]: false });
    } catch (err) {
      let errorMessage = 'Erro ao rejeitar testemunho';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleApproveArticle = async (id: number) => {
    setProcessing(id);
    try {
      await articleSubmissionService.approveArticle(id);
      setArticles(articles.filter((a) => a.id !== id));
    } catch (err) {
      let errorMessage = 'Erro ao aprovar artigo';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectArticle = async (id: number) => {
    const reason = rejectReason[id];
    if (!reason || reason.trim().length < 10) {
      setError('Por favor, forneça um motivo detalhado (mínimo 10 caracteres)');
      return;
    }

    setProcessing(id);
    try {
      await articleSubmissionService.rejectArticle(id, reason);
      setArticles(articles.filter((a) => a.id !== id));
      setRejectReason({ ...rejectReason, [id]: '' });
      setShowRejectForm({ ...showRejectForm, [id]: false });
    } catch (err) {
      let errorMessage = 'Erro ao rejeitar artigo';
      if (err instanceof AxiosError && err.response?.data) {
        const apiError = err.response.data as ApiErrorData;
        errorMessage = apiError.error?.message || errorMessage;
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filtrar testemunhos por termo de pesquisa
  const filteredTestimonials = testimonials.filter((testimonial) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      testimonial.nome_pessoa?.toLowerCase().includes(term) ||
      testimonial.email?.toLowerCase().includes(term) ||
      testimonial.cidade_atual?.toLowerCase().includes(term) ||
      testimonial.testemunho_completo?.toLowerCase().includes(term)
    );
  });

  // Filtrar artigos por termo de pesquisa
  const filteredArticles = articles.filter((article) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      article.title?.toLowerCase().includes(term) ||
      article.description?.toLowerCase().includes(term) ||
      article.content?.toLowerCase().includes(term)
    );
  });

  if (!hasPermission) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Carregando dados de moderação...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <Helmet>
        <title>Moderação - Apostolado Cardeal Newman</title>
      </Helmet>

      <div className="container max-w-7xl">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Painel de Moderação
          </h1>
          <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full mb-4"></div>
          <p className="text-lg text-muted-foreground">
            Revise e aprove conteúdos submetidos pelos usuários
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" />
            <div className="text-destructive">{error}</div>
          </div>
        )}

        {/* Barra de Pesquisa */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Pesquisar por nome, email, cidade ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              aria-label="Pesquisar conteúdo"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-muted-foreground">
              {activeTab === 'testimonials'
                ? `${filteredTestimonials.length} testemunho(s) encontrado(s)`
                : `${filteredArticles.length} artigo(s) encontrado(s)`}
            </p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'testimonials'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              <span>Testemunhos Pendentes</span>
              {testimonials.length > 0 && (
                <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                  {testimonials.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === 'articles'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              <span>Artigos Pendentes</span>
              {articles.length > 0 && (
                <span className="px-2 py-1 text-xs bg-primary text-white rounded-full">
                  {articles.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {filteredTestimonials.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm
                    ? 'Nenhum resultado encontrado'
                    : 'Nenhum testemunho pendente'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Tente pesquisar com outros termos'
                    : 'Todos os testemunhos foram revisados!'}
                </p>
              </Card>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <Card key={testimonial.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <User className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {testimonial.nome_pessoa}
                          </h3>
                          {testimonial.email && (
                            <p className="text-sm text-muted-foreground">
                              {testimonial.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                        {testimonial.denominacao_anterior && (
                          <div>
                            <span className="font-semibold">
                              Denominação Anterior:
                            </span>{' '}
                            {testimonial.denominacao_anterior}
                          </div>
                        )}
                        {testimonial.data_conversao && (
                          <div>
                            <span className="font-semibold">
                              Data de Conversão:
                            </span>{' '}
                            {formatDate(testimonial.data_conversao)}
                          </div>
                        )}
                        {testimonial.cidade_atual && (
                          <div>
                            <span className="font-semibold">Cidade:</span>{' '}
                            {testimonial.cidade_atual}
                          </div>
                        )}
                        {testimonial.profissao && (
                          <div>
                            <span className="font-semibold">Profissão:</span>{' '}
                            {testimonial.profissao}
                          </div>
                        )}
                      </div>

                      {testimonial.biografia && (
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Biografia:</h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.biografia}
                          </p>
                        </div>
                      )}

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">
                          Testemunho Completo:
                        </h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-border max-h-64 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">
                            {testimonial.testemunho_completo}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          Submetido em {formatDate(testimonial.data_submissao)}
                        </span>
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-col gap-3">
                      <Button
                        onClick={() =>
                          handleApproveTestimonial(testimonial.id!)
                        }
                        disabled={processing === testimonial.id}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processing === testimonial.id ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        )}
                        Aprovar
                      </Button>

                      {!showRejectForm[testimonial.id!] ? (
                        <Button
                          onClick={() =>
                            setShowRejectForm({
                              ...showRejectForm,
                              [testimonial.id!]: true,
                            })
                          }
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Rejeitar
                        </Button>
                      ) : (
                        <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-red-900">
                            Motivo da Rejeição:
                          </label>
                          <textarea
                            value={rejectReason[testimonial.id!] || ''}
                            onChange={(e) =>
                              setRejectReason({
                                ...rejectReason,
                                [testimonial.id!]: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                            placeholder="Explique o motivo da rejeição..."
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() =>
                                handleRejectTestimonial(testimonial.id!)
                              }
                              disabled={processing === testimonial.id}
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              {processing === testimonial.id ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              Confirmar
                            </Button>
                            <Button
                              onClick={() =>
                                setShowRejectForm({
                                  ...showRejectForm,
                                  [testimonial.id!]: false,
                                })
                              }
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            {filteredArticles.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm
                    ? 'Nenhum resultado encontrado'
                    : 'Nenhum artigo pendente'}
                </h3>
                <p className="text-muted-foreground">
                  {searchTerm
                    ? 'Tente pesquisar com outros termos'
                    : 'Todos os artigos foram revisados!'}
                </p>
              </Card>
            ) : (
              filteredArticles.map((article) => (
                <Card key={article.id} className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-4">
                        <FileText className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-foreground mb-1">
                            {article.title}
                          </h3>
                          {article.description && (
                            <p className="text-sm text-muted-foreground">
                              {article.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Conteúdo:</h4>
                        <div className="bg-gray-50 p-4 rounded-lg border border-border max-h-96 overflow-y-auto">
                          <p className="text-sm whitespace-pre-wrap">
                            {article.content}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>
                          Submetido em {formatDate(article.data_submissao)}
                        </span>
                      </div>
                    </div>

                    <div className="lg:w-64 flex flex-col gap-3">
                      <Button
                        onClick={() => handleApproveArticle(article.id!)}
                        disabled={processing === article.id}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                      >
                        {processing === article.id ? (
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-5 h-5 mr-2" />
                        )}
                        Aprovar
                      </Button>

                      {!showRejectForm[article.id!] ? (
                        <Button
                          onClick={() =>
                            setShowRejectForm({
                              ...showRejectForm,
                              [article.id!]: true,
                            })
                          }
                          variant="outline"
                          className="w-full border-red-600 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Rejeitar
                        </Button>
                      ) : (
                        <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <label className="block text-sm font-semibold text-red-900">
                            Motivo da Rejeição:
                          </label>
                          <textarea
                            value={rejectReason[article.id!] || ''}
                            onChange={(e) =>
                              setRejectReason({
                                ...rejectReason,
                                [article.id!]: e.target.value,
                              })
                            }
                            rows={4}
                            className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                            placeholder="Explique o motivo da rejeição..."
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleRejectArticle(article.id!)}
                              disabled={processing === article.id}
                              size="sm"
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            >
                              {processing === article.id ? (
                                <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                              ) : (
                                <XCircle className="w-4 h-4 mr-1" />
                              )}
                              Confirmar
                            </Button>
                            <Button
                              onClick={() =>
                                setShowRejectForm({
                                  ...showRejectForm,
                                  [article.id!]: false,
                                })
                              }
                              size="sm"
                              variant="outline"
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
