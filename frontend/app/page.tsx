import ArticleCard from "@/app/components/blog/ArticleCard";

// URL da sua API Strapi. Altere se for diferente.
const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

interface Article {
  id: number;
  attributes: {
    title: string;
    description: string;
    slug: string;
    cover: {
      data: {
        attributes: {
          url: string;
        };
      };
    };
  };
}

async function getArticles() {
  try {
    // Estamos buscando os artigos e populando a imagem de capa (cover)
    const res = await fetch(`${STRAPI_URL}/api/articles?populate=cover`, {
      // Usamos 'no-cache' para garantir que os dados sejam sempre os mais recentes durante o desenvolvimento
      cache: 'no-cache',
    });

    if (!res.ok) {
      throw new Error('Falha ao buscar artigos');
    }

    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Erro ao buscar artigos:", error);
    return []; // Retorna um array vazio em caso de erro
  }
}

export default async function Index() {
  const articles: Article[] = await getArticles();

  return (
    <div className="container mx-auto px-4 py-8">
      <section id="artigos">
        <h2 className="text-3xl font-bold text-center mb-8 font-serif">
          Últimos Artigos
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => {
              const { title, description, slug, cover } = article.attributes;
              // Constrói a URL completa para a imagem
              const imageUrl = cover.data ? `${STRAPI_URL}${cover.data.attributes.url}` : '/placeholder.jpg';

              return (
                <ArticleCard
                  key={article.id}
                  slug={slug}
                  title={title}
                  description={description}
                  imageUrl={imageUrl}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Nenhum artigo encontrado.
          </p>
        )}
      </section>

       {/* Seções futuras podem ser adicionadas aqui */}
       <div id="depoimentos" className="h-96 flex items-center justify-center mt-16 bg-gray-100 rounded-lg">
          <h2 className="text-2xl text-muted-foreground">Seção de Depoimentos (em breve)</h2>
      </div>
      <div id="assine" className="h-96 flex items-center justify-center mt-8 bg-gray-200 rounded-lg">
        <h2 className="text-2xl text-muted-foreground">Seção de Newsletter (em breve)</h2>
      </div>
    </div>
  );
}