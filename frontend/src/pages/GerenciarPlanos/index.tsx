import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../../App';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
export default function GerenciarPlanos() {
  return (
    <div className="w-full min-h-screen bg-neutral-50 flex flex-col items-center py-12">
      {/* Título */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Planos</h1>

      {/* Caixa principal */}
      <div className="w-[90vw] max-w-6xl bg-zinc-400 rounded-lg shadow-lg p-8 flex flex-col gap-6">
        {/* Barra de busca */}
        <div className="flex justify-end">
          <div className="relative w-72">
            <input
              className="w-full h-10 pl-10 pr-12 rounded-md border border-slate-200 text-slate-700 focus:outline-none"
              placeholder="Buscar por ID"
            />
            {/* Ícone de busca */}
            <span className="absolute left-2 top-2">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </div>
        {/* Tabela de planos (exemplo) */}
        <div className="bg-white rounded-md shadow border border-slate-200 overflow-x-auto">
          <table className="min-w-full text-left">
            <thead>
              <tr className="bg-sky-100">
          <th className="py-3 px-4 text-gray-700">Plano</th>
          <th className="py-3 px-4 text-gray-700">Usuário</th>
          <th className="py-3 px-4 text-gray-700">Status</th>
          <th className="py-3 px-4 text-gray-700">Editar</th>
              </tr>
            </thead>
            <tbody>
              {/* Exemplo de plano ativo */}
              <tr>
          <td className="py-3 px-4 text-slate-500">Plano Básico</td>
          <td className="py-3 px-4 text-slate-500">joao@email.com</td>
          <td className="py-3 px-4 text-gray-700 flex items-center gap-2">
            Ativo
            <svg width="20" height="20" fill="none" stroke="green" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="green" strokeWidth="2" fill="none"/>
              <path d="M8 12l2 2l4-4" stroke="green" strokeWidth="2" fill="none"/>
            </svg>
          </td>
          <td className="py-3 px-4">
            <button type="button" title="Editar">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                <path d="M7 17h10" />
              </svg>
            </button>
          </td>
              </tr>
              {/* Exemplo de plano inativo */}
              <tr>
          <td className="py-3 px-4 text-slate-500">Plano Premium</td>
          <td className="py-3 px-4 text-slate-500">maria@email.com</td>
          <td className="py-3 px-4 text-gray-700 flex items-center gap-2">
            Inativo
            <svg width="20" height="20" fill="none" stroke="red" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="red" strokeWidth="2" fill="none"/>
              <line x1="8" y1="8" x2="16" y2="16" stroke="red" strokeWidth="2"/>
              <line x1="16" y1="8" x2="8" y2="16" stroke="red" strokeWidth="2"/>
            </svg>
          </td>
          <td className="py-3 px-4">
            <button type="button" title="Editar">
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13z" />
                <path d="M7 17h10" />
              </svg>
            </button>
          </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/* Botão para adicionar novo plano */}
        <div className="flex justify-end mt-4">
          <button
            type="button"
            className="w-60 h-12 bg-sky-500 rounded-md text-white text-sm font-medium flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" />
            </svg>
            <span>Cadastrar novo plano</span>
          </button>
        </div>
      </div>
    </div>
  );
}