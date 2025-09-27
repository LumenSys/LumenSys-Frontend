import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/apiService';
import InputField from '../../components/Input/InputField';
import Cookies from 'js-cookie';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Lock, Mail } from 'lucide-react';

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
      const token = response.data?.data?.token;

      if (token) {
        Cookies.set('token', token, { expires: rememberMe ? 7 : undefined });
      }

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
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="text-primary" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-textSecondary">
            Faça login para acessar sua conta
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
              <InputField
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="pl-10 focus:ring-primary text-textPrimary bg-background"
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
              <InputField
                name="password"
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="pl-10 focus:ring-primary text-textPrimary bg-background"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
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
              type="button"
              className="text-sm text-primary hover:text-secondary font-medium underline"
            >
              Esqueci a senha
            </button>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-footer">
          <p className="text-center text-sm text-textSecondary">
            Ainda não tem conta?{' '}
            <button
              type="button"
              className="text-primary underline hover:text-secondary font-medium"
              onClick={() => navigate('/usersignup')}
            >
              Cadastre-se gratuitamente
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}
