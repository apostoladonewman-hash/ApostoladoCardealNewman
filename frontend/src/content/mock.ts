export const testimonials = [
  {
    slug: 'de-pastor-a-catolico',
    person: 'João da Silva',
    denomination_from: 'Batista',
    excerpt:
      'Minha jornada começou com dúvidas sobre a autoridade da Bíblia e a história da Igreja. Descobri que a Igreja Católica tinha as respostas que eu procurava...',
    content: 'Texto completo do depoimento de João da Silva...',
    date: '2023-01-15',
  },
  {
    slug: 'a-beleza-da-liturgia',
    person: 'Maria Oliveira',
    denomination_from: 'Presbiteriana',
    excerpt:
      'Fui atraída pela profundidade e beleza da liturgia católica. A presença real de Cristo na Eucaristia transformou minha fé.',
    content: 'Texto completo do depoimento de Maria Oliveira...',
    date: '2023-02-20',
  },
  {
    slug: 'encontrando-os-santos',
    person: 'Pedro Costa',
    denomination_from: 'Metodista',
    excerpt:
      'A comunhão dos santos foi uma revelação para mim. Ter os santos como intercessores e exemplos de vida cristã fortaleceu minha caminhada.',
    content: 'Texto completo do depoimento de Pedro Costa...',
    date: '2023-03-10',
  },
];

export const posts = [
  {
    slug: 'sola-scriptura-e-a-igreja',
    title: 'Sola Scriptura e a Tradição da Igreja',
    author: 'Carlos Andrade',
    excerpt:
      'Uma análise histórica e teológica sobre o pilar da Reforma Protestante e como a Tradição Apostólica é essencial para a correta interpretação das Escrituras.',
    content: 'Conteúdo completo do artigo sobre Sola Scriptura...',
    date: '2023-04-05',
    tags: ['teologia', 'apologética'],
  },
  {
    slug: 'o-papado-na-biblia',
    title: 'O Papado na Bíblia e na História',
    author: 'Ana Beatriz',
    excerpt:
      'Examinando as evidências bíblicas e patrísticas para a primazia de Pedro e a sucessão apostólica, fundamentos do papado.',
    content: 'Conteúdo completo do artigo sobre o Papado...',
    date: '2023-05-12',
    tags: ['história', 'bíblia'],
  },
  {
    slug: 'eucaristia-sacrificio-real',
    title: 'A Eucaristia como Sacrifício Real',
    author: 'Ricardo Mendes',
    excerpt:
      "Entendendo o sacrifício da Missa como a renovação do sacrifício de Cristo no Calvário, e não uma 're-crucificação'.",
    content: 'Conteúdo completo do artigo sobre a Eucaristia...',
    date: '2023-06-01',
    tags: ['liturgia', 'sacramentos'],
  },
];

export const findPost = (slug?: string) => posts.find((p) => p.slug === slug);
export const findTestimonial = (slug?: string) =>
  testimonials.find((t) => t.slug === slug);
