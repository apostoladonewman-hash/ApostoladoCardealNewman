import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container py-16 text-center">
      <h1 className="text-4xl font-serif font-semibold mb-4">
        404 - Página Não Encontrada
      </h1>
      <p className="text-muted-foreground mb-6">
        O conteúdo que você procura não foi encontrado.
      </p>
      <Link to="/" className="text-primary underline underline-offset-4">
        Voltar à página inicial
      </Link>
    </div>
  );
}
