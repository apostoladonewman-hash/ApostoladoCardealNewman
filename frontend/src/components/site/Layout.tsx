import { Link, NavLink } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
  }`;

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-serif font-semibold tracking-tight">
              Apostolado Cardeal Newman
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-2">
            <a
              href="/#depoimentos"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Depoimentos
            </a>
            <a
              href="/#artigos"
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Artigos
            </a>
            <NavLink to="/" className={navLinkClass}>
              Início
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="hero" size="sm">
              <a href="#assine">Assine a newsletter</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t">
        <div className="container py-10 grid gap-6 md:grid-cols-2">
          <div>
            <p className="font-serif text-lg">Apostolado Cardeal Newman</p>
            <p className="text-sm text-muted-foreground max-w-prose mt-2">
              Reunindo testemunhos e reflexões de quem encontrou a plenitude da
              fé católica.
            </p>
          </div>
          <div className="md:text-right text-sm text-muted-foreground">
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
