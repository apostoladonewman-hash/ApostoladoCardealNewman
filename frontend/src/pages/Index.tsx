import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import hero from "@/assets/cardeal_newman.png";
import { useRecentArticles } from '@/hooks/useArticles';
import { useRecentTestimonials } from '@/hooks/useAuthors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

const Index = () => {
  const canonical =
    typeof window !== 'undefined' ? window.location.href : undefined;
  const siteTitle = 'Apostolado Cardeal Newman — Depoimentos e Artigos';
  const siteDescription =
    'Depoimentos de ex-protestantes e artigos sobre a fé católica.';
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Apostolado Cardeal Newman',
    description: siteDescription,
    url: canonical,
  };

  // Buscar artigos recentes
  const { data: articles = [], isLoading: loadingArticles, error: articlesError } = useRecentArticles(3);

  // Buscar testemunhos recentes
  const { data: testimonials = [], isLoading: loadingTestimonials, error: testimonialsError } = useRecentTestimonials(3);

  // Estados de loading e erro
  if (loadingArticles || loadingTestimonials) {
    return <LoadingSpinner />;
  }

  if (articlesError || testimonialsError) {
    return <ErrorMessage error={(articlesError || testimonialsError) as Error} />;
  }

  return (
    <div>
      <Helmet>
        <title>{siteTitle}</title>
        {canonical && <link rel="canonical" href={canonical} />}
        <meta name="description" content={siteDescription} />
        <script type="application/ld+json">
          {JSON.stringify(websiteJsonLd)}
        </script>
      </Helmet>

      <section className="relative overflow-hidden">
        {/* Gradiente decorativo superior */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

        {/* Imagem de fundo apenas no mobile */}
        <div className="absolute top-0 right-0 md:hidden flex items-start justify-end overflow-hidden h-full w-full">
          <img
            src={hero}
            alt="Cardeal Newman"
            className="h-[60%] w-auto object-contain opacity-30 -mt-4 rounded-3xl"
          />
        </div>

        <div className="container relative grid md:grid-cols-2 gap-16 py-20 md:py-32 items-center">
          <div className="space-y-8 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Testemunhos de Conversão</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-foreground">
                Apostolado<br/>
                <span className="bg-gradient-to-br from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] bg-clip-text text-transparent">
                  Cardeal Newman
                </span>
              </h1>

              <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full"></div>
            </div>

            <p className="text-xl md:text-2xl text-muted-foreground/90 max-w-prose leading-relaxed">
              Testemunhos e artigos de quem, vindo do protestantismo,
              encontrou a <span className="font-semibold text-foreground">plenitude da fé</span> na Igreja Católica.
            </p>

            <blockquote className="relative border-l-4 border-primary/30 pl-6 py-3 italic text-lg text-muted-foreground bg-gradient-to-r from-primary/5 to-transparent rounded-r">
              <p className="mb-2">"Crescer é mudar, e ser perfeito é ter mudado muitas vezes."</p>
              <footer className="text-sm not-italic font-semibold text-foreground/70">
                — São João Henrique Newman
              </footer>
            </blockquote>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg" className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white shadow-lg hover:shadow-xl transition-all">
                <a href="#depoimentos">Ler depoimentos</a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-[hsl(var(--bronze))]/30 hover:border-[hsl(var(--bronze))] hover:bg-[hsl(var(--primary))]/5">
                <a href="#artigos">Explorar artigos</a>
              </Button>
            </div>
          </div>

          <div className="hidden md:block">
            <img
              src={hero}
              alt="Cardeal Newman"
              className="w-full h-auto rounded-3xl"
            />
          </div>
        </div>

        {/* Divisor decorativo */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
      </section>

      {/* Seção de Depoimentos */}
      <section id="depoimentos" className="py-20 md:py-28 relative">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent"></div>

        <div className="container relative">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <span className="text-sm font-medium text-primary">Histórias Reais</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Depoimentos em Destaque
            </h2>

            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Testemunhos autênticos de quem encontrou a plenitude da fé na Igreja Católica
            </p>
          </header>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum testemunho disponível no momento.</p>
              </div>
            ) : (
              testimonials.map((author) => (
                <Link
                  key={author.documentId}
                  to={`/testemunho/${author.id_testemunhos || author.documentId}`}
                  className="group"
                >
                  <div className="relative h-full rounded-2xl bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 transform hover:-translate-y-1">
                    {/* Gradiente superior decorativo */}
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <article className="flex-1 flex flex-col h-full">
                      {/* Avatar do autor */}
                      <div className="flex items-center gap-4 mb-6">
                        {author.avatar?.url ? (
                          <img
                            src={`http://localhost:1337${author.avatar.url}`}
                            alt={author.nome_pessoa}
                            className="author-avatar-sm"
                          />
                        ) : (
                          <div className="author-avatar-sm bg-primary/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary">
                              {author.nome_pessoa.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors leading-tight">
                            {author.nome_pessoa}
                          </h3>
                          {author.denominacao_anterior && (
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 mt-1">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                              <span className="text-xs font-medium text-primary">
                                Ex-{author.denominacao_anterior}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <p className="text-muted-foreground line-clamp-3 flex-1 leading-relaxed mb-6">
                        {author.biografia || author.testemunho_completo?.substring(0, 180) || 'Testemunho de conversão à Igreja Católica.'}
                      </p>

                      <div className="flex items-center text-sm font-semibold text-primary group-hover:gap-2 gap-1 transition-all">
                        <span>Ler testemunho completo</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </article>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Seção de Artigos */}
      <section id="artigos" className="py-20 md:py-28 relative bg-gradient-to-b from-primary/[0.02] via-transparent to-transparent">
        <div className="container relative">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-yellow-600/5 border border-yellow-600/10 mb-4">
              <span className="text-sm font-medium text-yellow-700">Reflexões Profundas</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Artigos Recentes
            </h2>

            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-yellow-600 to-primary rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estudos e meditações para aprofundar seu conhecimento da fé católica
            </p>
          </header>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Nenhum artigo disponível no momento.</p>
              </div>
            ) : (
              articles.map((article) => {
                const authorName = article.author?.nome_pessoa || 'Autor Desconhecido';
                const publishDate = article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('pt-BR') : '';

                return (
                  <Link key={article.documentId} to={`/artigo/${article.slug}`} className="group">
                    <div className="relative h-full rounded-2xl bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl hover:border-yellow-600/30 transition-all duration-300 transform hover:-translate-y-1">
                      {/* Gradiente superior decorativo */}
                      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-yellow-600/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      <article className="flex-1 flex flex-col">
                        {/* Autor com avatar */}
                        <div className="flex items-center gap-3 mb-4">
                          {article.author?.avatar?.url ? (
                            <img
                              src={`http://localhost:1337${article.author.avatar.url}`}
                              alt={authorName}
                              className="author-avatar-sm"
                            />
                          ) : (
                            <div className="author-avatar-sm bg-yellow-600/10 flex items-center justify-center">
                              <span className="text-lg font-bold text-yellow-700">
                                {authorName.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate">{authorName}</div>
                            {publishDate && (
                              <div className="text-xs text-muted-foreground">{publishDate}</div>
                            )}
                          </div>
                        </div>

                        <h3 className="text-2xl font-bold mb-4 group-hover:text-yellow-700 transition-colors leading-tight">
                          {article.title}
                        </h3>

                        <p className="text-muted-foreground line-clamp-3 flex-1 leading-relaxed mb-6">
                          {article.description || 'Artigo sobre fé católica.'}
                        </p>

                        <div className="flex items-center text-sm font-semibold text-yellow-700 group-hover:gap-2 gap-1 transition-all">
                          <span>Ler artigo completo</span>
                          <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </article>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Seção YouTube e Instagram */}
      <section className="py-20 md:py-28 relative border-t">
        <div className="container">
          <header className="mb-16 text-center">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-4">
              <span className="text-sm font-medium text-primary">Conecte-se Conosco</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Siga-nos nas Redes
            </h2>

            <div className="flex justify-center mb-4">
              <div className="h-1 w-20 bg-gradient-to-r from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] rounded-full"></div>
            </div>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Acompanhe nossos vídeos, reflexões e conteúdos exclusivos
            </p>
          </header>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* YouTube */}
            <div className="relative rounded-2xl bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10">
                  <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">YouTube</h3>
                  <p className="text-sm text-muted-foreground">Vídeos e Testemunhos</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Assista nossos vídeos com testemunhos de conversão, reflexões sobre a fé católica e muito mais.
              </p>

              <a
                href="https://www.youtube.com/@ApostoladoCardealNewman"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[hsl(var(--accent))] to-[hsl(var(--accent))]/80 hover:from-[hsl(var(--accent))]/90 hover:to-[hsl(var(--accent))]/70 text-white font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                </svg>
                Ir para o YouTube
              </a>
            </div>

            {/* Instagram */}
            <div className="relative rounded-2xl bg-card border border-border/50 p-8 shadow-sm hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">Instagram</h3>
                  <p className="text-sm text-muted-foreground">@apostoladocardealnewman</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-6 leading-relaxed">
                Siga-nos no Instagram para conteúdos diários, citações inspiradoras e atualizações do apostolado.
              </p>

              <a
                href="https://www.instagram.com/apostoladocardealnewman/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-br from-[hsl(var(--bronze))] via-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--gold-warm))] text-white font-semibold transition-all shadow-md hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Seguir no Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Newsletter */}
      <section id="assine" className="py-24 md:py-32 relative overflow-hidden">
        {/* Background decorativo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-yellow-600/5 to-primary/10"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,0,0,0.03) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>

        <div className="container max-w-3xl text-center relative z-10">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-sm font-medium text-primary">Newsletter</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Receba Novidades em seu Email
          </h2>

          <div className="flex justify-center mb-6">
            <div className="h-1 w-20 bg-gradient-to-r from-primary to-yellow-600 rounded-full"></div>
          </div>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Assine nossa newsletter e receba novos depoimentos de conversão e artigos sobre a fé católica
            diretamente em sua caixa de entrada.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="relative flex-1">
              <input
                aria-label="Seu email"
                type="email"
                placeholder="seu@email.com"
                className="h-14 px-6 rounded-xl border-2 border-border bg-background w-full text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary shadow-sm transition-all"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>
            <Button className="h-14 px-8 bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto">
              Assinar Agora
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 mt-6 text-xs text-muted-foreground">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Seus dados estão seguros. Sem spam, apenas conteúdo de qualidade.</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
