"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from '@/app/components/ui/Button';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  const navLinkClass = `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
  }`;

  return (
    <Link href={href} className={navLinkClass}>
      {children}
    </Link>
  );
};

export default function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
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
          <NavLink href="/">Início</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <a href="/#assine">Assine a newsletter</a>
          </Button>
        </div>
      </div>
    </header>
  );
}