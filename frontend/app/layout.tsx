import { PropsWithChildren } from "react";
import { Inter, Playfair_Display } from "next/font/google";
import Header from '@/app/components/site/Header';
import Footer from '@/app/components/site/Footer';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata = {
  title: "Apostolado Cardeal Newman — Depoimentos e Artigos",
  description: "Depoimentos de ex-protestantes e artigos sobre a fé católica.",
  author: "Apostolado Cardeal Newman",
  openGraph: {
    title: "Apostolado Cardeal Newman — Depoimentos e Artigos",
    description: "Depoimentos de ex-protestantes e artigos sobre a fé católica.",
    type: "website",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
  twitter: {
    card: "summary_large_image",
    site: "@lovable_dev",
    images: ["https://lovable.dev/opengraph-image-p98pqg.png"],
  },
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}