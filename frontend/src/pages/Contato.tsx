import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Send, MessageCircle, CheckCircle } from 'lucide-react';

export default function Contato() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    // Simular envio (implementar backend posteriormente)
    setTimeout(() => {
      setSending(false);
      setSuccess(true);
      setFormData({ nome: '', email: '', assunto: '', mensagem: '' });

      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contato — Apostolado Cardeal Newman</title>
        <meta name="description" content="Entre em contato com o Apostolado Cardeal Newman. Estamos aqui para ajudá-lo." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Fale Conosco</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Entre em Contato
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Estamos aqui para responder suas dúvidas, ouvir sugestões e ajudá-lo em sua jornada de fé
              </p>
            </div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* Email Card */}
              <a href="mailto:apostoladonewman@gmail.com" className="group">
                <Card className="h-full p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-warm/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-gold-warm/30 transition-all">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                        E-mail
                      </h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        apostoladonewman@gmail.com
                      </p>
                    </div>
                  </div>
                </Card>
              </a>

              {/* WhatsApp Card */}
              <a
                href="https://wa.me/5563992259781"
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="h-full p-6 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-gold-warm/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-gold-warm/30 transition-all">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                        WhatsApp
                      </h3>
                      <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                        +55 63 99225-9781
                      </p>
                    </div>
                  </div>
                </Card>
              </a>
            </div>

            {/* Contact Form */}
            <Card className="p-8 md:p-10 border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                  Envie sua Mensagem
                </h2>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-green-800 font-medium">
                      Mensagem enviada com sucesso! Responderemos em breve.
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="nome" className="block text-sm font-semibold mb-2 text-foreground">
                      Nome completo *
                    </label>
                    <input
                      type="text"
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background"
                      placeholder="Seu nome"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold mb-2 text-foreground">
                      E-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="assunto" className="block text-sm font-semibold mb-2 text-foreground">
                    Assunto *
                  </label>
                  <input
                    type="text"
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background"
                    placeholder="Como podemos ajudar?"
                  />
                </div>

                <div>
                  <label htmlFor="mensagem" className="block text-sm font-semibold mb-2 text-foreground">
                    Mensagem *
                  </label>
                  <textarea
                    id="mensagem"
                    name="mensagem"
                    value={formData.mensagem}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all bg-background resize-none"
                    placeholder="Escreva sua mensagem aqui..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white font-semibold py-6 shadow-lg hover:shadow-xl transition-all text-base"
                >
                  {sending ? (
                    <>
                      <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </section>
      </div>
    </>
  );
}
