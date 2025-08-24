import { NavLink } from 'react-router-dom';
import { Building2, FileText, Heart, Users, BarChart3 } from 'lucide-react';

const menuItems = [
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/cadastroempresa', label: 'Empresas', icon: Building2 },
  { to: '/GerenciarPlanos', label: 'Planos', icon: FileText },
  { to: '/servicos', label: 'Serviços', icon: Heart },
  { to: '/gerenciarcontratos', label: 'Contratos', icon: Users },
];

export default function Sidebar() {
  return (
    <div className="w-64 bg-surface text-textPrimary min-h-screen pt-20 p-6 border-r border-footer">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-textPrimary flex items-center gap-2">LumenSys</h1>

      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium no-underline ` +
                (isActive
                  ? 'bg-primary text-background shadow'
                  : 'text-textPrimary hover:bg-primary/80 hover:text-textSecondary hover:bg-footer')
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}