import React, { useState } from "react";
import { Search, Plus, Edit2, Eye, Filter, Download, Settings, Users, Calendar, DollarSign } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsCard from '../../components/StatsCard';

interface Plano {
  id: number;
  nome: string;
  descricao: string;
  valorAnual: number;
  foraDeAr: boolean;
  maxDependente: number;
  idadeMaxima: number;
  adicionalDependente: number;
  status: 'ativo' | 'inativo' | 'rascunho';
  totalClientes: number;
  dataCriacao: string;
}

const planosExemplo: Plano[] = [
  {
    id: 1,
    nome: 'Plano Básico',
    descricao: 'Cobertura essencial para necessidades básicas',
    valorAnual: 1200.00,
    foraDeAr: false,
    maxDependente: 2,
    idadeMaxima: 65,
    adicionalDependente: 150.00,
    status: 'ativo',
    totalClientes: 124,
    dataCriacao: '15/01/2024'
  },
  {
    id: 2,
    nome: 'Plano Premium',
    descricao: 'Cobertura completa com benefícios adicionais',
    valorAnual: 2500.00,
    foraDeAr: true,
    maxDependente: 4,
    idadeMaxima: 75,
    adicionalDependente: 200.00,
    status: 'ativo',
    totalClientes: 89,
    dataCriacao: '10/02/2024'
  },
  {
    id: 3,
    nome: 'Plano Família',
    descricao: 'Ideal para famílias grandes',
    valorAnual: 3200.00,
    foraDeAr: true,
    maxDependente: 6,
    idadeMaxima: 80,
    adicionalDependente: 180.00,
    status: 'ativo',
    totalClientes: 67,
    dataCriacao: '05/03/2024'
  },
  {
    id: 4,
    nome: 'Plano Jovem',
    descricao: 'Especial para pessoas até 35 anos',
    valorAnual: 800.00,
    foraDeAr: false,
    maxDependente: 1,
    idadeMaxima: 35,
    adicionalDependente: 120.00,
    status: 'rascunho',
    totalClientes: 0,
    dataCriacao: '20/03/2024'
  }
];

export default function GerenciarPlanos() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo' | 'rascunho'>('todos');

  const planosFiltrados = planosExemplo.filter((plano) => {
    const matchesBusca = plano.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        plano.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === 'todos' || plano.status === filtroStatus;
    return matchesBusca && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      ativo: 'bg-success/20 text-success border-success/30',
      inativo: 'bg-danger/20 text-danger border-danger/30',
      rascunho: 'bg-warning/20 text-warning border-warning/30'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCoberturaBadge = (foraDeAr: boolean) => {
    return foraDeAr ? (
      <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-medium border border-primary/30">
        Nacional
      </span>
    ) : (
      <span className="px-2 py-1 bg-footer text-textSecondary rounded-full text-xs font-medium border border-footer">
        Local
      </span>
    );
  };

  // Estatísticas
  const totalPlanos = planosExemplo.length;
  const planosAtivos = planosExemplo.filter(p => p.status === 'ativo').length;
  const totalClientes = planosExemplo.reduce((sum, p) => sum + p.totalClientes, 0);
  const receitaTotal = planosExemplo.reduce((sum, p) => sum + (p.valorAnual * p.totalClientes), 0);

  const statsData = [
    {
      title: "Total de Planos",
      value: totalPlanos,
      icon: Settings,
      iconColor: "text-blue-600"
    },
    {
      title: "Planos Ativos",
      value: planosAtivos,
      icon: Calendar,
      iconColor: "text-green-600"
    },
    {
      title: "Total Clientes",
      value: totalClientes,
      icon: Users,
      iconColor: "text-purple-600"
    },
    {
      title: "Receita Anual",
      value: receitaTotal.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL', 
        maximumFractionDigits: 0 
      }),
      icon: DollarSign,
      iconColor: "text-green-600"
    }
  ];

  return (
    <PageLayout
      title="Gerenciar Planos"
      subtitle="Configure e gerencie todos os planos funerários disponíveis"
      actions={
        <div className="flex gap-3">
          <Button variant="outline" icon={Filter} size="md">
            Filtros
          </Button>
          <Button variant="outline" icon={Download} size="md">
            Exportar
          </Button>
          <Button 
            variant="primary" 
            icon={Plus} 
            size="md"
            onClick={() => window.location.href = '/planosfunerarios'}
          >
            Novo Plano
          </Button>
        </div>
      }
    >
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 h-4 w-4 text-textSecondary" />
              <input
                type="text"
                placeholder="Buscar planos..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-footer rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface"
              />
            </div>

            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as any)}
              className="px-4 py-3 border border-footer rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
              <option value="rascunho">Rascunhos</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Tabela de Planos */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-footer">
            <thead className="bg-footer">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Valor Anual
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Cobertura
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Dependentes
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Clientes
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-textSecondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-surface divide-y divide-footer">
              {planosFiltrados.map((plano) => (
                <tr key={plano.id} className="hover:bg-footer/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-textPrimary">{plano.nome}</div>
                      <div className="text-sm text-textSecondary">{plano.descricao}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(plano.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-semibold text-textPrimary">
                      {plano.valorAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-xs text-textSecondary">
                      +{plano.adicionalDependente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/dep.
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCoberturaBadge(plano.foraDeAr)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-textPrimary">
                      Máx: {plano.maxDependente}
                    </div>
                    <div className="text-xs text-textSecondary">
                      Até {plano.idadeMaxima} anos
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-textPrimary">{plano.totalClientes}</div>
                    <div className="text-xs text-textSecondary">clientes ativos</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {planosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-textSecondary">
              {busca ? `Nenhum plano encontrado para "${busca}"` : 'Nenhum plano encontrado'}
            </div>
          </div>
        )}

        {/* Rodapé com informações */}
        <div className="px-6 py-4 border-t border-footer bg-footer/30">
          <div className="flex items-center justify-between text-sm text-textSecondary">
            <span>
              Mostrando {planosFiltrados.length} de {totalPlanos} planos
            </span>
            <span>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
}