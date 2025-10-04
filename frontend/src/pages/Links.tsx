import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { linksService } from '@/services/links';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchBar } from '@/components/ui/search-bar';
import { Card } from '@/components/ui/card';
import { ExternalLink, Link2, FolderOpen } from 'lucide-react';

export default function Links() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: linksGrouped, isLoading, error } = useQuery({
    queryKey: ['links'],
    queryFn: () => linksService.getAllGrouped(),
  });

  // Filtrar links baseado na pesquisa
  const filteredLinksGrouped = useMemo(() => {
    if (!linksGrouped || !searchQuery.trim()) return linksGrouped;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof linksGrouped[string]> = {};

    Object.entries(linksGrouped).forEach(([category, links]) => {
      const filteredLinks = links.filter(link =>
        link.title.toLowerCase().includes(query) ||
        link.description?.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );

      if (filteredLinks.length > 0) {
        filtered[category] = filteredLinks;
      }
    });

    return filtered;
  }, [linksGrouped, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  const totalLinks = linksGrouped ? Object.values(linksGrouped).reduce((acc, links) => acc + links.length, 0) : 0;
  const totalCategories = filteredLinksGrouped ? Object.keys(filteredLinksGrouped).length : 0;

  return (
    <>
      <Helmet>
        <title>Links Úteis — Apostolado Cardeal Newman</title>
        <meta name="description" content="Recursos, sites e referências católicas para aprofundamento na fé." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Link2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Recursos Católicos</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Links Úteis
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Explore recursos, sites e referências para aprofundar seu conhecimento da fé católica
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <SearchBar
                  placeholder="Buscar por título, descrição ou categoria..."
                  onSearch={setSearchQuery}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  <span>{totalLinks} links</span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span>{totalCategories} categorias</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-6xl mx-auto">
            {!filteredLinksGrouped || Object.keys(filteredLinksGrouped).length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Link2 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'Nenhum link encontrado' : 'Nenhum link disponível'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Tente buscar com outros termos'
                    : 'Novos links serão adicionados em breve'}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(filteredLinksGrouped).map(([category, links]) => (
                  <div key={category} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                    </div>

                    {/* Links Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {links.map((link) => (
                        <a
                          key={link.documentId}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group"
                        >
                          <Card className="h-full p-5 border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-500 bg-card/50 backdrop-blur-sm">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 space-y-2">
                                <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                  {link.title}
                                </h3>
                                {link.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                    {link.description}
                                  </p>
                                )}
                              </div>
                              <ExternalLink className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                            </div>

                            {/* URL Preview */}
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <p className="text-xs text-muted-foreground truncate font-mono">
                                {new URL(link.url).hostname}
                              </p>
                            </div>
                          </Card>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
