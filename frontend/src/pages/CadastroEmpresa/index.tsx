import React, { useState } from "react";
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';

// Tipo baseado no modelo Company da API
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
  const api = ApiService();
  const [fields, setFields] = useState<CompanyData>(initialFields);
  const [touched, setTouched] = useState<{ [K in keyof CompanyData]?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Aplicar máscaras específicas
    let formattedValue = value;

    if (name === 'cpfCnpj') {
      // Máscara para CNPJ: 00.000.000/0000-00
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    } else if (name === 'phone') {
      // Máscara para telefone: (00) 00000-0000
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    } else if (name === 'uf') {
      // UF em maiúsculo, máximo 2 caracteres
      formattedValue = value.toUpperCase().substring(0, 2);
    }

    setFields({ ...fields, [name]: formattedValue });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isEmpty = (key: keyof CompanyData) => touched[key] && !fields[key];
  const isFilled = (key: keyof CompanyData) => fields[key] && touched[key];

  // Validação de CNPJ
  const isValidCNPJ = (cnpj: string) => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    return cleanCNPJ.length === 14;
  };

  // Validação de email
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const errors: string[] = [];

    // Verificar campos obrigatórios
    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        errors.push(`${getFieldLabel(key as keyof CompanyData)} é obrigatório`);
      }
    });

    // Validações específicas
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
      const companyData = {
        ...fields,
        cpfCnpj: fields.cpfCnpj.replace(/\D/g, ''),
        phone: fields.phone.replace(/\D/g, ''),
      };

      await api.post('api/companies', companyData);

      setSuccess(true);
      setFields(initialFields);
      setTouched({});

      setTimeout(() => {
        window.location.href = "/listaempresas";
      }, 2000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-12 flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto">
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-6 bg-surface p-10 rounded-lg shadow-md">
          <h2 className="col-span-2 text-3xl font-bold text-center mb-6 text-textPrimary">
            Cadastro de Empresa
          </h2>

          {/* Mensagens de feedback */}
          {error && (
            <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="col-span-2 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Empresa cadastrada com sucesso!
            </div>
          )}

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

          <DefaultColumn>
            <InputField
              label="Telefone:"
              name="phone"
              placeholder="(99) 99999-9999"
              value={fields.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("phone") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

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

          <DefaultColumn>
            <InputField
              label="Rua:"
              name="street"
              placeholder="Digite o nome da rua"
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

          <DefaultColumn>
            <InputField
              label="UF:"
              name="uf"
              placeholder="SP"
              value={fields.uf}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={2}
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("uf") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.uf && fields.uf.length !== 2 && touched.uf && (
              <span className="text-danger text-sm">UF deve ter 2 caracteres</span>
            )}
          </DefaultColumn>

          <div className="col-span-2 w-full mt-6 flex gap-4 justify-end">
            {/* Botão "Voltar" */}
            <button
              type="button"
              className="w-full bg-red-600 text-background px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              onClick={() => window.location.href = "/listaempresas"}
              disabled={loading}
            >
              Voltar
            </button>

            {/* Botão "Enviar" */}
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