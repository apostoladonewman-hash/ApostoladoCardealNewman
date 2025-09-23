import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { findPost } from '@/content/mock';

export default function Artigo() {
  const { slug } = useParams();
  const post = findPost(slug);

  const title = post
    ? `${post.title} — Apostolado Cardeal Newman`
    : 'Artigo — Apostolado Cardeal Newman';
  const description = post?.excerpt ?? 'Artigo do Apostolado Cardeal Newman';
  const canonical =
    typeof window !== 'undefined' ? window.location.href : undefined;

  if (!post) {
    return (
      <div className="container py-16">
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
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    description: post.excerpt,
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
        <h1 className="text-4xl font-serif font-semibold leading-tight mb-3">
          {post.title}
        </h1>
        <p className="text-sm text-muted-foreground">
          Por {post.author} • {new Date(post.date).toLocaleDateString('pt-BR')}
        </p>
      </header>
      <section className="prose prose-neutral max-w-none dark:prose-invert">
        <p>{post.content}</p>
      </section>
      <aside className="mt-8">
        <ul className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="px-2 py-1 rounded-md border text-xs text-muted-foreground"
            >
              #{tag}
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
