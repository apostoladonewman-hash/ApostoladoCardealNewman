type DepoimentoPageProps = {
  params: {
    slug: string;
  };
};

export default function DepoimentoPage({ params }: DepoimentoPageProps) {
  return (
    <div>
      <h1 className="text-4xl font-bold text-center my-10">
        Depoimento: {params.slug}
      </h1>
      {/* O conteúdo do depoimento será carregado aqui */}
    </div>
  );
}