import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { booksService } from '@/services/books';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { ErrorMessage } from '@/components/ui/error-message';
import { SearchBar } from '@/components/ui/search-bar';
import { Card } from '@/components/ui/card';
import { Book, Download, BookOpen, FolderOpen } from 'lucide-react';

export default function Biblioteca() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: booksGrouped, isLoading, error } = useQuery({
    queryKey: ['books'],
    queryFn: () => booksService.getAllGrouped(),
  });

  // Filtrar livros baseado na pesquisa
  const filteredBooksGrouped = useMemo(() => {
    if (!booksGrouped || !searchQuery.trim()) return booksGrouped;

    const query = searchQuery.toLowerCase();
    const filtered: Record<string, typeof booksGrouped[string]> = {};

    Object.entries(booksGrouped).forEach(([category, books]) => {
      const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.description?.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query)
      );

      if (filteredBooks.length > 0) {
        filtered[category] = filteredBooks;
      }
    });

    return filtered;
  }, [booksGrouped, searchQuery]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage error={error as Error} />;
  }

  const totalBooks = booksGrouped ? Object.values(booksGrouped).reduce((acc, books) => acc + books.length, 0) : 0;
  const totalCategories = filteredBooksGrouped ? Object.keys(filteredBooksGrouped).length : 0;

  return (
    <>
      <Helmet>
        <title>Biblioteca — Apostolado Cardeal Newman</title>
        <meta name="description" content="Biblioteca com obras católicas recomendadas para aprofundamento espiritual e intelectual." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-background via-primary/[0.02] to-background">
        {/* Header Section */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-gold-warm/5"></div>
          <div className="container relative mx-auto px-4 py-16 md:py-20">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Biblioteca Digital</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-br from-foreground via-foreground/90 to-primary bg-clip-text text-transparent">
                Biblioteca Católica
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Obras clássicas e contemporâneas para aprofundamento espiritual e intelectual na fé católica
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto pt-4">
                <SearchBar
                  placeholder="Buscar por título, autor, categoria ou tema..."
                  onSearch={setSearchQuery}
                />
              </div>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4" />
                  <span>{totalBooks} livros</span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  <span>{totalCategories} categorias</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Info Banner */}
        {totalBooks > 0 && (
          <section className="container mx-auto px-4 pt-8">
            <div className="max-w-4xl mx-auto">
              <div className="p-6 bg-gradient-to-r from-primary/10 via-gold-warm/10 to-primary/10 border border-primary/20 rounded-xl">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <Book className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium mb-1">
                      Biblioteca em Construção
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Estamos trabalhando para disponibilizar mais recursos digitais para download. Alguns livros já podem ser baixados gratuitamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Books Section */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            {!filteredBooksGrouped || Object.keys(filteredBooksGrouped).length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Book className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {searchQuery ? 'Nenhum livro encontrado' : 'Nenhum livro disponível'}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery
                    ? 'Tente buscar com outros termos'
                    : 'Novos livros serão adicionados em breve'}
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {Object.entries(filteredBooksGrouped).map(([category, books]) => (
                  <div key={category} className="space-y-6">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 bg-gradient-to-b from-primary to-gold-warm rounded-full"></div>
                      <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        {category}
                      </h2>
                      <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent"></div>
                    </div>

                    {/* Books Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {books.map((book) => {
                        const coverUrl = book.cover?.url
                          ? `http://localhost:1337${book.cover.url}`
                          : null;

                        const pdfUrl = book.pdfFile?.url
                          ? `http://localhost:1337${book.pdfFile.url}`
                          : book.externalUrl;

                        return (
                          <Card
                            key={book.documentId}
                            className="group overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-2xl transition-all duration-500 bg-card/50 backdrop-blur-sm"
                          >
                            <div className="p-6 space-y-4">
                              {/* Book Cover and Title */}
                              <div className="flex gap-4">
                                <div className="flex-shrink-0">
                                  {coverUrl ? (
                                    <img
                                      src={coverUrl}
                                      alt={book.cover?.alternativeText || book.title}
                                      className="w-20 h-28 object-cover rounded-lg shadow-md border border-border/50"
                                    />
                                  ) : (
                                    <div className="w-20 h-28 bg-gradient-to-br from-primary/20 to-gold-warm/20 rounded-lg shadow-md border border-primary/20 flex items-center justify-center">
                                      <Book className="w-10 h-10 text-primary" />
                                    </div>
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                                    {book.title}
                                  </h3>
                                  {book.author && (
                                    <p className="text-sm text-muted-foreground italic">
                                      {book.author}
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Description */}
                              {book.description && (
                                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                  {book.description}
                                </p>
                              )}

                              {/* Download Button or Status */}
                              <div className="pt-3 border-t border-border/50">
                                {book.available && pdfUrl ? (
                                  <a
                                    href={pdfUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                    Baixar PDF
                                  </a>
                                ) : (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                                    <div className="w-2 h-2 rounded-full bg-muted-foreground/40"></div>
                                    Em breve
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
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
