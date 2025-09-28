import { useState, PropsWithChildren } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import Logo from '@/assets/logo_apostolado.svg';

const NavLinkItem = ({ to, end = false, children, onClick }: { to: string; end?: boolean; children: React.ReactNode; onClick: () => void; }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>

        `px-3 py-2 text-sm font-medium transition-colors ${
          isActive
            ? 'text-primary font-semibold' // 
            : 'text-foreground/70 hover:text-foreground' 
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default function Layout({ children }: PropsWithChildren) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <img src={Logo} alt="Logo Apostolado Cardeal Newman" className="h-8 w-8" />
            <span className="text-xl font-serif font-semibold tracking-tight">
              Apostolado Cardeal Newman
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinkItem to="/#depoimentos" onClick={closeMenu}>Depoimentos</NavLinkItem>
            <NavLinkItem to="/#artigos" onClick={closeMenu}>Artigos</NavLinkItem>
            <NavLinkItem to="/" end onClick={closeMenu}>Início</NavLinkItem>
          </nav>

          <div className="hidden md:flex items-center">
            <Button asChild size="sm">
              <a href="#assine">Assine a newsletter</a>
            </Button>
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Abrir menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden">
            <nav className="container flex flex-col items-start gap-2 py-4">
              <NavLinkItem to="/#depoimentos" onClick={closeMenu}>Depoimentos</NavLinkItem>
              <NavLinkItem to="/#artigos" onClick={closeMenu}>Artigos</NavLinkItem>
              <NavLinkItem to="/" end onClick={closeMenu}>Início</NavLinkItem>
              <Button asChild className="w-full mt-2">
                <a href="#assine" onClick={closeMenu}>Assine a newsletter</a>
              </Button>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="container py-10 grid gap-8 md:grid-cols-2 text-center md:text-left">
          <div>
            <p className="font-serif text-lg">Apostolado Cardeal Newman</p>
            <p className="text-sm text-muted-foreground max-w-prose mt-2 mx-auto md:mx-0">
              Reunindo testemunhos e reflexões de quem encontrou a plenitude da
              fé católica.
            </p>
          </div>
          <div className="md:text-right text-sm text-muted-foreground self-end">
            <p>
              © {new Date().getFullYear()} Apostolado Cardeal Newman. Todos os
              direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
