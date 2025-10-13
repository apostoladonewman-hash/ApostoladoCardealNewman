import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useArticle } from '@/hooks/useArticles';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';

export default function Artigo() {
  const { id: slugOrId } = useParams();

  const { data: article, isLoading, error } = useArticle(slugOrId || '');

  const title = article
    ? `${article.title} — Apostolado Cardeal Newman`
    : 'Artigo — Apostolado Cardeal Newman';
  const description =
    article?.description ?? 'Artigo do Apostolado Cardeal Newman';
  const canonical =
    typeof window !== 'undefined' ? window.location.href : undefined;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  if (!article) {
    return (
      <div className="container py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl font-serif font-semibold mb-4">
            Artigo não encontrado
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

  // Strapi 5 flat format: author é objeto direto, não data.attributes
  const authorName = article.author?.nome_pessoa || 'Autor Desconhecido';
  const publishDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('pt-BR')
    : '';

  // Extrair conteúdo dos blocks
  const content =
    article.blocks?.find((b) => b.__component === 'shared.rich-text')?.body ||
    article.description ||
    '';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    datePublished: article.publishedAt,
    author: { '@type': 'Person', name: authorName },
    description: article.description,
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
          <div className="flex items-start gap-6 mb-6">
            {/* Avatar do autor */}
            <div className="flex-shrink-0">
              {article.author?.avatar?.url ? (
                <img
                  src={`http://localhost:1337${article.author.avatar.url}`}
                  alt={authorName}
                  className="author-avatar"
                />
              ) : (
                <div className="author-avatar bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {authorName.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Título e metadados */}
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <Link
                  to={`/testemunho/${article.author?.id_testemunhos}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {authorName}
                </Link>
                {publishDate && (
                  <>
                    <span className="text-border">•</span>
                    <time dateTime={article.publishedAt}>{publishDate}</time>
                  </>
                )}
                {article.category?.name && (
                  <>
                    <span className="text-border">•</span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-medium">
                      {article.category.name}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo do artigo */}
        <section className="article-content">
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </section>

        {/* Fonte original */}
        {article.fonte_original && (
          <aside className="mt-10 pt-6 border-t border-border/30">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Fonte original:</strong>{' '}
              {article.fonte_original}
            </p>
          </aside>
        )}
      </article>
    </div>
  );
}
