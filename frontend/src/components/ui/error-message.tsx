interface ErrorMessageProps {
  error?: Error | null;
  message?: string;
}

export const ErrorMessage = ({ error, message }: ErrorMessageProps) => {
  const displayMessage =
    message || error?.message || 'Ocorreu um erro ao carregar os dados.';

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md px-4">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-serif font-bold mb-2 text-foreground">
          Erro ao Carregar
        </h2>
        <p className="text-muted-foreground mb-6">{displayMessage}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
