import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { newmanService, NewmanCategory } from '@/services/newman';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Card } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs';
import cardealNewmanImg from '@/assets/cardeal_newman.png';
import {
  BookOpen,
  Quote,
  Award,
  Calendar,
  Book,
  Users,
  Library,
  Heart,
} from 'lucide-react';

export default function Newman() {
  const {
    data: newman,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['newman'],
    queryFn: () => newmanService.get(),
  });

  const photoUrl = newman?.photo?.url
    ? `${import.meta.env.VITE_MEDIA_URL}${newman.photo.url}`
    : cardealNewmanImg;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  return (
    <>
      <Helmet>
        <title>São João Henrique Newman — Apostolado Cardeal Newman</title>
        <meta
          name="description"
          content="Conheça a vida, obra e legado de São João Henrique Newman, patrono e inspiração do nosso apostolado."
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
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Santo Padroeiro
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                {newman?.title || 'São João Henrique Newman'}
              </h1>

              {/* Dates */}
              {(newman?.birthDate || newman?.deathDate) && (
                <div className="flex items-center justify-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-lg">
                    {newman?.birthDate?.split(' ').pop()} -{' '}
                    {newman?.deathDate?.split(' ').pop()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto space-y-12">
            {/* Biography Section with Image */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Image Card */}
              <div className="md:col-span-1">
                <Card className="p-4 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden sticky top-24">
                  <div className="relative group">
                    <img
                      src={photoUrl}
                      alt={newman?.photo?.alternativeText || 'Cardeal Newman'}
                      className="w-full rounded-lg shadow-md border-2 border-primary/20 group-hover:border-primary/40 transition-all"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-4 italic leading-relaxed">
                    {newman?.fullName || 'São João Henrique Newman'}
                  </p>
                </Card>
              </div>

              {/* Biography Content */}
              <div className="md:col-span-2">
                <Card className="p-8 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      Biografia
                    </h2>
                  </div>
                  {newman?.biography ? (
                    <div
                      className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: newman.biography }}
                    />
                  ) : (
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      São João Henrique Newman foi um teólogo, poeta e cardeal
                      católico inglês, canonizado em 2019. Sua jornada de
                      conversão do anglicanismo ao catolicismo inspirou muitos
                      ao longo dos séculos.
                    </p>
                  )}
                </Card>
              </div>
            </div>

            {/* Legacy Card */}
            {newman?.legacy && (
              <Card className="p-8 md:p-10 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Legado e Canonização
                  </h2>
                </div>
                <div
                  className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: newman.legacy }}
                />
              </Card>
            )}

            {/* Works Section */}
            {newman?.works && newman.works.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Principais Obras
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {newman.works.map((work, index) => (
                    <Card
                      key={index}
                      className="p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-warm/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-gold-warm/30 transition-all">
                            <BookOpen className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                            {work.title}
                          </h3>
                          {work.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {work.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Quotes Section */}
            {newman?.quotes && newman.quotes.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Citações Memoráveis
                  </h2>
                </div>

                <div className="space-y-6">
                  {newman.quotes.map((quote, index) => (
                    <Card
                      key={index}
                      className="p-8 border-l-4 border-l-primary border-t border-r border-b border-border/50 bg-gradient-to-r from-primary/5 to-card/50 backdrop-blur-sm shadow-lg"
                    >
                      <div className="flex gap-4">
                        <Quote className="w-8 h-8 text-primary flex-shrink-0 opacity-50" />
                        <div className="flex-1">
                          <p className="text-lg md:text-xl italic text-foreground leading-relaxed mb-4">
                            &quot;{quote.text}&quot;
                          </p>
                          <footer className="text-sm text-muted-foreground font-medium">
                            — {quote.author}
                          </footer>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Categories Section */}
            {newman?.categories && newman.categories.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    Explore Mais Sobre Newman
                  </h2>
                </div>

                <Card className="p-6 md:p-8 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <Tabs
                    tabs={newman.categories.map((category: NewmanCategory) => ({
                      slug: category.slug,
                      title: category.title,
                      description: category.description,
                      order: category.order,
                      content: (
                        <div>
                          {category.content ? (
                            <div
                              className="prose prose-lg max-w-none prose-p:text-muted-foreground prose-p:leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: category.content,
                              }}
                            />
                          ) : (
                            <div className="text-center py-12">
                              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                                {getCategoryIcon(category.slug)}
                              </div>
                              <h3 className="text-xl font-semibold mb-2 text-foreground">
                                Conteúdo em breve
                              </h3>
                              <p className="text-muted-foreground max-w-md mx-auto">
                                Estamos trabalhando para disponibilizar conteúdo
                                sobre {category.title.toLowerCase()}. Volte em
                                breve!
                              </p>
                            </div>
                          )}
                        </div>
                      ),
                    }))}
                  />
                </Card>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}

// Helper function para ícones por categoria
function getCategoryIcon(slug: string) {
  const icons: Record<string, JSX.Element> = {
    'vida-de-newman': <Heart className="w-8 h-8 text-primary" />,
    'painel-sao-newman': <Award className="w-8 h-8 text-primary" />,
    'newman-pastores-igreja': <Users className="w-8 h-8 text-primary" />,
    'pensamento-newman': <Book className="w-8 h-8 text-primary" />,
    'livros-newman-portugues': <Library className="w-8 h-8 text-primary" />,
    'newman-movimento-oxford': <BookOpen className="w-8 h-8 text-primary" />,
  };

  return icons[slug] || <Book className="w-8 h-8 text-primary" />;
}
