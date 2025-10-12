import { useState, PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import Logo from '@/assets/logo_apostolado.svg';
import { useAuth } from '@/contexts/AuthContext';
import { globalService } from '@/services/global';
import Footer from '@/components/site/Footer';
import UserMenu from '@/components/site/UserMenu';

const NavLinkItem = ({ to, end = false, children, onClick }: { to: string; end?: boolean; children: React.ReactNode; onClick: () => void; }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `relative px-3 py-2 text-sm font-medium transition-all duration-300 group ${
          isActive
            ? 'text-primary font-semibold'
            : 'text-foreground/70 hover:text-foreground hover:scale-105'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span aria-current={isActive ? 'page' : undefined}>{children}</span>
          <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-bronze transform origin-left transition-transform duration-300 ${
            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
          }`}></span>
        </>
      )}
    </NavLink>
  );
};

export default function Layout({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Buscar configurações globais
  const { data: globalSettings } = useQuery({
    queryKey: ['global'],
    queryFn: () => globalService.get(),
    staleTime: 60 * 60 * 1000, // Cache por 1 hora
  });

  // Valores com fallback
  const siteName = globalSettings?.siteName || 'Apostolado Cardeal Newman';
  const motto = globalSettings?.motto || 'Cor ad cor loquitur';

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Backdrop overlay para mobile */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      <header className="top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl shadow-sm relative">
        <div className="container flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={closeMenu}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-md group-hover:blur-lg transition-all"></div>
              <img src={Logo} alt="Logo Apostolado Cardeal Newman" className="h-12 w-12 relative z-10" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-foreground leading-tight">
                {siteName}
              </span>
              <span className="text-xs motto-text font-medium">
                {motto}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Menu principal">
            <NavLinkItem to="/" end onClick={closeMenu}>Home</NavLinkItem>
            <NavLinkItem to="/sobre" onClick={closeMenu}>Sobre Nós</NavLinkItem>
            <NavLinkItem to="/newman" onClick={closeMenu}>Newman</NavLinkItem>
            <NavLinkItem to="/testemunhos" onClick={closeMenu}>Testemunhos</NavLinkItem>
            <NavLinkItem to="/artigos" onClick={closeMenu}>Artigos</NavLinkItem>
            <NavLinkItem to="/links" onClick={closeMenu}>Links</NavLinkItem>
            <NavLinkItem to="/biblioteca" onClick={closeMenu}>Biblioteca</NavLinkItem>
            <NavLinkItem to="/contato" onClick={closeMenu}>Contato</NavLinkItem>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <Button asChild variant="outline" size="sm" className="border-[hsl(var(--bronze))] text-[hsl(var(--bronze))] hover:bg-[hsl(var(--bronze))] hover:text-white">
                  <Link to="/login">Entrar</Link>
                </Button>
                <Button asChild size="sm" className="bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] hover:from-[hsl(var(--bronze))] hover:to-[hsl(var(--primary))] text-white font-semibold shadow-md hover:shadow-lg transition-all">
                  <Link to="/registro">Criar Conta</Link>
                </Button>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
              className="hover:bg-primary/10 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Menu Mobile com animação suave */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? 'max-h-[80vh] opacity-100'
              : 'max-h-0 opacity-0'
          }`}
        >
          <div className="border-t border-border/40 bg-background/95 backdrop-blur-sm">
            <nav className="container flex flex-col items-stretch py-6 space-y-1" role="navigation" aria-label="Menu mobile">
              <NavLinkItem to="/" end onClick={closeMenu}>Home</NavLinkItem>
              <NavLinkItem to="/sobre" onClick={closeMenu}>Sobre Nós</NavLinkItem>
              <NavLinkItem to="/newman" onClick={closeMenu}>Newman</NavLinkItem>
              <NavLinkItem to="/testemunhos" onClick={closeMenu}>Testemunhos</NavLinkItem>
              <NavLinkItem to="/artigos" onClick={closeMenu}>Artigos</NavLinkItem>
              <NavLinkItem to="/links" onClick={closeMenu}>Links</NavLinkItem>
              <NavLinkItem to="/biblioteca" onClick={closeMenu}>Biblioteca</NavLinkItem>
              <NavLinkItem to="/contato" onClick={closeMenu}>Contato</NavLinkItem>

              <div className="pt-4 mt-2 border-t border-border/40">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Button asChild className="w-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] text-white shadow-md hover:shadow-lg transition-all">
                      <Link to="/perfil" onClick={closeMenu}>
                        <User className="w-4 h-4 mr-2" />
                        Meu Perfil
                      </Link>
                    </Button>
                    <div className="flex items-center justify-center gap-2 py-2">
                      <UserMenu />
                      <span className="text-sm text-muted-foreground">ou use o menu</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full space-y-2">
                    <Button asChild variant="outline" className="w-full border-[hsl(var(--bronze))] text-[hsl(var(--bronze))] hover:bg-[hsl(var(--bronze))] hover:text-white transition-all">
                      <Link to="/login" onClick={closeMenu}>Entrar</Link>
                    </Button>
                    <Button asChild className="w-full bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold-warm))] text-white shadow-md hover:shadow-lg transition-all">
                      <Link to="/registro" onClick={closeMenu}>Criar Conta</Link>
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1 relative z-10" id="main-content">{children}</main>

      <Footer />
    </div>
  );
}
