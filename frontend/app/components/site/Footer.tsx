export default function Footer() {
  return (
    <footer className="border-t">
      <div className="container py-10 grid gap-6 md:grid-cols-2">
        <div>
          <p className="font-serif text-lg">Apostolado Cardeal Newman</p>
          <p className="text-sm text-muted-foreground max-w-prose mt-2">
            Reunindo testemunhos e reflexões de quem encontrou a plenitude da fé
            católica.
          </p>
        </div>
        <div className="md:text-right text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Apostolado Cardeal Newman. Todos os
            direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}