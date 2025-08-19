import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import InputField from '../../components/Input/InputField';
import Cookies from 'js-cookie';

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
      const response = await api.post('api/user/login', { email, password });
      const token = response.data.token;

      Cookies.set('token', token, { expires: rememberMe ? 7 : undefined });
      localStorage.setItem('email', email);

      if (rememberMe) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login falhou:', err);
      alert(err.response?.data?.message || 'Falha ao realizar o login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-background">
      <section className="bg-surface shadow-2xl rounded-2xl p-10 w-full max-w-md border border-primary/10">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary drop-shadow">
          Login de Usuário
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
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
            <label htmlFor="remember" className="ml-2 text-sm text-textSecondary select-none">
              Lembrar-me
            </label>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-background py-2 rounded-md font-semibold shadow hover:bg-secondary transition-colors duration-200"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-textSecondary">
          Ainda não tem conta?{' '}
          <button
            type="button"
            className="text-primary underline hover:text-secondary font-medium"
            onClick={() => navigate('/usersignup')}
          >
            Cadastre-se
          </button>
        </p>
      </section>
    </div>
  );
}
