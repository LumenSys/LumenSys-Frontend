import React from "react";

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
    return (
        <div className="min-h-screen bg-gray-100 p-8 pt-16">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-700 mb-2">Seja bem-vindo!</h1>
                <p className="text-lg text-gray-500">Gerencie seus serviços e planos funerários</p>
            </div>
            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-surface rounded-lg shadow p-6 flex flex-col justify-between">
                    <span className="text-gray-500 text-lg font-semibold mb-2">Total de clientes</span>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-700">200</span>
                        <div className="w-14 h-14 bg-sky-500 rounded-md flex items-center justify-center text-white">
                            {/* Ícone */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4Zm0-2a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" fill="currentColor" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-surface rounded-lg shadow p-6 flex flex-col justify-between">
                    <span className="text-gray-500 text-lg font-semibold mb-2">Contratos ativos</span>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-700">212</span>
                        <div className="w-14 h-14 bg-green-600 rounded-md flex items-center justify-center text-white">
                            {/* Ícone */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-surface rounded-lg shadow p-6 flex flex-col justify-between">
                    <span className="text-gray-500 text-lg font-semibold mb-2">Contratos inativos</span>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-700">12</span>
                        <div className="w-14 h-14 bg-red-600 rounded-md flex items-center justify-center text-white">
                            {/* Ícone */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /><path d="M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        </div>
                    </div>
                </div>
                <div className="bg-surface rounded-lg shadow p-6 flex flex-col justify-between">
                    <span className="text-gray-500 text-lg font-semibold mb-2">Lucro</span>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-700">R$ 60,00</span>
                        <div className="w-14 h-14 bg-yellow-400 rounded-md flex items-center justify-center text-white">
                            {/* Ícone */}
                            <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 3v18M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabela de contratos */}
            <div className="bg-surface rounded-lg shadow p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-700 mb-2 sm:mb-0">Contratos</h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <button
                            className="px-4 py-2 bg-sky-500 text-white rounded hover:bg-sky-600 transition"
                            onClick={() => window.location.href = "/GerenciarPlanos"}
                        >
                            Gerenciar Planos
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto rounded-md">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-primary">
                                <th className="px-4 py-3 text-left text-gray-700 font-bold">Cliente</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-bold">Email</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-bold">Status</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-bold">Valor Mensal</th>
                                <th className="px-4 py-3 text-left text-gray-700 font-bold">Data Início</th>
                                <th className="px-4 py-3 text-center text-gray-700 font-bold">Editar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contractsData.map((row, i) => (
                                <tr key={i} className="hover:bg-gray-300">
                                    <td className="px-4 py-3 font-semibold text-gray-700">{row.name}</td>
                                    <td className="px-4 py-3 underline text-gray-700">{row.email}</td>
                                    <td className={`px-4 py-3 font-bold ${row.statusColor}`}>{row.status}</td>
                                    <td className="px-4 py-3 font-semibold text-gray-700">
                                        {row.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-gray-700">{row.data}</td>
                                    <td className="px-4 py-3 text-center">
                                        <button className="p-2 rounded hover:bg-gray-200">
                                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                                                <path d="M4 21h16M12 17v-6M12 11V7M12 7V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 gap-4">
                <span className="text-gray-500 text-sm">Mostrando 1 a {contractsData.length} de 50 resultados</span>

                <div className="flex items-center gap-4">
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700">Anterior</button>
                    <div className="flex items-center gap-2 text-gray-700">
                        <button className="px-3 py-1 rounded bg-sky-300 font-bold">1</button>
                        <button className="px-3 py-1 rounded hover:bg-sky-100">2</button>
                        <span>...</span>
                        <button className="px-3 py-1 rounded hover:bg-sky-100">3</button>
                        <button className="px-3 py-1 rounded hover:bg-sky-100">5</button>
                    </div>
                    <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-700">Próximo &gt;</button>
                </div>
            </div>

        </div>
    );
};

export default DashBoard;
