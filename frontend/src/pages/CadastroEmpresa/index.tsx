import React, { useState, useEffect } from "react";
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';
import Cookies from 'js-cookie';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Building2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

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
  logo?: File | null;
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
  logo: null,
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // 💾 Salvar dados no cookie sempre que os campos mudarem
  useEffect(() => {
    const hasData = Object.values(fields).some(value => value !== null && value !== undefined && typeof value === "string" ? value.trim() !== "" : !!value);
    
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
      if (typeof value === "string" ? value.trim() === "" : value == null) {
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
      uf: 'UF',
      logo: 'Logo da Empresa'
    };
    return labels[key];
  };

  // Funções para lidar com upload de imagem
  const handleImageUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato de imagem não suportado. Use JPEG, PNG, WebP ou SVG');
      return;
    }

    setFields(prev => ({ ...prev, logo: file }));
    
    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleImageDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  const removeImage = () => {
    setFields(prev => ({ ...prev, logo: null }));
    setImagePreview(null);
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
    <PageLayout
      title="Cadastro de Empresa"
      subtitle="Registre uma nova empresa no sistema"
      actions={
        <Button
          variant="outline"
          icon={X}
          onClick={() => window.location.href = "/listaempresas"}
          disabled={loading}
        >
          Cancelar
        </Button>
      }
    >
      {/* Estatísticas do usuário */}
      {stats && stats.totalCompanies > 0 && (
        <Card className="bg-primary/5 border-primary/20">
          <div className="flex items-center gap-3">
            <Building2 className="text-primary" size={20} />
            <span className="text-textPrimary text-sm">
              Você já cadastrou {stats.totalCompanies} empresa(s) no sistema.
            </span>
          </div>
        </Card>
      )}

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Seção: Logo da Empresa */}
        <Card>
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center justify-center gap-2">
              <ImageIcon size={20} />
              Logo da Empresa
            </h3>
            
            {/* Upload de Imagem */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-primary bg-primary/5 scale-105' 
                  : 'border-footer hover:border-primary/50 hover:bg-primary/5'
              }`}
              onDrop={handleImageDrop}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
            >
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="mx-auto w-32 h-32 rounded-lg overflow-hidden bg-footer">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" size="sm" onClick={removeImage}>
                      Remover
                    </Button>
                    <label className="cursor-pointer">
                      <Button variant="ghost" size="sm" icon={Upload}>
                        Alterar
                      </Button>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-textPrimary font-medium">
                      Arraste uma imagem ou clique para fazer upload
                    </p>
                    <p className="text-textSecondary text-sm mt-1">
                      PNG, JPG, WebP ou SVG até 5MB
                    </p>
                  </div>
                  <label className="cursor-pointer">
                    <Button variant="outline" icon={Upload}>
                      Escolher Arquivo
                    </Button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Seção: Informações Básicas */}
        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-6 flex items-center gap-2">
            <Building2 size={20} />
            Informações da Empresa
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField
                label="CNPJ/CPF"
                name="cpfCnpj"
                placeholder="00.000.000/0000-00"
                value={fields.cpfCnpj}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("cpfCnpj") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Razão Social"
                name="name"
                placeholder="Nome oficial da empresa"
                value={fields.name}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("name") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Nome Fantasia"
                name="tradeName"
                placeholder="Nome comercial"
                value={fields.tradeName}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("tradeName") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="E-mail"
                name="email"
                type="email"
                placeholder="contato@empresa.com"
                value={fields.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("email") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Telefone"
                name="phone"
                placeholder="(11) 99999-9999"
                value={fields.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("phone") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>
          </div>
        </Card>

        {/* Seção: Endereço */}
        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-6">
            Endereço
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <InputField
                label="Rua/Avenida"
                name="street"
                placeholder="Nome da rua"
                value={fields.street}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("street") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Número"
                name="number"
                placeholder="123"
                value={fields.number}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("number") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Bairro"
                name="neighborhood"
                placeholder="Centro"
                value={fields.neighborhood}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("neighborhood") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="Cidade"
                name="city"
                placeholder="São Paulo"
                value={fields.city}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                className="focus:ring-primary text-textPrimary bg-background"
              />
              {isEmpty("city") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
            </div>

            <div>
              <InputField
                label="UF"
                name="uf"
                placeholder="SP"
                value={fields.uf}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                maxLength={2}
                className="focus:ring-primary text-textPrimary bg-background uppercase"
              />
              {isEmpty("uf") && (
                <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>
              )}
              {fields.uf && fields.uf.length !== 2 && touched.uf && (
                <span className="text-danger text-sm mt-1 block">UF deve ter 2 caracteres</span>
              )}
            </div>
          </div>
        </Card>

        {/* Mensagens de Feedback */}
        {error && (
          <Card className="bg-danger/10 border-danger/20">
            <div className="text-danger text-sm">
              ⚠️ {error}
            </div>
          </Card>
        )}

        {success && (
          <Card className="bg-success/10 border-success/20">
            <div className="text-success text-sm">
              ✅ Empresa cadastrada com sucesso! Redirecionando...
            </div>
          </Card>
        )}

        {/* Botões de Ação */}
        <Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClearForm}
              disabled={loading}
              icon={X}
            >
              Limpar Formulário
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
              size="lg"
            >
              Cadastrar Empresa
            </Button>
          </div>
        </Card>
      </form>
    </PageLayout>
  );
};

export default CadastroEmpresa;