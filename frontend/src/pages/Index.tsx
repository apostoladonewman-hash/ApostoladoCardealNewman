import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
// import hero from "@/assets/hero-newman.jpg"; // Adicionaremos a imagem depois
import { posts, testimonials } from '@/content/mock';

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
        <div className="container grid md:grid-cols-2 gap-8 py-16 md:py-24 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold leading-tight">
              Apostolado Cardeal Newman
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-prose">
              Reunimos testemunhos e artigos de quem, vindo do protestantismo,
              encontrou a plenitude da fé na Igreja Católica.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg">
                <a href="#depoimentos">Ler depoimentos</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#artigos">Explorar artigos</a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div
              // src={hero} // Substituído por um placeholder
              className="w-full h-72 md:h-96 object-cover rounded-lg border shadow-sm bg-secondary"
            />
          </div>
        </div>
      </section>

      <section id="depoimentos" className="py-12 md:py-16 border-t">
        <div className="container">
          <header className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold">
                Depoimentos em destaque
              </h2>
              <p className="text-muted-foreground">
                Histórias reais de conversão à Igreja Católica
              </p>
            </div>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <Link
                key={t.slug}
                to={`/depoimentos/${t.slug}`}
                className="group"
              >
                <Card className="p-5 h-full transition-transform duration-200 group-hover:-translate-y-1">
                  <article>
                    <h3 className="text-lg font-semibold mb-1">{t.person}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      Ex-{t.denomination_from}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {t.excerpt}
                    </p>
                  </article>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="artigos" className="py-12 md:py-16 border-t">
        <div className="container">
          <header className="mb-6 md:mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-semibold">
                Artigos recentes
              </h2>
              <p className="text-muted-foreground">
                Reflexões e estudos para aprofundar a fé
              </p>
            </div>
          </header>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.slice(0, 3).map((p) => (
              <Link key={p.slug} to={`/artigos/${p.slug}`} className="group">
                <Card className="p-5 h-full transition-transform duration-200 group-hover:-translate-y-1">
                  <article>
                    <h3 className="text-lg font-semibold mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">
                      {new Date(p.date).toLocaleDateString('pt-BR')} •{' '}
                      {p.author}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {p.excerpt}
                    </p>
                  </article>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="assine" className="py-16 border-t">
        <div className="container max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold">
            Receba novidades
          </h2>
          <p className="text-muted-foreground mt-2">
            Assine para receber novos depoimentos e artigos.
          </p>
          <div className="mt-6 flex items-center gap-3 justify-center">
            <input
              aria-label="Seu email"
              type="email"
              placeholder="Seu email"
              className="h-11 px-4 rounded-md border bg-background"
            />
            <Button variant="hero" className="h-11">
              Assinar
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
