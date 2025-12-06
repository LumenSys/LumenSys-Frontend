import { Link, useLocation } from 'react-router-dom';

// Mapa de rotas para rótulos amigáveis
const labelMap: Record<string, string> = {
  'dashboard': 'Dashboard',
  'gerenciarPlanos': 'Gerenciar Planos',
  'cadastroEmpresa': 'Cadastro de Empresa',
  'listaEmpresas': 'Lista de Empresas',
  'servicos': 'Serviços',
  'contratos': 'Contratos',
  'planosFunerarios': 'Planos Funerários',
  'gerenciarContratos': 'Gerenciar Contratos',
  'criarContrato': 'Criar Contrato',
  'perfilEmpresa': 'Perfil da Empresa',
  'cadastrarCliente': 'Cadastrar Cliente',
  'login': 'Login',
};

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);
  // Se a rota for só /dashboard, não mostra nada além do Dashboard
  const isDashboard = pathnames.length === 1 && pathnames[0].toLowerCase() === 'dashboard';

  return (
    <nav className="text-sm text-textSecondary mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        <li>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        </li>
        {!isDashboard && pathnames.map((segment, idx) => {
          const routeTo = '/' + pathnames.slice(0, idx + 1).join('/');
          const isLast = idx === pathnames.length - 1;
          const key = segment.toLowerCase();
          const isId = /^[0-9a-f-]+$/i.test(segment) || /^\d+$/i.test(segment);
          const label = isId ? 'Detalhe' : (labelMap[key] ?? decodeURIComponent(segment));
          return (
            <li key={routeTo} className="flex items-center gap-2">
              <span>/</span>
              {isLast ? (
                <span className="font-semibold text-textPrimary">{label}</span>
              ) : (
                <Link to={routeTo} className="hover:underline">{label}</Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

