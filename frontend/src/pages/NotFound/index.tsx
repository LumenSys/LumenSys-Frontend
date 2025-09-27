
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <Card className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🔍</span>
          </div>
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-textPrimary mb-4">
            Página não encontrada
          </h2>
          <p className="text-textSecondary mb-8">
            Oops! A página que você procura não existe ou foi movida para outro local.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            icon={ArrowLeft}
            onClick={() => window.history.back()}
          >
            Voltar
          </Button>
          <Button
            variant="primary"
            icon={Home}
            onClick={() => window.location.href = '/'}
          >
            Ir para o início
          </Button>
        </div>
      </Card>
    </div>
  );
} 