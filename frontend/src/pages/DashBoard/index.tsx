import React from 'react';

const DashBoard: React.FC = () => {
    return (
        <div style={{ padding: '2rem' }}>
            <h1>Dashboard</h1>
            <p>Bem-vindo ao painel de controle!</p>
            <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem' }}>
                <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minWidth: '150px' }}>
                    <h2>Usuários</h2>
                    <p>120</p>
                </div>
                <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minWidth: '150px' }}>
                    <h2>Vendas</h2>
                    <p>R$ 5.000</p>
                </div>
                <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', minWidth: '150px' }}>
                    <h2>Atividades</h2>
                    <p>34</p>
                </div>
            <button
                style={{
                    background: '#1976d2',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem 1.5rem',
                    cursor: 'pointer',
                    alignSelf: 'center',
                    fontSize: '1rem'
                }}
                onClick={() => window.location.href = '/GerenciarPlanos'}
            >
                Gerenciar Planos
            </button>
            </div>
        </div>
    );
};

export default DashBoard;