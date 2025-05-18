import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiService from '../../services/apiService';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();
  const api = ApiService();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(
        api.appendRoute('/api/user/login'),
        { email, password },
        api.headerConfig()
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);

      navigate('/');
    } catch (err) {
      console.error('Login falhou:', err);
      alert('Falha ao realizar o login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg px-10 py-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-textPrimary mb-6">Login de Usuário</h1>
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
        />
        
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition duration-200"
        >
          Entrar
        </button>

        <p className="mt-4 text-center text-sm text-textSecondary">
          Ainda não tem conta?{' '}
          <button className="text-primary underline hover:text-secondary">
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}
