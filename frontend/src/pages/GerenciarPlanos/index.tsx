import React from "react";
import { useState } from 'react';
import GenericTable from '../../components/DashBoard/Table';
import { Edit2 } from 'lucide-react';

interface Plano {
  nome: string;
  descricao: string;
  valorAnual: number;
  foraDeAr: boolean;
  maxDependente: number;
  idadeMaxima: number;
  adicionalDependente: number;
}

const planosExemplo: Plano[] = [
  {
    nome: 'Plano Básico',
    descricao: 'Cobertura essencial',
    valorAnual: 1200.00,
    foraDeAr: false,
    maxDependente: 2,
    idadeMaxima: 65,
    adicionalDependente: 150.00,
  },
  {
    nome: 'Plano Premium',
    descricao: 'Cobertura completa',
    valorAnual: 2500.00,
    foraDeAr: true,
    maxDependente: 4,
    idadeMaxima: 75,
    adicionalDependente: 200.00,
  },
];

export default function GerenciarPlanos() {
  const [busca, setBusca] = useState('');

  const planosFiltrados = planosExemplo.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.descricao.toLowerCase().includes(busca.toLowerCase())
  );

  const columns = [
    { key: 'nome' as keyof Plano, label: 'Nome', className: 'text-textSecondary' },
    { key: 'descricao' as keyof Plano, label: 'Descrição', className: 'text-textSecondary' },
    { key: 'valorAnual' as keyof Plano, label: 'Valor Anual', className: 'text-textSecondary', render: (value) => <span>{(value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> },
    { key: 'foraDeAr' as keyof Plano, label: 'Fora de Área', className: 'text-textSecondary', render: (value) => <span>{value ? 'Sim' : 'Não'}</span> },
    { key: 'maxDependente' as keyof Plano, label: 'Máx. Dependentes', className: 'text-textSecondary' },
    { key: 'idadeMaxima' as keyof Plano, label: 'Idade Máxima', className: 'text-textSecondary' },
    { key: 'adicionalDependente' as keyof Plano, label: 'Adicional Dependente', className: 'text-textSecondary', render: (value) => <span>{(value as number).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span> },
    {
      key: 'nome' as keyof Plano, // Chave dummy para ação
      label: 'Editar',
      className: 'text-textSecondary',
      render: () => (
        <button type="button" title="Editar" className="hover:bg-primary rounded p-1 text-textPrimary">
          <Edit2 size={24} />
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Planos</h1>
      </div>
      <div className="bg-surface rounded-lg shadow p-6">
        <div className="flex flex-row items-center justify-between mb-4 gap-4">
          <h2 className="text-2xl font-bold text-textPrimary">Gerenciar Planos</h2>
          <div className="flex flex-row gap-2">
            <input
              type="text"
              placeholder="Buscar por usuário ou plano"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="bg-background border border-neutral text-textPrimary rounded px-3 py-2 w-60"
            />
            <button
              type="button"
              className="px-4 py-2 bg-primary text-textPrimary rounded hover:bg-secondary hover:text-whiteColor transition"
              onClick={() => {}}
            >
              Cadastrar novo plano
            </button>
          </div>
        </div>
        <GenericTable
          title=""
          columns={columns}
          data={planosFiltrados}
          actions={[]}
        />
      </div>
    </div>
  );
}
