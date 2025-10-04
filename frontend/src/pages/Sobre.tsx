import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { aboutService } from '@/services/about';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { Card } from '@/components/ui/card';
import { Heart, Target, CheckCircle, Users } from 'lucide-react';

export default function Sobre() {
  const { data: about, isLoading, error } = useQuery({
    queryKey: ['about'],
    queryFn: () => aboutService.get(),
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  return (
    <>
      <Helmet>
        <title>Sobre Nós — Apostolado Cardeal Newman</title>
        <meta name="description" content="Conheça a missão, visão e valores do Apostolado Cardeal Newman, dedicado a compartilhar testemunhos de conversão ao catolicismo." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-24">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Nossa História</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                {about?.title || 'Sobre Nós'}
              </h1>

              {/* Quote */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"></div>
                <p className="relative text-xl md:text-2xl italic text-muted-foreground py-6">
                  "Cor ad cor loquitur"
                  <span className="block text-base not-italic mt-2 text-muted-foreground/80">
                    Coração fala ao coração
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Main Content */}
            {about?.content ? (
              <Card className="p-8 md:p-12 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-primary prose-headings:font-bold prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: about.content }}
                />
              </Card>
            ) : (
              <>
                {/* Mission Card */}
                <Card className="p-8 md:p-10 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nossa Missão</h2>
                  </div>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      O Apostolado Cardeal Newman é uma iniciativa dedicada a compartilhar
                      testemunhos e reflexões sobre a conversão ao catolicismo, inspirada
                      na vida e obra de São João Henrique Newman.
                    </p>
                    <p>
                      Nossa missão é oferecer um espaço onde conversos possam compartilhar
                      suas jornadas de fé, inspirando outros que buscam a verdade e a
                      plenitude da vida cristã na Igreja Católica.
                    </p>
                  </div>
                </Card>

                {/* Vision Card */}
                <Card className="p-8 md:p-10 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nossa Visão</h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Acreditamos que cada história de conversão é um testemunho do amor
                    de Deus e da ação do Espírito Santo. Através destes relatos,
                    esperamos iluminar o caminho para aqueles que ainda buscam.
                  </p>
                </Card>

                {/* Values Grid */}
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">Nossos Valores</h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {[
                      { icon: Heart, title: 'Fidelidade à doutrina católica', desc: 'Mantemos fidelidade aos ensinamentos da Igreja' },
                      { icon: Users, title: 'Respeito pelo caminho de cada pessoa', desc: 'Valorizamos a jornada única de cada converso' },
                      { icon: Target, title: 'Amor à verdade e à beleza', desc: 'Buscamos a verdade em todas as suas formas' },
                      { icon: CheckCircle, title: 'Caridade fraterna', desc: 'Cultivamos o amor ao próximo em tudo' }
                    ].map((value, index) => (
                      <Card
                        key={index}
                        className="p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-warm/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-gold-warm/30 transition-all">
                              <value.icon className="w-6 h-6 text-primary" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                              {value.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {value.desc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
