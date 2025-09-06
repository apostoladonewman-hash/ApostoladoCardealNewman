export default function Index() {
  return (
    <div>
      {/* O conteúdo da sua página inicial virá aqui */}
      <h1 className="text-4xl font-bold text-center my-10">
        Bem-vindo ao Apostolado Cardeal Newman
      </h1>
      <div id="depoimentos" className="h-96 bg-gray-100 flex items-center justify-center">
          <h2 className="text-2xl">Seção de Depoimentos</h2>
      </div>
      <div id="artigos" className="h-96 bg-gray-200 flex items-center justify-center">
        <h2 className="text-2xl">Seção de Artigos</h2>
      </div>
      <div id="assine" className="h-96 bg-gray-300 flex items-center justify-center">
        <h2 className="text-2xl">Seção de Newsletter</h2>
      </div>
    </div>
  );
}