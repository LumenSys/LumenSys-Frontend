import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiService from '../../services/apiService';
import InputField from '../../components/Input/InputField';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const api = ApiService();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        api.appendRoute('api/user/login'),
        { email, password },
        api.headerConfig()
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('email', email);

      if (rememberMe) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login falhou:', err);
      alert('Falha ao realizar o login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <section className="bg-surface shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-textPrimary">
          Login de Usuário
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="focus:ring-primary text-textPrimary bg-background"
          />
          <InputField
            name="password"
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="focus:ring-primary text-textPrimary bg-background"
          />

          <div className="flex items-center">
            <input
              id="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="w-4 h-4 text-primary bg-surface rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="remember" className="ml-2 text-sm text-textSecondary">
              Lembrar-me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background py-2 rounded-md hover:bg-secondary transition"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-textSecondary">
          Ainda não tem conta?{' '}
          <button
            type="button"
            className="text-primary underline hover:text-secondary"
            onClick={() => navigate('/usersignup')}
          >
            Cadastre-se
          </button>
        </p>
      </section>
    </div>
  );
}
