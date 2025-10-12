import { useQuery } from '@tanstack/react-query';
import { Mail, Phone } from 'lucide-react';
import Logo from '@/assets/logo_apostolado.svg';
import { globalService } from '@/services/global';

export default function Footer() {
  // Buscar configurações globais
  const { data: globalSettings } = useQuery({
    queryKey: ['global'],
    queryFn: () => globalService.get(),
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
  });

  // Valores com fallback
  const siteName = globalSettings?.siteName || 'Apostolado Cardeal Newman';
  const motto = globalSettings?.motto || 'Cor ad cor loquitur';
  const contactEmail = globalSettings?.contactEmail || 'apostoladonewman@gmail.com';
  const contactPhone = globalSettings?.contactPhone || '+55 63 99225-9781';
  const whatsappUrl = globalSettings?.whatsappUrl || 'https://wa.me/5563992259781';

  return (
    <footer className="relative z-10 border-t border-border/40 bg-gradient-to-b from-muted/30 to-muted/50 mt-20">
      {/* Linha decorativa superior */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container py-16">
        <div className="grid gap-12 md:grid-cols-3 text-center md:text-left mb-12">
          {/* Coluna 1: Logo e Descrição */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 justify-center md:justify-start group">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-md group-hover:blur-lg transition-all"></div>
                <img src={Logo} alt="Logo Apostolado Cardeal Newman" className="h-10 w-10 opacity-90 relative z-10" />
              </div>
              <div>
                <p className="font-bold text-lg text-foreground">{siteName}</p>
                <p className="text-xs motto-text font-medium">
                  "{motto}"
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Testemunhos e reflexões de quem encontrou a plenitude da fé católica, inspirados pela vida e obra de São João Henrique Newman.
            </p>
          </div>

          {/* Coluna 2: Navegação */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground uppercase tracking-wider">Navegação</p>
            <nav className="flex flex-col gap-2.5 text-sm">
              <a href="/" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Home
              </a>
              <a href="/sobre" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Sobre Nós
              </a>
              <a href="/newman" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Newman
              </a>
              <a href="/testemunhos" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Testemunhos
              </a>
              <a href="/artigos" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Artigos
              </a>
              <a href="/biblioteca" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Biblioteca
              </a>
              <a href="/contato" className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group">
                <span className="transition-transform group-hover:translate-x-1">→</span> Contato
              </a>
            </nav>
          </div>

          {/* Coluna 3: Contato */}
          <div className="space-y-4">
            <p className="text-sm font-bold text-foreground uppercase tracking-wider">Contato</p>
            <div className="flex flex-col gap-3 text-sm">
              <a
                href={`mailto:${contactEmail}`}
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="break-all">{contactEmail}</span>
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center md:justify-start gap-2 group"
              >
                <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                {contactPhone}
              </a>
            </div>

            {/* Redes Sociais (placeholder para futuro) */}
            <div className="pt-4">
              <p className="text-xs text-muted-foreground italic">
                Siga-nos nas redes sociais em breve!
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/40 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2">
              <span className="motto-text font-medium italic">Ad Maiorem Dei Gloriam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
