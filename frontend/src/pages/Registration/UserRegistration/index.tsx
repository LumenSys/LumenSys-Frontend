import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/apiService';
import InputField from '../../../components/Input/InputField';

export default function UserRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const api = ApiService();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('api/user', { name, email, password });
      alert('Usuário cadastrado com sucesso!');
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Cadastro falhou:', err);
      alert(err.response?.data?.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
    }}>
      <form
        onSubmit={handleRegister}
        style={{
          background: '#fff',
          padding: '2.5rem 2rem',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(60,60,120,0.15)',
          minWidth: 340,
          width: '100%',
          maxWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        <h2 style={{
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#2d3748',
          fontWeight: 700,
          letterSpacing: 1
        }}>
          Cadastro de Usuário
        </h2>
        <InputField
          label="Nome"
          name="name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <InputField
          label="Email"
          name="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <InputField
          label="Senha"
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            border: 'none',
            background: loading ? '#a0aec0' : 'linear-gradient(90deg, #667eea 0%, #5a67d8 100%)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
        <div style={{ textAlign: 'center', marginTop: '0.5rem', color: '#718096', fontSize: 14 }}>
          Já possui uma conta? <a href="/login" style={{ color: '#5a67d8', textDecoration: 'none', fontWeight: 500 }}>Entrar</a>
        </div>
      </form>
    </div>
  );
}