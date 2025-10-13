import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { useArticles } from '@/hooks/useArticles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchBar } from '@/components/ui/search-bar';
import { BookOpen, Calendar, User } from 'lucide-react';

export default function Artigos() {
  const [searchQuery, setSearchQuery] = useState('');

  const {
    data: response,
    isLoading,
    error,
  } = useArticles({
    populate: {
      author: {
        populate: ['avatar'],
      },
      category: true,
    },
    sort: ['publishedAt:desc'],
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const allArticles = response?.data || [];

  // Filtrar artigos baseado na pesquisa
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return allArticles;

    const query = searchQuery.toLowerCase();
    return allArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.author?.nome_pessoa.toLowerCase().includes(query) ||
        article.category?.name.toLowerCase().includes(query),
    );
  }, [allArticles, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  return (
    <>
      <Helmet>
        <title>Artigos — Apostolado Cardeal Newman</title>
        <meta
          name="description"
          content="Explore artigos, reflexões e estudos profundos sobre a fé católica."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Biblioteca de Artigos
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Artigos Católicos
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Reflexões, estudos e aprofundamentos sobre a fé católica por
                autores dedicados à verdade
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <SearchBar
                  placeholder="Buscar por título, autor, categoria ou tema..."
                  onSearch={setSearchQuery}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{allArticles.length} artigos</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>{filteredArticles.length} resultados</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery
                    ? 'Nenhum artigo encontrado'
                    : 'Nenhum artigo disponível'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Tente buscar com outros termos'
                    : 'Novos artigos serão publicados em breve'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles.map((article) => {
                  const author = article.author;
                  const category = article.category;
                  const photoUrl = author?.avatar?.url;
                  const publishDate = article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString(
                        'pt-BR',
                        {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        },
                      )
                    : '';

                  return (
                    <Link
                      to={`/artigo/${article.slug || article.id}`}
                      key={article.id}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                        {/* Category Badge */}
                        {category && (
                          <div className="px-6 pt-6">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full">
                              {category.name}
                            </span>
                          </div>
                        )}

                        <div className="p-6 space-y-4">
                          {/* Title */}
                          <h2 className="text-xl md:text-2xl font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h2>

                          {/* Description */}
                          <p className="text-muted-foreground leading-relaxed line-clamp-3">
                            {article.description}
                          </p>

                          {/* Meta Info */}
                          <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                            {/* Author */}
                            {author && (
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {photoUrl ? (
                                  <img
                                    src={`${import.meta.env.VITE_STRAPI_URL}${photoUrl}`}
                                    alt={author.nome_pessoa}
                                    className="w-8 h-8 rounded-full object-cover border border-border"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                    <User className="w-4 h-4 text-primary" />
                                  </div>
                                )}
                                <span className="text-sm font-medium text-foreground truncate">
                                  {author.nome_pessoa}
                                </span>
                              </div>
                            )}

                            {/* Date */}
                            {publishDate && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{publishDate}</span>
                              </div>
                            )}
                          </div>

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all pt-2">
                            <span>Ler artigo</span>
                            <span className="group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
