import React from "react";
import Cards from '../../components/DashBoard/Cards';
import GenericTable from '../../components/DashBoard/Table';
import Pagination from '../../components/DashBoard/Pagination';

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
            icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="currentColor" /></svg>
        },
        {
            title: "Contratos ativos",
            value: 212,
            bgColor: "bg-success",
            icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        },
        {
            title: "Contratos inativos",
            value: 12,
            bgColor: "bg-danger",
            icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        },
        {
            title: "Lucro",
            value: "R$ 60,00",
            bgColor: "bg-warning",
            icon: <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3v18M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        }
    ];

    const tableColumns = [
        { key: 'name' as keyof ContractData, label: 'Cliente', className: 'font-semibold text-textPrimary' },
        { key: 'email' as keyof ContractData, label: 'Email', className: 'underline text-textPrimary' },
        {
            key: 'status' as keyof ContractData,
            label: 'Status',
            className: 'font-bold',
            render: (value: string | number, row: ContractData) => (
                <span className={row.statusColor}>{String(value)}</span>
            )
        },
        { key: 'valor' as keyof ContractData, label: 'Valor Mensal', className: 'font-semibold text-textPrimary' },
        { key: 'data' as keyof ContractData, label: 'Data Início', className: 'font-semibold text-textPrimary' },
        {
            key: 'name' as keyof ContractData, // Usando uma chave existente para a coluna de ações
            label: 'Editar',
            className: 'text-center',
            render: () => (
                <button className="p-2 rounded hover:bg-hoverButton">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                        <path d="M4 21h16M12 17v-6M12 11V7M12 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            )
        }
    ];

    const tableActions = [
        {
            label: 'Gerenciar Planos',
            onClick: () => window.location.href = "/GerenciarPlanos"
        }
    ];

    return (
        <div className="min-h-screen bg-background p-8 pt-16">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-textPrimary mb-2">Seja bem-vindo!</h1>
                <p className="text-lg text-textSecondary">Gerencie seus serviços e planos funerários</p>
            </div>
    
            <Cards cards={dashboardCards} />
      
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
