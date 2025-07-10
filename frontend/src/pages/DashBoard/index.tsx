import React from "react";
import { StatCard } from '../../components/DashBoard/Cards';
import GenericTable from '../../components/DashBoard/Table';
import Pagination from '../../components/DashBoard/Pagination';
import { Users, CheckCircle, Ban, Plus, Edit2 } from 'lucide-react';
import Breadcrumb from '../../components/Breadcrumb';

interface ContractData {
    name: string;
    email: string;
    status: string;
    statusColor: string;
    valor: number;
    data: string;
}

const contractsData: ContractData[] = [
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Inativo", statusColor: "text-red-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
    { name: "Joaquim Joao Estrela", email: "JoEsTrela@gmail.com", status: "Ativo", statusColor: "text-green-600", valor: 2302.90, data: "20/12/2024" },
];

const DashBoard: React.FC = () => {
    const dashboardCards = [
        {
            title: "Total de clientes",
            value: 200,
            bgColor: "bg-primary",
            icon: <Users size={28} />
        },
        {
            title: "Contratos ativos",
            value: 212,
            bgColor: "bg-success",
            icon: <CheckCircle size={28} />
        },
        {
            title: "Contratos inativos",
            value: 12,
            bgColor: "bg-danger",
            icon: <Ban size={28} />
        },
        {
            title: "Lucro",
            value: "R$ 60,00",
            bgColor: "bg-warning",
            icon: <Plus size={28} />
        }
    ];

    const tableColumns = [
        { key: 'name' as keyof ContractData, label: 'Cliente', className: 'font-semibold text-textPrimary' },
        { key: 'email' as keyof ContractData, label: 'Email', className: 'underline text-textPrimary' },
        {
            key: 'status' as keyof ContractData,
            label: 'Status',
            className: 'font-bold text-textPrimary',
            render: (value: string | number, row: ContractData) => (
                <span className={row.statusColor}>{String(value)}</span>
            )
        },
        { key: 'valor' as keyof ContractData, label: 'Valor Mensal', className: 'font-semibold text-textPrimary' },
        { key: 'data' as keyof ContractData, label: 'Data Início', className: 'font-semibold text-textPrimary' },
        {
            key: 'name' as keyof ContractData, // Usando uma chave existente para a coluna de ações
            label: 'Editar',
            className: 'text-center text-textPrimary',
            render: () => (
                <button className="p-2 rounded hover:bg-hoverButton">
                    <Edit2 size={20} />
                </button>
            )
        }
    ];

    const tableActions = [
        {
            label: 'Gerenciar Planos',
            onClick: () => window.location.href = "/GerenciarPlanos",
            className: 'text-textPrimary'
        }
    ];

    return (
        <div className="min-h-screen bg-background p-8 pt-16">
            <div>
                <Breadcrumb />
                <h1 className="text-3xl font-bold text-textPrimary mb-2">Seja bem-vindo!</h1>
                <p className="text-lg text-textSecondary">Gerencie seus serviços e planos funerários</p>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ">
                {dashboardCards.map((card, idx) => (
                    <StatCard
                        key={idx}
                        title={card.title}
                        value={card.value}
                        color={card.bgColor}
                        icon={card.icon}
                        className="h-full flex flex-col justify-between "
                    />
                ))}
            </div>
      
            <GenericTable
                title="Contratos"
                columns={tableColumns}
                data={contractsData}
                actions={tableActions}
            />
        
            <Pagination total={contractsData.length} currentPage={1} />
        </div>
    );
};

export default DashBoard;
