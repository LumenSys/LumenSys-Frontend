import React, { useState } from "react";
import { Search, Plus, Edit2, Eye, Filter, Download, Settings, Users, Calendar, DollarSign } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

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
      ativo: 'bg-green-100 text-green-800 border-green-200',
      inativo: 'bg-red-100 text-red-800 border-red-200',
      rascunho: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getCoberturaBadge = (foraDeAr: boolean) => {
    return foraDeAr ? (
      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium border border-blue-200">
        Nacional
      </span>
    ) : (
      <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium border border-gray-200">
        Local
      </span>
    );
  };

  // Estatísticas
  const totalPlanos = planosExemplo.length;
  const planosAtivos = planosExemplo.filter(p => p.status === 'ativo').length;
  const totalClientes = planosExemplo.reduce((sum, p) => sum + p.totalClientes, 0);
  const receitaTotal = planosExemplo.reduce((sum, p) => sum + (p.valorAnual * p.totalClientes), 0);

  return (
    <div className="min-h-screen bg-gray-50 p-6 pt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb />
          <div className="mt-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Gerenciar Planos
            </h1>
            <p className="text-lg text-gray-600">
              Configure e gerencie todos os planos funerários disponíveis
            </p>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total de Planos</p>
                <p className="text-3xl font-bold text-gray-900">{totalPlanos}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500">
                <Settings className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Planos Ativos</p>
                <p className="text-3xl font-bold text-gray-900">{planosAtivos}</p>
              </div>
              <div className="p-3 rounded-xl bg-green-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900">{totalClientes}</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Receita Anual</p>
                <p className="text-3xl font-bold text-gray-900">
                  {receitaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-green-600">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filtros e Ações */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Busca */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar planos..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Filtro Status */}
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="todos">Todos os Status</option>
                <option value="ativo">Ativos</option>
                <option value="inativo">Inativos</option>
                <option value="rascunho">Rascunhos</option>
              </select>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="w-4 h-4" />
                Filtros
              </button>
              <button className="flex items-center gap-2 px-4 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Exportar
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Plus className="w-4 h-4" />
                Novo Plano
              </button>
            </div>
          </div>
        </div>

        {/* Tabela de Planos */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Plano
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valor Anual
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cobertura
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dependentes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Clientes
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {planosFiltrados.map((plano) => (
                  <tr key={plano.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{plano.nome}</div>
                        <div className="text-sm text-gray-500">{plano.descricao}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(plano.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {plano.valorAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                      </div>
                      <div className="text-xs text-gray-500">
                        +{plano.adicionalDependente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/dep.
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getCoberturaBadge(plano.foraDeAr)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        Máx: {plano.maxDependente}
                      </div>
                      <div className="text-xs text-gray-500">
                        Até {plano.idadeMaxima} anos
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{plano.totalClientes}</div>
                      <div className="text-xs text-gray-500">clientes ativos</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Visualizar">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors" title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {planosFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                {busca ? `Nenhum plano encontrado para "${busca}"` : 'Nenhum plano encontrado'}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com informações */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Mostrando {planosFiltrados.length} de {totalPlanos} planos
            </span>
            <span>
              Última atualização: {new Date().toLocaleDateString('pt-BR')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}