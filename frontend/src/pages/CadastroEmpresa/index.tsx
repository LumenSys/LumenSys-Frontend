// src/pages/CadastroEmpresa/index.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import InputField from '../../components/Input/InputField';
import { useCompanies } from '../../context/CompanyContext';
import Cookies from 'js-cookie';

type CompanyData = {
  cpfCnpj: string;
  name: string;
  tradeName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  uf: string;
};

const initialFields: CompanyData = {
  cpfCnpj: "",
  name: "",
  tradeName: "",
  email: "",
  phone: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  uf: "",
};

const CadastroEmpresa = () => {
  const navigate = useNavigate();
  const { addCompany } = useCompanies();

  const [fields, setFields] = useState<CompanyData>(() => {
    const savedData = Cookies.get('companyFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Erro ao carregar dados salvos:', error);
        return initialFields;
      }
    }
    return initialFields;
  });

  const [touched, setTouched] = useState<{ [K in keyof CompanyData]?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Salvar dados no cookie sempre que os campos mudarem
  useEffect(() => {
    const hasData = Object.values(fields).some(value => value.trim() !== "");

    if (hasData) {
      Cookies.set('companyFormData', JSON.stringify(fields), {
        expires: 1,
        secure: true,
        sameSite: 'strict'
      });
    } else {
      Cookies.remove('companyFormData');
    }
  }, [fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let formattedValue = value;

    if (name === 'cpfCnpj') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    } else if (name === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    } else if (name === 'uf') {
      formattedValue = value.toUpperCase().substring(0, 2);
    }

    setFields({ ...fields, [name]: formattedValue });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isEmpty = (key: keyof CompanyData) => touched[key] && !fields[key];

  const isValidCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: string[] = [];

    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        errors.push(`${getFieldLabel(key as keyof CompanyData)} é obrigatório`);
      }
    });

    if (fields.cpfCnpj && !isValidCNPJ(fields.cpfCnpj)) {
      errors.push('CNPJ deve ter 14 dígitos');
    }

    if (fields.email && !isValidEmail(fields.email)) {
      errors.push('Email deve ter um formato válido');
    }

    if (fields.uf && fields.uf.length !== 2) {
      errors.push('UF deve ter 2 caracteres');
    }

    return errors;
  };

  const getFieldLabel = (key: keyof CompanyData) => {
    const labels = {
      cpfCnpj: 'CNPJ',
      name: 'Razão Social',
      tradeName: 'Nome Fantasia',
      email: 'Email',
      phone: 'Telefone',
      street: 'Rua',
      number: 'Número',
      neighborhood: 'Bairro',
      city: 'Cidade',
      uf: 'UF'
    };
    return labels[key];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simular chamada da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Adicionar empresa ao contexto global
      addCompany({
        name: fields.name,
        cnpj: fields.cpfCnpj,
        email: fields.email,
        tradeName: fields.tradeName,
        phone: fields.phone,
        street: fields.street,
        number: fields.number,
        neighborhood: fields.neighborhood,
        city: fields.city,
        uf: fields.uf,
      });

      // Gerenciar cookies de sucesso
      Cookies.remove('companyFormData');

      const companiesCount = parseInt(Cookies.get('companiesRegisteredCount') || '0');
      Cookies.set('companiesRegisteredCount', (companiesCount + 1).toString(), { expires: 365 });

      setSuccess(true);
      setFields(initialFields);
      setTouched({});

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/listaempresas');
      }, 2000);

    } catch (err: any) {
      setError('Erro ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFields(initialFields);
    setTouched({});
    setError(null);
    setSuccess(false);
    Cookies.remove('companyFormData');
  };

  return (
    <section className="py-12 flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6 bg-surface p-10 rounded-lg shadow-md">
          <h2 className="col-span-2 text-3xl font-bold text-center mb-6 text-textPrimary">
            Cadastro de Empresa
          </h2>

          {/* Mostrar se há dados recuperados */}
          {Cookies.get('companyFormData') && (
            <div className="col-span-2 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded flex justify-between items-center">
              <span>📝 Dados do formulário foram recuperados automaticamente.</span>
              <button
                type="button"
                onClick={handleClearForm}
                className="text-yellow-600 underline hover:text-yellow-800"
              >
                Limpar tudo
              </button>
            </div>
          )}

          {/* Mensagens de feedback */}
          {error && (
            <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="col-span-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              ✅ Empresa cadastrada com sucesso! Redirecionando para a lista...
            </div>
          )}

          {/* Campos do formulário */}
          <DefaultColumn>
            <InputField
              label="Razão Social:"
              name="name"
              placeholder="Digite a razão social da empresa"
              value={fields.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("name") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Nome Fantasia:"
              name="tradeName"
              placeholder="Digite o nome fantasia"
              value={fields.tradeName}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("tradeName") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="CNPJ:"
              name="cpfCnpj"
              placeholder="00.000.000/0000-00"
              value={fields.cpfCnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("cpfCnpj") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.cpfCnpj && !isValidCNPJ(fields.cpfCnpj) && touched.cpfCnpj && (
              <span className="text-danger text-sm">CNPJ deve ter 14 dígitos</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Email:"
              name="email"
              type="email"
              placeholder="Digite o email da empresa"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("email") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.email && !isValidEmail(fields.email) && touched.email && (
              <span className="text-danger text-sm">Email deve ter um formato válido</span>
            )}
          </DefaultColumn>


          {/* Telefone */}
          <DefaultColumn>
            <InputField
              label="Telefone:"
              name="phone"
              placeholder="(99) 99999-9999"
              value={fields.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={15}
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("phone") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          {/* Rua */}
          <DefaultColumn>
            <InputField
              label="Rua:"
              name="street"
              placeholder="Digite a rua"
              value={fields.street}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("street") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          {/* Número */}
          <DefaultColumn>
            <InputField
              label="Número:"
              name="number"
              placeholder="Digite o número"
              value={fields.number}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("number") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          {/* Bairro */}
          <DefaultColumn>
            <InputField
              label="Bairro:"
              name="neighborhood"
              placeholder="Digite o bairro"
              value={fields.neighborhood}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("neighborhood") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          {/* Cidade */}
          <DefaultColumn>
            <InputField
              label="Cidade:"
              name="city"
              placeholder="Digite a cidade"
              value={fields.city}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("city") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          {/* UF */}
          <DefaultColumn>
            <InputField
              label="UF:"
              name="uf"
              placeholder="UF"
              value={fields.uf}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={2}
              className="focus:ring-primary text-textPrimary bg-background uppercase"
            />
            {isEmpty("uf") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.uf && fields.uf.length !== 2 && touched.uf && (
              <span className="text-danger text-sm">UF deve ter 2 caracteres</span>
            )}
          </DefaultColumn>

          <div className="col-span-2 w-full mt-6 flex gap-4 justify-end">
            <button
              type="button"
              className="w-full bg-red-600 text-background px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              onClick={() => navigate('/listaempresas')}
              disabled={loading}
            >
              Voltar
            </button>

            <button
              type="submit"
              className="w-full bg-primary text-background px-6 py-3 rounded-lg hover:bg-secondary transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

type DefaultColumnProps = {
  children: React.ReactNode;
};

const DefaultColumn = ({ children }: DefaultColumnProps) => (
  <div>
    {children}
  </div>
);

export default CadastroEmpresa;