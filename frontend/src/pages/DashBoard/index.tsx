import React, { useState } from "react";
import GenericTable from '../../components/DashBoard/Table';
import { Users, CheckCircle, Ban, TrendingUp, Edit2, Search, Filter, Download, Eye } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

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

    const dashboardCards = [
        {
            title: "Total de Clientes",
            value: 247,
            change: "+12%",
            changeType: "positive",
            bgColor: "bg-gradient-to-br from-blue-500 to-blue-600",
            icon: <Users size={28} className="text-white" />
        },
        {
            title: "Contratos Ativos",
            value: 235,
            change: "+8%",
            changeType: "positive",
            bgColor: "bg-gradient-to-br from-green-500 to-green-600",
            icon: <CheckCircle size={28} className="text-white" />
        },
        {
            title: "Contratos Inativos",
            value: 12,
            change: "-3%",
            changeType: "negative",
            bgColor: "bg-gradient-to-br from-red-500 to-red-600",
            icon: <Ban size={28} className="text-white" />
        },
        {
            title: "Receita Mensal",
            value: "R$ 387.420",
            change: "+15%",
            changeType: "positive",
            bgColor: "bg-gradient-to-br from-purple-500 to-purple-600",
            icon: <TrendingUp size={28} className="text-white" />
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
            render: (value: string | number, row: ContractData) => {
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
            render: (value: string | number, row: ContractData) => (
                <div className="flex space-x-2 justify-center">
                    <button 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip"
                        title="Visualizar"
                    >
                        <Eye size={16} />
                    </button>
                    <button 
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors tooltip"
                        title="Editar"
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
            onClick: () => window.location.href = "/GerenciarPlanos",
            className: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6 pt-20">
            {/* Header Section */}
            <div className="mb-8">
                <Breadcrumb />
                <div className="mt-4">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Seja bem-vindo! 👋
                    </h1>
                    <p className="text-lg text-gray-600">
                        Gerencie seus serviços e planos funerários com facilidade
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                                <div className="flex items-center mt-2">
                                    <span className={`text-sm font-medium ${
                                        card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {card.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">vs. mês anterior</span>
                                </div>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bgColor}`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                            <Users size={18} />
                            <span>Novo Cliente</span>
                        </button>
                        <button className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                            <CheckCircle size={18} />
                            <span>Novo Contrato</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Dia</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Novos contratos:</span>
                            <span className="font-semibold text-green-600">+3</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pendências:</span>
                            <span className="font-semibold text-yellow-600">2</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Cancelamentos:</span>
                            <span className="font-semibold text-red-600">1</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Meta Mensal</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Progresso:</span>
                            <span className="font-semibold text-blue-600">78%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                        </div>
                        <p className="text-sm text-gray-500">R$ 78.000 de R$ 100.000</p>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Contratos Recentes</h2>
                            <p className="text-gray-600">Gerencie todos os contratos do sistema</p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar contratos..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                />
                            </div>
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                                <Filter size={16} />
                                <span>Filtros</span>
                            </button>
                            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center space-x-2">
                                <Download size={16} />
                                <span>Exportar</span>
                            </button>
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
                <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-700">
                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredData.length)} de {filteredData.length} contratos
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                const page = i + 1;
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm rounded-md transition-colors ${
                                            currentPage === page
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Próximo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashBoard;