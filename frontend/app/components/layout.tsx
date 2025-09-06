import type { Metadata } from "next";
import "./globals.css"; // Importa nossos estilos do Tailwind

export const metadata: Metadata = {
  title: "Apostolado Cardeal Newman",
  description: "Depoimentos e Artigos sobre a fé católica.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between">
            <h1 className="text-2xl font-bold">Apostolado Cardeal Newman</h1>
          </div>
        </header>
        <main className="container mx-auto py-8">{children}</main>
      </body>
    </html>
  );
}