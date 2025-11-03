import React, { useState } from "react";
import GenericTable from '../../components/DashBoard/Table';
import { Users, CheckCircle, Ban, TrendingUp, Edit2, Search, Filter, Download, Eye, Notebook } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import StatsCard from '../../components/StatsCard';
import AccessibilityPanel from '../../components/AccessibilityPanel';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../routes/routes';
interface ContractData {
    name: string;
    email: string;
    status: string;
    statusColor: string;
    valor: number;
    data: string;
    plano: string;
}

const contractsData: ContractData[] = [
    { name: "Joaquim João Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024", plano: "Premium" },
    { name: "Maria Silva Santos", email: "maria.silva@email.com", status: "Ativo", statusColor: "text-green-600", valor: 1850.00, data: "15/11/2024", plano: "Standard" },
    { name: "Carlos Eduardo Lima", email: "carlos.lima@email.com", status: "Inativo", statusColor: "text-red-600", valor: 980.50, data: "10/10/2024", plano: "Basic" },
    { name: "Ana Paula Costa", email: "ana.costa@email.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "05/01/2025", plano: "Premium" },
    { name: "Roberto Ferreira", email: "roberto.f@email.com", status: "Pendente", statusColor: "text-yellow-600", valor: 1200.00, data: "18/12/2024", plano: "Standard" },
    { name: "Luciana Oliveira", email: "luciana.oli@email.com", status: "Ativo", statusColor: "text-green-600", valor: 2100.00, data: "22/11/2024", plano: "Premium" },
    { name: "Pedro Henrique Souza", email: "pedro.souza@email.com", status: "Ativo", statusColor: "text-green-600", valor: 1500.75, data: "30/10/2024", plano: "Standard" },
];

const DashBoard: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filtrar dados baseado na busca
    const filteredData = contractsData.filter(contract =>
        contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.status.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const dashboardStats = [
        {
            title: "Total de Clientes",
            value: 247,
            change: "+12%",
            changeType: "positive" as const,
            icon: Users,
            iconColor: "text-blue-600",
            description: "vs. mês anterior"
        },
        {
            title: "Contratos Ativos",
            value: 235,
            change: "+8%",
            changeType: "positive" as const,
            icon: CheckCircle,
            iconColor: "text-green-600",
            description: "vs. mês anterior"
        },
        {
            title: "Contratos Inativos",
            value: 12,
            change: "-3%",
            changeType: "negative" as const,
            icon: Ban,
            iconColor: "text-red-600",
            description: "vs. mês anterior"
        },
        {
            title: "Receita Mensal",
            value: "R$ 387.420",
            change: "+15%",
            changeType: "positive" as const,
            icon: TrendingUp,
            iconColor: "text-purple-600",
            description: "vs. mês anterior"
        }
    ];

    const tableColumns = [
        {
            key: 'name' as keyof ContractData,
            label: 'Cliente',
            className: 'font-semibold text-gray-900',
            render: (value: string | number) => (
                <div>
                    <div className="font-semibold text-gray-900">{String(value)}</div>
                </div>
            )
        },
        {
            key: 'email' as keyof ContractData,
            label: 'Email',
            className: 'text-gray-600',
            render: (value: string | number) => (
                <div className="text-blue-600 hover:text-blue-800 cursor-pointer">
                    {String(value)}
                </div>
            )
        },
        {
            key: 'plano' as keyof ContractData,
            label: 'Plano',
            className: 'text-gray-700',
            render: (value: string | number) => {
                const plano = String(value);
                const colors = {
                    'Premium': 'bg-purple-100 text-purple-800',
                    'Standard': 'bg-blue-100 text-blue-800',
                    'Basic': 'bg-gray-100 text-gray-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[plano as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`}>
                        {plano}
                    </span>
                );
            }
        },
        {
            key: 'status' as keyof ContractData,
            label: 'Status',
            className: 'font-medium',
            render: (value: string | number) => {
                const status = String(value);
                const statusStyles = {
                    'Ativo': 'bg-green-100 text-green-800',
                    'Inativo': 'bg-red-100 text-red-800',
                    'Pendente': 'bg-yellow-100 text-yellow-800'
                };
                return (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
                        {status}
                    </span>
                );
            }
        },
        {
            key: 'valor' as keyof ContractData,
            label: 'Valor Mensal',
            className: 'font-semibold text-gray-900',
            render: (value: string | number) => (
                <span className="font-semibold text-green-600">
                    R$ {Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
            )
        },
        {
            key: 'data' as keyof ContractData,
            label: 'Data Início',
            className: 'text-gray-600',
            render: (value: string | number) => (
                <span className="text-gray-600">{String(value)}</span>
            )
        },
        {
            key: 'name' as keyof ContractData,
            label: 'Ações',
            className: 'text-center',
                render: (_: any, row: ContractData) => (
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
    ];

    const tableActions = [
        {
            label: 'Gerenciar Planos',
            onClick: () => navigate(routes.MANAGE_PLANS),
            className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
    ];

    return (
        <PageLayout
            title="Seja bem-vindo! 👋"
            subtitle="Gerencie seus serviços e planos funerários com facilidade"
            actions={
                <div className="flex gap-3">
                    <Button variant="outline" icon={Filter} size="md">
                        Filtros
                    </Button>
                    <Button variant="outline" icon={Download} size="md">
                        Exportar
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
                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} contratos
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

            {/* Painel de Acessibilidade */}
            <AccessibilityPanel />
        </PageLayout>
    );
};

export default DashBoard;