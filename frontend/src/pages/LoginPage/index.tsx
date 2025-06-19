import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiService from '../../services/apiService';
import { routes } from '../../routes/routes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const api = ApiService();

  const UserRegistration = () => navigate(routes.USERSIGNUP);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await axios.post(
        api.appendRoute('api/user/login'),
        { email, password },
        api.headerConfig()
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);

      navigate(routes.LANDING); 
    } catch (err) {
      console.error('Login falhou:', err);
      alert('Falha ao realizar o login. Verifique suas credenciais.');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Login de Usuário</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:ring-primary focus:outline-none"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 border rounded focus:ring-primary focus:outline-none"
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition"
        >
          Entrar
        </button>

        <p className="text-center text-sm text-textSecondary">
          Ainda não tem conta?{' '}
          <button
            type="button"
            className="text-primary underline hover:text-secondary"
            onClick={UserRegistration}
          >
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}
