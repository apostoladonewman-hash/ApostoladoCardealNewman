import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { useAuthors } from '@/hooks/useAuthors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchBar } from '@/components/ui/search-bar';
import { Heart, MapPin, Briefcase, ArrowRight } from 'lucide-react';

export default function Testemunhos() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: response, isLoading, error } = useAuthors({
    filters: {
      testemunho_completo: { $notNull: true }
    },
    populate: {
      avatar: true
    },
    sort: ['publishedAt:desc']
  });

  const allTestimonies = response?.data || [];

  // Filtrar testemunhos baseado na pesquisa
  const filteredTestimonies = useMemo(() => {
    if (!searchQuery.trim()) return allTestimonies;

    const query = searchQuery.toLowerCase();
    return allTestimonies.filter(author =>
      author.nome_pessoa.toLowerCase().includes(query) ||
      author.denominacao_anterior?.toLowerCase().includes(query) ||
      author.cidade_atual?.toLowerCase().includes(query) ||
      author.profissao?.toLowerCase().includes(query) ||
      author.biografia?.toLowerCase().includes(query) ||
      author.testemunho_completo?.toLowerCase().includes(query)
    );
  }, [allTestimonies, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  return (
    <>
      <Helmet>
        <title>Testemunhos de Conversão — Apostolado Cardeal Newman</title>
        <meta name="description" content="Histórias reais de conversão ao catolicismo. Testemunhos autênticos de fé e transformação." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Histórias Reais de Conversão</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Testemunhos de Fé
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Conheça as jornadas de conversão de protestantes que encontraram a plenitude da fé na Igreja Católica
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <SearchBar
                  placeholder="Buscar por nome, denominação anterior, cidade ou profissão..."
                  onSearch={setSearchQuery}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>{allTestimonies.length} testemunhos</span>
                </div>
                {searchQuery && (
                  <div className="flex items-center gap-2">
                    <span>•</span>
                    <span>{filteredTestimonies.length} resultados</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonies Grid */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {filteredTestimonies.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'Nenhum testemunho encontrado' : 'Nenhum testemunho disponível'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Tente buscar com outros termos'
                    : 'Novos testemunhos serão publicados em breve'}
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTestimonies.map((author) => {
                  const photoUrl = author.avatar?.url;
                  const excerpt = author.biografia || author.testemunho_completo?.substring(0, 180) || 'Testemunho de conversão à Igreja Católica';

                  return (
                    <Link
                      to={`/testemunho/${author.id_testemunhos || author.documentId}`}
                      key={author.id}
                      className="group"
                    >
                      <Card className="h-full overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                        <div className="p-6 space-y-4">
                          {/* Author Header */}
                          <div className="flex items-start gap-4">
                            {photoUrl ? (
                              <img
                                src={`${import.meta.env.VITE_STRAPI_URL}${photoUrl}`}
                                alt={author.nome_pessoa}
                                className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/40 transition-colors"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-gold-warm/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/40 transition-colors">
                                <span className="text-2xl font-bold text-primary">
                                  {author.nome_pessoa.charAt(0)}
                                </span>
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <h2 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                {author.nome_pessoa}
                              </h2>
                              {author.denominacao_anterior && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 mt-2 text-xs font-semibold text-primary bg-primary/10 border border-primary/20 rounded-full">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  Ex-{author.denominacao_anterior}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Meta Info */}
                          {(author.cidade_atual || author.profissao) && (
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {author.cidade_atual && (
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="w-3.5 h-3.5" />
                                  <span>{author.cidade_atual}</span>
                                </div>
                              )}
                              {author.profissao && (
                                <div className="flex items-center gap-1.5">
                                  <Briefcase className="w-3.5 h-3.5" />
                                  <span>{author.profissao}</span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Excerpt */}
                          <p className="text-muted-foreground leading-relaxed line-clamp-4 text-sm">
                            {excerpt}
                          </p>

                          {/* Read More */}
                          <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all pt-2 border-t border-border/50">
                            <span>Ler testemunho completo</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
