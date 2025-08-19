import React, { useState, useEffect } from "react";
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';
import Cookies from 'js-cookie';

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
  
  // 📝 Carregar dados salvos dos cookies ao inicializar
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

  // 💾 Salvar dados no cookie sempre que os campos mudarem
  useEffect(() => {
    const hasData = Object.values(fields).some(value => value.trim() !== "");
    
    if (hasData) {
      // Salvar dados no cookie por 24 horas
      Cookies.set('companyFormData', JSON.stringify(fields), { 
        expires: 1, // 1 dia
        secure: true, // Usar HTTPS em produção
        sameSite: 'strict' // Proteção CSRF
      });
    } else {
      // Remover cookie se todos os campos estiverem vazios
      Cookies.remove('companyFormData');
    }
  }, [fields]);

  // 🕒 Controlar sessão do usuário
  useEffect(() => {
    // Registrar quando o usuário visitou esta página
    Cookies.set('lastVisitedPage', 'cadastro-empresa', { expires: 7 });
    Cookies.set('lastActivity', new Date().toISOString(), { expires: 1 });

    // Verificar se há um token de autenticação
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      console.warn('⚠️ Usuário não autenticado');
      // Opcional: redirecionar para login
      // window.location.href = '/login';
    }

    // Carregar preferências do usuário
    const userPreferences = Cookies.get('userPreferences');
    if (userPreferences) {
      try {
        const prefs = JSON.parse(userPreferences);
        console.log('Preferências do usuário:', prefs);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Aplicar máscaras específicas
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
      const companyData = {
        ...fields,
        cpfCnpj: fields.cpfCnpj.replace(/\D/g, ''),
        phone: fields.phone.replace(/\D/g, ''),
      };

      const response = await api.post('api/v1/Company', companyData);

      // 🎉 Sucesso - Gerenciar cookies
      
      // 1. Remover dados temporários do formulário
      Cookies.remove('companyFormData');
      
      // 2. Salvar informações de sucesso
      Cookies.set('lastCompanyRegistered', JSON.stringify({
        name: fields.name,
        tradeName: fields.tradeName,
        registeredAt: new Date().toISOString()
      }), { expires: 30 }); // 30 dias
      
      // 3. Incrementar contador de empresas cadastradas
      const companiesCount = parseInt(Cookies.get('companiesRegisteredCount') || '0');
      Cookies.set('companiesRegisteredCount', (companiesCount + 1).toString(), { expires: 365 });
      
      // 4. Salvar estatísticas do usuário
      const userStats = {
        lastAction: 'company_registered',
        lastActionDate: new Date().toISOString(),
        totalCompanies: companiesCount + 1
      };
      Cookies.set('userStats', JSON.stringify(userStats), { expires: 365 });

      setSuccess(true);
      setFields(initialFields);
      setTouched({});

      // Mostrar mensagem de sucesso por 3 segundos antes de redirecionar
      setTimeout(() => {
        window.location.href = "/listaempresas";
      }, 3000);

    } catch (err: any) {
      // 🔥 Erro - Salvar para debug
      const errorInfo = {
        timestamp: new Date().toISOString(),
        error: err.response?.data?.message || err.message,
        endpoint: 'api/v1/Company',
        userAgent: navigator.userAgent
      };
      
      Cookies.set('lastError', JSON.stringify(errorInfo), { expires: 7 });
      
      setError(err.response?.data?.message || 'Erro ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  // 🧹 Função para limpar formulário e cookies
  const handleClearForm = () => {
    setFields(initialFields);
    setTouched({});
    setError(null);
    setSuccess(false);
    Cookies.remove('companyFormData');
  };

  // 📊 Mostrar estatísticas do usuário (opcional)
  const getUserStats = () => {
    const userStats = Cookies.get('userStats');
    if (userStats) {
      try {
        return JSON.parse(userStats);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const stats = getUserStats();

  return (
    <section className="py-12 flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto">
        {/* 📊 Mostrar estatísticas do usuário */}
        {stats && stats.totalCompanies > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            ℹ️ Você já cadastrou {stats.totalCompanies} empresa(s) no sistema.
          </div>
        )}

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
              ✅ Empresa cadastrada com sucesso! Redirecionando...
            </div>
          )}

            {/* Razão Social */}
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

            {/* Nome Fantasia */}
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

            {/* CNPJ */}
            <DefaultColumn>
            <InputField
              label="CNPJ:"
              name="cpfCnpj"
              placeholder="00.000.000/0000-00"
              value={fields.cpfCnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              maxLength={18}
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("cpfCnpj") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.cpfCnpj && !isValidCNPJ(fields.cpfCnpj) && touched.cpfCnpj && (
              <span className="text-danger text-sm">CNPJ inválido</span>
            )}
            </DefaultColumn>

            {/* Email */}
            <DefaultColumn>
            <InputField
              label="Email:"
              name="email"
              placeholder="empresa@email.com"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              type="email"
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("email") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
            {fields.email && !isValidEmail(fields.email) && touched.email && (
              <span className="text-danger text-sm">Email inválido</span>
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
              onClick={() => window.location.href = "/listaempresas"}
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