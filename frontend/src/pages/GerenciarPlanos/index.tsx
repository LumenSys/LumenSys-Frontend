import React, { useState } from 'react';
import GenericTable from '../../components/DashBoard/Table';

interface Plano {
  plano: string;
  usuario: string;
  status: 'Ativo' | 'Inativo';
}

const planosExemplo: Plano[] = [
  { plano: 'Plano Básico', usuario: 'joao@email.com', status: 'Ativo' },
  { plano: 'Plano Premium', usuario: 'maria@email.com', status: 'Inativo' },
];

export default function GerenciarPlanos() {
  const [busca, setBusca] = useState('');

  const planosFiltrados = planosExemplo.filter((p) =>
    p.usuario.toLowerCase().includes(busca.toLowerCase()) ||
    p.plano.toLowerCase().includes(busca.toLowerCase())
  );

  const columns = [
    {
      key: 'plano' as keyof Plano,
      label: 'Plano',
      className: 'text-textSecondary',
    },
    {
      key: 'usuario' as keyof Plano,
      label: 'Usuário',
      className: 'text-textSecondary',
    },
    {
      key: 'status' as keyof Plano,
      label: 'Status',
      render: (value: string) => {
        const status = value as Plano['status'];
        return (
          <span className={
            status === 'Ativo' ? 'text-success flex items-center gap-2' : 'text-danger flex items-center gap-2'
          }>
            {status}
            {status === 'Ativo' ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2 2l4-4" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" />
                <line x1="8" y1="8" x2="16" y2="16" />
                <line x1="16" y1="8" x2="8" y2="16" />
              </svg>
            )}
          </span>
        );
      },
    },
    {
      key: 'plano' as keyof Plano, // Chave dummy para ação
      label: 'Editar',
      render: () => (
        <button type="button" title="Editar" className="hover:bg-hoverButton rounded p-1">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
            <path d="M7 17h10" />
          </svg>
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8 pt-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-textPrimary mb-2">Planos</h1>
      </div>
      {/* Custom header for GenericTable */}
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
              className="px-4 py-2 bg-primary text-background rounded transition"
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
