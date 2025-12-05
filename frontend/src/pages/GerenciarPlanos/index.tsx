import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, Plus, Edit2, Eye, Filter, Download, Settings, Users, Calendar, DollarSign, AlertCircle, RefreshCcw } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsCard from '../../components/StatsCard';
import AccessibilityPanel from "../../components/AccessibilityPanel";
import ApiService from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

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
 
// Helpers para normalizar dados vindos do backend
function normalizePlano(raw: any): Plano {
  const id = Number(raw?.id ?? raw?.planId ?? raw?.funeralPlansId);
  const nome = String(raw?.name ?? raw?.nome ?? 'Plano sem nome');
  const descricao = String(raw?.description ?? raw?.descricao ?? '');
  const valorAnual = Number(raw?.annualValue ?? raw?.valorAnual ?? 0);
  const adicionalDependente = Number(raw?.dependentAdditional ?? raw?.adicionalDependente ?? 0);
  const foraDeAr = Boolean(raw?.outOfArea ?? raw?.foraDeAr ?? false);
  const maxDependente = Number(raw?.maxDependents ?? raw?.maxDependente ?? 0);
  const idadeMaxima = Number(raw?.maxAge ?? raw?.idadeMaxima ?? 0);
  const status: Plano['status'] = (String(raw?.status ?? 'ativo') as any);
  const dataCriacao = String(raw?.createdAt ?? raw?.dataCriacao ?? new Date().toLocaleDateString('pt-BR'));
  const totalClientes = Number(raw?.clientsCount ?? raw?.totalClientes ?? 0);

  return { id, nome, descricao, valorAnual, foraDeAr, maxDependente, idadeMaxima, adicionalDependente, status, totalClientes, dataCriacao };
}

export default function GerenciarPlanos() {
  const api = useMemo(() => ApiService(), []);
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo' | 'rascunho'>('todos');
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasFetchedRef = useRef(false);

  // Se houver um id na querystring (?id=123), ir direto para edição
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const idParam = params.get('id');
      const idNum = Number(idParam);
      if (Number.isFinite(idNum) && idNum > 0) {
        navigate(`/gerenciarPlanos/planosFunerarios/${idNum}`);
      }
    } catch {}
  }, [navigate]);

  useEffect(() => {
    const fetchPlanos = async () => {
      if (hasFetchedRef.current) return; // evita chamadas duplicadas (React 18 StrictMode)
      hasFetchedRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const resp = await api.get('api/v1/FuneralPlans');
        const payload = Array.isArray(resp.data) ? resp.data : (Array.isArray(resp.data?.data) ? resp.data.data : []);
        const list = (payload as any[]).map(normalizePlano).filter(p => Number.isFinite(p.id));
        setPlanos(list);
      } catch (err: any) {
        console.error('Erro ao buscar planos:', err);
        const msg = err?.response?.data?.message || err.message || 'Não foi possível carregar os planos.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchPlanos();
  }, [api]);

  const planosFiltrados = useMemo(() => planos.filter((plano) => {
    const matchesBusca = plano.nome.toLowerCase().includes(busca.toLowerCase()) ||
                        plano.descricao.toLowerCase().includes(busca.toLowerCase());
    const matchesStatus = filtroStatus === 'todos' || plano.status === filtroStatus;
    return matchesBusca && matchesStatus;
  }), [planos, busca, filtroStatus]);

  const planosAtivosList = useMemo(() => planos.filter(plano => plano.status === 'ativo'), [planos]);

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
  const totalPlanos = planos.length;
  const planosAtivos = planosAtivosList.length;
  const totalClientes = planosAtivosList.reduce((sum, p) => sum + p.totalClientes, 0);
  const receitaTotal = planosAtivosList.reduce((sum, p) => sum + (p.valorAnual * p.totalClientes), 0);

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

  function loadPlanos(): void {
    throw new Error("Function not implemented.");
  }

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
            onClick={() => window.location.href = '/gerenciarPlanos/planosFunerarios'}
          >
            Novo Plano
          </Button>
        </div>
      }
    >
      {error && (
        <Card>
          <div className="flex items-center gap-2 text-danger text-sm">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        </Card>
      )}
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

          <Button
            variant="outline"
            icon={RefreshCcw}
            size="md"
            onClick={loadPlanos}
            disabled={loading}
          >
            {loading ? 'Atualizando...' : 'Atualizar dados'}
          </Button>
        </div>
      </Card>

      {/* Tabela de Planos */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-borderPrimary">
            <thead className="bg-footer sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Plano
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Valor Anual
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Cobertura
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Dependentes
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-textSecondary uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody className="bg-surface">
              {loading ? (
                <tr>
                  <td className="px-6 py-6 text-center text-textSecondary" colSpan={6}>Carregando planos...</td>
                </tr>
              ) : planosFiltrados.map((plano, idx) => (
                <tr key={plano.id} className={`${idx % 2 === 0 ? 'bg-background' : 'bg-surface'} hover:bg-footer/60 transition-colors`}>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-textPrimary">{plano.nome}</div>
                      <div className="text-sm text-textSecondary">{plano.descricao}</div>
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {getStatusBadge(plano.status)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm font-semibold text-textPrimary">
                      {plano.valorAnual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </div>
                    <div className="text-xs text-textSecondary">
                      +{plano.adicionalDependente.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}/dep.
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    {getCoberturaBadge(plano.foraDeAr)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <div className="text-sm text-textPrimary">
                      Máx: {plano.maxDependente}
                    </div>
                    <div className="text-xs text-textSecondary">
                      Até {plano.idadeMaxima} anos
                    </div>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/gerenciarPlanos/planosFunerarios/${plano.id}`)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && planosFiltrados.length === 0 && (
          <div className="text-center py-12">
            <div className="text-textSecondary">
              {busca ? `Nenhum plano encontrado para "${busca}"` : 'Nenhum plano encontrado'}
            </div>
          </div>
        )}

        {/* Rodapé com informações */}
        <div className="px-6 py-4 border-t border-borderPrimary bg-footer/30">
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
      {error && (
        <Card className="bg-danger/10 border-danger/20">
          <p className="text-sm text-danger">⚠️ {error}</p>
        </Card>
      )}
     <AccessibilityPanel />
    </PageLayout>
  );
}