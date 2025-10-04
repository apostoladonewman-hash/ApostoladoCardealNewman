import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthor } from '@/hooks/useAuthors';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

export default function Depoimento() {
  const { id } = useParams();

  const { data: author, isLoading, error } = useAuthor(id || '');

  const title = author
    ? `${author.nome_pessoa}: testemunho — Apostolado Cardeal Newman`
    : 'Depoimento — Apostolado Cardeal Newman';
  const description =
    author?.biografia ?? 'Depoimento do Apostolado Cardeal Newman';
  const canonical =
    typeof window !== 'undefined' ? window.location.href : undefined;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!author) {
    return (
      <div className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-semibold mb-4">
            Depoimento não encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            Talvez ele tenha sido movido ou o link esteja incorreto.
          </p>
          <Link to="/" className="text-primary underline underline-offset-4">
            Voltar à página inicial
          </Link>
        </div>
      </div>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${author.nome_pessoa} — Testemunho`,
    author: { '@type': 'Person', name: author.nome_pessoa },
    description: author.biografia,
  };

  return (
    <div className="container py-12 max-w-4xl">
      <Helmet>
        <title>{title}</title>
        {canonical && <link rel="canonical" href={canonical} />}
        <meta name="description" content={description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <article className="content-card">
        {/* Header com foto do autor */}
        <header className="mb-10 border-b border-border/30 pb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
            {/* Avatar do autor centralizado */}
            <div className="flex-shrink-0">
              {author.avatar?.url ? (
                <img
                  src={`http://localhost:1337${author.avatar.url}`}
                  alt={author.nome_pessoa}
                  className="author-avatar"
                />
              ) : (
                <div className="author-avatar bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">
                    {author.nome_pessoa.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Informações do autor */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {author.nome_pessoa}
              </h1>

              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-sm">
                {author.denominacao_anterior && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    Ex-{author.denominacao_anterior}
                  </span>
                )}
                {author.data_conversao && (
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border text-muted-foreground">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Conversão: {new Date(author.data_conversao).toLocaleDateString('pt-BR')}
                  </span>
                )}
              </div>

              {/* Informações adicionais */}
              <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                {author.profissao && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {author.profissao}
                  </span>
                )}
                {author.cidade_atual && (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {author.cidade_atual}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Biografia */}
        {author.biografia && (
          <section className="mb-10 pb-10 border-b border-border/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
              Biografia
            </h2>
            <div className="testimony-content" dangerouslySetInnerHTML={{ __html: author.biografia }} />
          </section>
        )}

        {/* Testemunho completo */}
        {author.testemunho_completo && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
              Testemunho de Conversão
            </h2>
            <div className="testimony-content drop-cap" dangerouslySetInnerHTML={{ __html: author.testemunho_completo }} />
          </section>
        )}

        {/* Artigos do autor - Desabilitado temporariamente até adicionar artigos ao tipo Author */}
        {/* {author.articles && author.articles.length > 0 && (
          <aside className="mt-10 pt-10 border-t border-border/30">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <div className="h-8 w-1 bg-gradient-to-b from-yellow-600 to-primary rounded-full"></div>
              Artigos do autor
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {author.articles.map((article) => (
                <Link
                  key={article.id}
                  to={`/artigos/${article.slug}`}
                  className="group p-4 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all bg-card/50"
                >
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center text-sm text-primary font-semibold">
                    <span>Ler artigo</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </aside>
        )} */}
      </article>
    </div>
  );
}
