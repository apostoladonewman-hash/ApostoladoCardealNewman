type ArtigoPageProps = {
  params: {
    slug: string;
  };
};

export default function ArtigoPage({ params }: ArtigoPageProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">
        Artigo: {params.slug}
      </h1>
      {/* O conteúdo do artigo será carregado aqui */}
    </div>
  );
}