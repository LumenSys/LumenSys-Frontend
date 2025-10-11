import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../../services/apiService';
import InputField from '../../../components/Input/InputField';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { User, Mail, Lock } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/10 to-background">
      <Card className="w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
            <User className="text-primary" size={24} />
          </div>
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Criar Conta
          </h1>
          <p className="text-textSecondary">
            Junte-se a nós! É rápido e fácil.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
              <InputField
                label=""
                name="name"
                placeholder="Digite seu nome completo"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="focus:ring-secondary text-textPrimary bg-background"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
              <InputField
                label=""
                name="email"
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="focus:ring-secondary text-textPrimary bg-background"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-textSecondary" size={18} />
              <InputField
                label=""
                name="password"
                type="password"
                placeholder="Crie uma senha segura"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="focus:ring-secondary text-textPrimary bg-background"
              />
            </div>
          </div>

          <div className="text-xs text-textSecondary">
            Ao criar uma conta, você concorda com nossos{' '}
            <button type="button" className="text-primary underline hover:text-hoverButton2">
              Termos de Serviço
            </button>{' '}
            e{' '}
            <button type="button" className="text-primary underline hover:text-hoverButton2">
              Política de Privacidade
            </button>
            .
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Criar Conta
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-footer">
          <p className="text-center text-sm text-textSecondary">
            Já possui uma conta?{' '}
            <button
              type="button"
              className="text-primary underline hover:text-hoverButton2 font-medium"
              onClick={() => navigate('/login')}
            >
              Fazer login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
}