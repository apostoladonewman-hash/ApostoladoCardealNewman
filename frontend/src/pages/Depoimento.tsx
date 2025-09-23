import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { findTestimonial } from '@/content/mock';

export default function Depoimento() {
  const { slug } = useParams();
  const depo = findTestimonial(slug);

  const title = depo
    ? `${depo.person}: testemunho — Apostolado Cardeal Newman`
    : 'Depoimento — Apostolado Cardeal Newman';
  const description =
    depo?.excerpt ?? 'Depoimento do Apostolado Cardeal Newman';
  const canonical =
    typeof window !== 'undefined' ? window.location.href : undefined;

  if (!depo) {
    return (
      <div className="container py-16">
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
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${depo.person} — Testemunho`,
    datePublished: depo.date,
    author: { '@type': 'Person', name: depo.person },
    description: depo.excerpt,
  };

  return (
    <article className="container py-12 max-w-3xl">
      <Helmet>
        <title>{title}</title>
        {canonical && <link rel="canonical" href={canonical} />}
        <meta name="description" content={description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>
      <header className="mb-8">
        <h1 className="text-4xl font-serif font-semibold leading-tight mb-2">
          {depo.person}
        </h1>
        <p className="text-sm text-muted-foreground">
          Ex-{depo.denomination_from} •{' '}
          {new Date(depo.date).toLocaleDateString('pt-BR')}
        </p>
      </header>
      <section className="prose prose-neutral max-w-none dark:prose-invert">
        <p>{depo.content}</p>
      </section>
    </article>
  );
}
