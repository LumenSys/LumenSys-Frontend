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

      // Armazenar token no cookie
      Cookies.set('token', token, { expires: rememberMe ? 7 : undefined });

      // Armazenar email no localStorage (opcional)
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
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
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
      <label>
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={e => setRememberMe(e.target.checked)}
        />
        Lembrar-me
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );

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
