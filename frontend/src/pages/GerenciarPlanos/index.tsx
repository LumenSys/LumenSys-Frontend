import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit2, Eye, Filter, Download, Settings, Users, Calendar, DollarSign, RefreshCcw } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsCard from '../../components/StatsCard';
import AccessibilityPanel from "../../components/AccessibilityPanel";
import ApiService from "../../services/apiService";


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

export default function GerenciarPlanos() {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<'todos' | 'ativo' | 'inativo' | 'rascunho'>('todos');
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPlanos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const apiService = ApiService();
      const response = await apiService.get('api/v1/FuneralPlans');
      const payload = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      const normalized: Plano[] = (payload as any[]).reduce((acc, raw) => {
        const rawId = raw?.id ?? raw?.funeralPlansId ?? raw?.planId ?? raw?.PlanId;
        const id = Number(rawId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        const availableRaw = raw?.available ?? raw?.Available ?? raw?.status;
        const available = typeof availableRaw === 'string'
          ? availableRaw.toLowerCase() === 'ativo'
          : Boolean(availableRaw ?? true);

        const statusRaw = typeof raw?.status === 'string' ? raw.status.toLowerCase() : undefined;
        const status: Plano['status'] = statusRaw === 'rascunho'
          ? 'rascunho'
          : statusRaw === 'inativo'
            ? 'inativo'
            : available ? 'ativo' : 'inativo';

        const coverageRaw = raw?.coverage ?? raw?.Coverage ?? raw?.foraDeAr;
        const foraDeAr = typeof coverageRaw === 'string'
          ? coverageRaw.toLowerCase() === 'nacional'
          : Boolean(coverageRaw);

        const creationRaw = raw?.createdAt ?? raw?.creationDate ?? raw?.dataCriacao ?? '';
        const creationDate = (() => {
          if (!creationRaw) return '';
          const parsed = new Date(creationRaw);
          return Number.isNaN(parsed.getTime()) ? String(creationRaw) : parsed.toLocaleDateString('pt-BR');
        })();

        acc.push({
          id,
          nome: raw?.name ?? raw?.title ?? `Plano ${id}`,
          descricao: raw?.description ?? raw?.details ?? 'Sem descrição disponível.',
          valorAnual: Number(raw?.annualValue ?? raw?.AnnualValue ?? raw?.valorAnual ?? raw?.annualAmount ?? 0),
          foraDeAr,
          maxDependente: Number(raw?.maxDependents ?? raw?.MaxDependents ?? raw?.maxDependente ?? 0),
          idadeMaxima: Number(raw?.maxAge ?? raw?.MaxAge ?? raw?.idadeMaxima ?? 0),
          adicionalDependente: Number(raw?.dependentAdditional ?? raw?.DependentAdditional ?? raw?.adicionalDependente ?? 0),
          status,
          totalClientes: Number(raw?.totalClientes ?? raw?.TotalClientes ?? raw?.clientsCount ?? raw?.clientCount ?? 0),
          dataCriacao: creationDate,
        });

        return acc;
      }, [] as Plano[]);

      setPlanos(normalized);
    } catch (loadError: any) {
      console.error('Erro ao carregar planos funerários:', loadError);
      const message = loadError?.response?.data?.message || loadError.message || 'Não foi possível carregar os planos cadastrados.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlanos();
  }, [loadPlanos]);

  const planosFiltrados = useMemo(() => {
    return planos.filter((plano) => {
      const matchesBusca = plano.nome.toLowerCase().includes(busca.toLowerCase()) ||
        plano.descricao.toLowerCase().includes(busca.toLowerCase());
      const matchesStatus = filtroStatus === 'todos' || plano.status === filtroStatus;
      return matchesBusca && matchesStatus;
    });
  }, [planos, busca, filtroStatus]);

  const { totalPlanos, planosAtivos, totalClientes, receitaTotal } = useMemo(() => {
    const total = planos.length;
    const ativos = planos.filter(p => p.status === 'ativo').length;
    const clientes = planos.reduce((sum, p) => sum + (Number.isFinite(p.totalClientes) ? p.totalClientes : 0), 0);
    const receita = planos.reduce((sum, p) => sum + p.valorAnual * (Number.isFinite(p.totalClientes) ? p.totalClientes : 0), 0);
    return {
      totalPlanos: total,
      planosAtivos: ativos,
      totalClientes: clientes,
      receitaTotal: receita,
    };
  }, [planos]);

  const statsData = useMemo(() => {
    const currencyFormatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0,
    });

    return [
      {
        title: "Total de Planos",
        value: loading ? '...' : totalPlanos,
        icon: Settings,
        iconColor: "text-blue-600"
      },
      {
        title: "Planos Ativos",
        value: loading ? '...' : planosAtivos,
        icon: Calendar,
        iconColor: "text-green-600"
      },
      {
        title: "Total Clientes",
        value: loading ? '...' : totalClientes,
        icon: Users,
        iconColor: "text-purple-600"
      },
      {
        title: "Receita Anual",
        value: loading ? '...' : currencyFormatter.format(receitaTotal),
        icon: DollarSign,
        iconColor: "text-green-600"
      }
    ];
  }, [loading, totalPlanos, planosAtivos, totalClientes, receitaTotal]);

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-textSecondary">
                    Carregando planos cadastrados...
                  </td>
                </tr>
              ) : planosFiltrados.map((plano) => (
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

        {!loading && planosFiltrados.length === 0 && (
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
      {error && (
        <Card className="bg-danger/10 border-danger/20">
          <p className="text-sm text-danger">⚠️ {error}</p>
        </Card>
      )}
     <AccessibilityPanel />
    </PageLayout>
  );
}