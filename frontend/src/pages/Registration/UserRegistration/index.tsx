import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ApiService from '../../../services/apiService';
import InputField from '../../../components/Input/InputField';

export default function UserRegistration() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const api = ApiService();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    try {
      await axios.post(
        api.appendRoute('api/user'),
        { name, email, password },
        api.headerConfig()
      );

      alert('Usuário cadastrado com sucesso!');
      navigate('/dahboard');
    } catch (err) {
      console.error('Cadastro falhou:', err);
      alert('Erro ao cadastrar. Tente novamente.');
    }
  }
      
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <section className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-textPrimary">
          Cadastro de Usuário
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <InputField
            name="name"
            placeholder="Nome"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            className="focus:ring-primary text-textPrimary bg-background"
          />
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
          <button
            type="submit"
            className="w-full bg-primary text-white py-2 rounded-md hover:bg-secondary transition"
          >
            Cadastrar
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-textSecondary">
          Já possui conta?{' '}
          <button
            type="button"
            className="text-primary underline hover:text-secondary"
            onClick={() => navigate('/')}
          >
            Faça login
          </button>
        </p>
      </section>
    </div>
  );
}