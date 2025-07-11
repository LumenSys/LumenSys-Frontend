
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-textPrimary mb-4">404</h1>
        <p className="text-xl text-textSecondary mb-8">Página não encontrada</p>
        <a href="/" className="text-primary underline hover:text-secondary">Voltar para o início</a>
      </div>
    </div>
  );
} 