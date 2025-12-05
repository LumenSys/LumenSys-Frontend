import { useCallback, useEffect, useMemo, useState, type FC, type ReactNode } from "react";
import GenericTable from '../../components/DashBoard/Table';
import { Users, CheckCircle, Ban, TrendingUp, Edit2, Search, Filter, Download, Eye, Notebook, RefreshCcw } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsCard from '../../components/StatsCard';
import AccessibilityPanel from '../../components/AccessibilityPanel';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes/routes';
import ApiService from '../../services/apiService';
type ContractStatus = 'ativo' | 'inativo' | 'pendente' | 'cancelado' | string;

interface NormalizedContract {
    id: number;
    clientId: number;
    clientName: string;
    clientEmail: string;
    planId: number;
    planName: string;
    status: ContractStatus;
    monthlyAmount: number;
    annualAmount: number;
    createdAtLabel: string;
    createdAtValue: number;
}

interface ContractTableRow {
    id: number;
    name: string;
    email: string;
    status: ContractStatus;
    valor: number;
    data: string;
    plano: string;
}

type ContractTableColumn = {
    key: keyof ContractTableRow;
    label: string;
    className?: string;
    render?: (value: ContractTableRow[keyof ContractTableRow], row: ContractTableRow) => ReactNode;
};

const DashBoard: FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const [contracts, setContracts] = useState<NormalizedContract[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadContracts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const api = ApiService();
            const [contractsResult, clientsResult, plansResult] = await Promise.allSettled([
                api.get("api/v1/Contracts"),
                api.get("api/v1/Client"),
                api.get("api/v1/FuneralPlans"),
            ]);

            if (contractsResult.status !== "fulfilled") {
                throw contractsResult.reason ?? new Error("Falha ao carregar contratos.");
            }

            const extractPayload = (response: any) => {
                if (!response) return [];
                if (Array.isArray(response.data)) return response.data;
                if (Array.isArray(response.data?.data)) return response.data.data;
                return [];
            };

            const contractsPayload = extractPayload(contractsResult.value);
            const clientsPayload = clientsResult.status === "fulfilled" ? extractPayload(clientsResult.value) : [];
            const plansPayload = plansResult.status === "fulfilled" ? extractPayload(plansResult.value) : [];

            const clientMap = new Map<number, { name: string; email: string }>();
            (clientsPayload as any[]).forEach((raw) => {
                const id = Number(raw?.id ?? raw?.clientId ?? raw?.clienteId ?? raw?.ClientId);
                if (!Number.isFinite(id)) {
                    return;
                }

                clientMap.set(id, {
                    name: raw?.name ?? raw?.fullName ?? raw?.nome ?? `Cliente ${id}`,
                    email: raw?.email ?? raw?.Email ?? raw?.mail ?? "",
                });
            });

            const planMap = new Map<number, { name: string; monthlyAmount: number; annualAmount: number }>();
            (plansPayload as any[]).forEach((raw) => {
                const id = Number(raw?.id ?? raw?.planId ?? raw?.PlanId ?? raw?.funeralPlansId);
                if (!Number.isFinite(id)) {
                    return;
                }

                const monthly = Number(raw?.monthlyAmount ?? raw?.monthlyValue ?? raw?.valorMensal ?? raw?.monthly ?? 0);
                const annual = Number(raw?.annualAmount ?? raw?.annualValue ?? raw?.valorAnual ?? raw?.annual ?? (monthly * 12));

                planMap.set(id, {
                    name: raw?.name ?? raw?.title ?? raw?.nome ?? `Plano ${id}`,
                    monthlyAmount: Number.isFinite(monthly) ? monthly : 0,
                    annualAmount: Number.isFinite(annual) ? annual : 0,
                });
            });

            const normalizedContracts = (contractsPayload as any[]).reduce<NormalizedContract[]>((acc, raw) => {
                const id = Number(raw?.id ?? raw?.contractId ?? raw?.contratoId ?? raw?.ContractsId);
                if (!Number.isFinite(id)) {
                    return acc;
                }

                const clientId = Number(raw?.clientId ?? raw?.clienteId ?? raw?.customerId ?? raw?.client?.id);
                const planId = Number(raw?.planoFunerarioId ?? raw?.funeralPlansId ?? raw?.planId ?? raw?.PlanoId);
                const client = Number.isFinite(clientId) ? clientMap.get(clientId) : undefined;
                const plan = Number.isFinite(planId) ? planMap.get(planId) : undefined;

                const statusRaw = (raw?.status ?? raw?.Status ?? "ativo").toString().toLowerCase();
                const status: ContractStatus =
                    statusRaw.includes("inativ") ? "inativo" :
                    statusRaw.includes("cancel") ? "cancelado" :
                    statusRaw.includes("pend") ? "pendente" :
                    "ativo";

                const monthlyValue = Number(raw?.monthlyAmount ?? raw?.monthlyValue ?? raw?.valorMensal ?? raw?.valor ?? plan?.monthlyAmount ?? 0);
                const annualValue = Number(raw?.annualAmount ?? raw?.annualValue ?? raw?.valorAnual ?? plan?.annualAmount ?? monthlyValue * 12);

                const createdAtRaw = raw?.createdAt ?? raw?.data ?? raw?.createdOn ?? raw?.createdDate ?? raw?.dataCriacao ?? raw?.date;
                const createdDate = createdAtRaw ? new Date(createdAtRaw) : null;
                const createdAtLabel = createdDate && !Number.isNaN(createdDate.getTime())
                    ? createdDate.toLocaleDateString("pt-BR")
                    : typeof createdAtRaw === "string"
                        ? createdAtRaw
                        : "";
                const createdAtValue = createdDate && !Number.isNaN(createdDate.getTime()) ? createdDate.getTime() : 0;

                acc.push({
                    id,
                    clientId: Number.isFinite(clientId) ? clientId : 0,
                    clientName: client?.name ?? raw?.clientName ?? raw?.cliente ?? `Cliente ${id}`,
                    clientEmail: client?.email ?? raw?.clientEmail ?? raw?.email ?? "",
                    planId: Number.isFinite(planId) ? planId : 0,
                    planName: plan?.name ?? raw?.planName ?? raw?.plano ?? "Plano não informado",
                    status,
                    monthlyAmount: Number.isFinite(monthlyValue) ? monthlyValue : 0,
                    annualAmount: Number.isFinite(annualValue) ? annualValue : 0,
                    createdAtLabel,
                    createdAtValue,
                });

                return acc;
            }, []).sort((a, b) => b.createdAtValue - a.createdAtValue);

            setContracts(normalizedContracts);
        } catch (err: any) {
            console.error("Erro ao carregar contratos:", err);
            const message = err?.response?.data?.message || err?.message || "Não foi possível carregar os contratos do sistema.";
            setError(message);
            setContracts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContracts();
    }, [loadContracts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const tableRows = useMemo<ContractTableRow[]>(() => {
        return contracts.map((contract) => {
            const monthlyValue = contract.monthlyAmount > 0
                ? contract.monthlyAmount
                : contract.annualAmount > 0
                    ? contract.annualAmount / 12
                    : 0;

            return {
                id: contract.id,
                name: contract.clientName,
                email: contract.clientEmail || "—",
                status: contract.status,
                valor: monthlyValue,
                data: contract.createdAtLabel || "—",
                plano: contract.planName,
            };
        });
    }, [contracts]);

    const filteredRows = useMemo(() => {
        const term = searchTerm.trim().toLowerCase();
        if (!term) {
            return tableRows;
        }

        return tableRows.filter((row) => {
            const searchValues = [
                row.name,
                row.email,
                row.status,
                row.plano,
                row.data,
                row.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
            ];

            return searchValues.some((value) => value?.toLowerCase().includes(term));
        });
    }, [tableRows, searchTerm]);

    useEffect(() => {
        const totalRecords = filteredRows.length;
        const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [filteredRows, currentPage, itemsPerPage]);

    const totalRecords = filteredRows.length;
    const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));
    const currentPageClamped = Math.min(currentPage, totalPages);
    const startIndex = (currentPageClamped - 1) * itemsPerPage;
    const paginatedData = filteredRows.slice(startIndex, startIndex + itemsPerPage);
    const fromCount = totalRecords === 0 ? 0 : startIndex + 1;
    const toCount = totalRecords === 0 ? 0 : Math.min(startIndex + itemsPerPage, totalRecords);

    const statsLoading = loading && contracts.length === 0;

    const dashboardStats = useMemo(() => {
        const uniqueClients = new Set<number>();
        let activeContracts = 0;
        let inactiveContracts = 0;
        let monthlyRevenue = 0;

        contracts.forEach((contract) => {
            if (contract.clientId) {
                uniqueClients.add(contract.clientId);
            }

            if (contract.status === 'ativo') {
                activeContracts += 1;
            } else if (contract.status === 'inativo' || contract.status === 'cancelado') {
                inactiveContracts += 1;
            }

            const monthly = contract.monthlyAmount > 0
                ? contract.monthlyAmount
                : contract.annualAmount > 0
                    ? contract.annualAmount / 12
                    : 0;

            if (Number.isFinite(monthly)) {
                monthlyRevenue += monthly;
            }
        });

        const currencyFormatter = new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 2,
        });

        return [
            {
                title: "Total de Clientes",
                value: statsLoading ? '...' : uniqueClients.size,
                icon: Users,
                iconColor: "text-blue-600",
                description: "Clientes com contratos cadastrados"
            },
            {
                title: "Contratos Ativos",
                value: statsLoading ? '...' : activeContracts,
                icon: CheckCircle,
                iconColor: "text-green-600",
                description: "Total com status ativo"
            },
            {
                title: "Contratos Inativos",
                value: statsLoading ? '...' : inactiveContracts,
                icon: Ban,
                iconColor: "text-red-600",
                description: "Inclui cancelados"
            },
            {
                title: "Receita Mensal",
                value: statsLoading ? '...' : currencyFormatter.format(monthlyRevenue),
                icon: TrendingUp,
                iconColor: "text-purple-600",
                description: "Soma estimada das mensalidades"
            }
        ];
    }, [contracts, statsLoading]);

    const tableColumns: ContractTableColumn[] = useMemo(() => [
        {
            key: 'name' as keyof ContractTableRow,
            label: 'Cliente',
            className: 'font-semibold text-gray-900',
            render: (value) => (
                <div>
                    <div className="font-semibold text-gray-900">{String(value)}</div>
                </div>
            )
        },
        {
            key: 'email' as keyof ContractTableRow,
            label: 'Email',
            className: 'text-gray-600',
            render: (value) => (
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    {value || '—'}
                </div>
            )
        },
        {
            key: 'plano' as keyof ContractTableRow,
            label: 'Plano',
            className: 'text-gray-700',
            render: (value) => {
                const plano = String(value ?? '');
                const colors: Record<string, string> = {
                    premium: 'bg-purple-100 text-purple-800',
                    standard: 'bg-blue-100 text-blue-800',
                    basic: 'bg-gray-100 text-gray-800'
                };
                const style = colors[plano.toLowerCase()] ?? 'bg-gray-100 text-gray-800';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                        {plano || 'Não informado'}
                    </span>
                );
            }
        },
        {
            key: 'status' as keyof ContractTableRow,
            label: 'Status',
            className: 'font-medium',
            render: (value) => {
                const status = String(value ?? '');
                const statusStyles: Record<string, string> = {
                    ativo: 'bg-green-100 text-green-800',
                    inativo: 'bg-red-100 text-red-800',
                    pendente: 'bg-yellow-100 text-yellow-800',
                    cancelado: 'bg-red-200 text-red-900'
                };
                const style = statusStyles[status.toLowerCase()] ?? 'bg-gray-100 text-gray-800';
                const label = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Não informado';
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
                        {label}
                    </span>
                );
            }
        },
        {
            key: 'valor' as keyof ContractTableRow,
            label: 'Valor Mensal',
            className: 'font-semibold text-gray-900',
            render: (value) => (
                <span className="font-semibold text-green-600">
                    R$ {Number(value ?? 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            key: 'data' as keyof ContractTableRow,
            label: 'Data Início',
            className: 'text-gray-600',
            render: (value) => (
                <span className="text-gray-600">{value || '—'}</span>
            )
        },
        {
            key: 'name' as keyof ContractTableRow,
            label: 'Ações',
            className: 'text-center',
            render: (_value, row) => (
                <div className="flex space-x-2 justify-center">
                    <button
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                        title="Visualizar"
                        onClick={() => navigate(`${routes.CONTRATOS}?email=${encodeURIComponent(row.email)}`)}
                    >
                        <Eye size={16} />
                    </button>
                    <button
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors tooltip"
                        title="Editar"
                        onClick={() => navigate(`${routes.GERENCIAR_CONTRATOS}?email=${encodeURIComponent(row.email)}`)}
                    >
                        <Edit2 size={16} />
                    </button>
                </div>
            )
        }
    ], [navigate]);

    const tableActions = useMemo(() => ([
        {
            label: 'Gerenciar Planos',
            onClick: () => navigate(routes.MANAGE_PLANS),
            className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
    ]), [navigate]);

    return (
        <PageLayout
            title="Seja bem-vindo!"
            subtitle="Gerencie seus serviços e planos funerários com facilidade"
            actions={
                <div className="flex gap-3">
                    <Button variant="outline" icon={Filter} size="md">
                        Filtros
                    </Button>
                    <Button variant="outline" icon={Download} size="md">
                        Exportar
                    </Button>
                    <Button
                        variant="outline"
                        icon={RefreshCcw}
                        size="md"
                        onClick={loadContracts}
                        disabled={loading}
                    >
                        {loading ? "Atualizando..." : "Atualizar"}
                    </Button>
                </div>
            }
        >
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {error && (
                <Card className="border border-danger/30 bg-danger/10">
                    <p className="text-sm text-danger">⚠️ {error}</p>
                </Card>
            )}

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <h3 className="text-lg font-semibold text-textPrimary mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <Button variant="primary" size="md" className="w-full" icon={Notebook} onClick={() => navigate(routes.SERVICOS)}>
                            Novo Serviço
                        </Button>
                        <Button variant="secondary" size="md" className="w-full" icon={CheckCircle} onClick={() => navigate(routes.CRIAR_CONTRATO)}>
                            Novo Contrato
                        </Button>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-textPrimary mb-4">Resumo do Dia</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-textSecondary">Novos contratos:</span>
                            <span className="font-semibold text-success">+3</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-textSecondary">Pendências:</span>
                            <span className="font-semibold text-warning">2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-textSecondary">Cancelamentos:</span>
                            <span className="font-semibold text-danger">1</span>
                        </div>
                    </div>
                </Card>

                <Card>
                    <h3 className="text-lg font-semibold text-textPrimary mb-4">Meta Mensal</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-textSecondary">Progresso:</span>
                            <span className="font-semibold text-primary">78%</span>
                        </div>
                        <div className="w-full bg-footer rounded-full h-2">
                            <div className="bg-primary h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <p className="text-sm text-textSecondary">R$ 78.000 de R$ 100.000</p>
                    </div>
                </Card>
            </div>

            {/* Table Section */}
            <Card padding="none">
                <div className="p-6 border-b border-footer">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-xl font-semibold text-textPrimary">Contratos Recentes</h2>
                            <p className="text-textSecondary">Gerencie todos os contratos do sistema</p>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-textSecondary" />
                                <input
                                    type="text"
                                    placeholder="Buscar contratos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-footer rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-surface"
                                />
                            </div>
                            <Button variant="outline" icon={Eye} size="md" onClick={() => navigate(routes.CONTRATOS)}>
                                Ver Detalhes
                            </Button>
                        </div>
                    </div>
                </div>

                {loading && (
                    <div className="px-6 py-3 text-sm text-textSecondary">
                        Carregando dados dos contratos...
                    </div>
                )}

                <GenericTable
                    title=""
                    columns={tableColumns}
                    data={paginatedData}
                    actions={tableActions}
                />

                {/* Custom Pagination */}
                <div className="px-6 py-4 border-t border-footer">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-textSecondary">
                            Mostrando {fromCount} a {toCount} de {totalRecords} contratos
                        </p>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                Anterior
                            </Button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors ${currentPage === page
                                            ? 'bg-primary text-white'
                                            : 'text-textSecondary hover:bg-footer'
                                            }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                Próximo
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
            <AccessibilityPanel />
        </PageLayout>
    );
};

export default DashBoard;