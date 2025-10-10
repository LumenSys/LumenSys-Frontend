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
  logoBase64?: string | null;
  logoMimeType?: string | null;
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
  logoBase64: null,
  logoMimeType: null,
};

// Componente para exibir logo da empresa
interface CompanyLogoProps {
  logoBase64?: string;
  logoMimeType?: string;
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CompanyLogo: React.FC<CompanyLogoProps> = ({ 
  logoBase64, 
  logoMimeType, 
  companyName, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };

  // Função para converter Base64 para URL de imagem
  const base64ToImageUrl = (base64: string, mimeType: string): string => {
    return `data:${mimeType};base64,${base64}`;
  };

  if (logoBase64 && logoMimeType) {
    const imageUrl = base64ToImageUrl(logoBase64, logoMimeType);
    return (
      <img 
        src={imageUrl} 
        alt={`Logo da ${companyName}`}
        className={`${sizeClasses[size]} object-cover rounded-lg ${className}`}
      />
    );
  }

  // Fallback quando não há imagem
  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
      <Building2 className="text-gray-400" size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
    </div>
  );
};

const CadastroEmpresa = () => {
  const api = ApiService();
  
  // Estados do componente
  const [fields, setFields] = useState<CompanyData>(() => {
    const savedData = Cookies.get('companyFormData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Garantir que os novos campos existam
        return { ...initialFields, ...parsedData };
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

  // Função para converter File para Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  // Função para converter Base64 para URL de imagem
  const base64ToImageUrl = (base64: string, mimeType: string): string => {
    return `data:${mimeType};base64,${base64}`;
  };

  // Salvar dados no cookie sempre que os campos mudarem
  useEffect(() => {
    const hasData = Object.values(fields).some(value => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim() !== "";
      if (value instanceof File) return true;
      return !!value;
    });
    
    if (hasData) {
      // Não salvar arquivo no cookie, apenas os outros dados
      const dataToSave = { ...fields };
      delete dataToSave.logo; // Remover arquivo do cookie
      
      Cookies.set('companyFormData', JSON.stringify(dataToSave), { 
        expires: 1,
        secure: true,
        sameSite: 'strict'
      });
    } else {
      Cookies.remove('companyFormData');
    }
  }, [fields]);

  // Controlar sessão do usuário
  useEffect(() => {
    Cookies.set('lastVisitedPage', 'cadastro-empresa', { expires: 7 });
    Cookies.set('lastActivity', new Date().toISOString(), { expires: 1 });

    const authToken = Cookies.get('authToken');
    if (!authToken) {
      console.warn('⚠️ Usuário não autenticado');
    }

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
    const requiredFields: (keyof CompanyData)[] = [
      'cpfCnpj', 'name', 'tradeName', 'email', 'phone', 
      'street', 'number', 'neighborhood', 'city', 'uf'
    ];

    requiredFields.forEach(key => {
      const value = fields[key];
      if (!value || (typeof value === "string" && value.trim() === "")) {
        errors.push(`${getFieldLabel(key)} é obrigatório`);
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

  const getFieldLabel = (key: keyof CompanyData): string => {
    const labels: Record<keyof CompanyData, string> = {
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
      logo: 'Logo da Empresa',
      logoBase64: 'Logo Base64',
      logoMimeType: 'Tipo da Imagem'
    };
    return labels[key];
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      setError('Formato de imagem não suportado. Use JPEG, PNG, WebP ou SVG');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      
      setFields(prev => ({ 
        ...prev, 
        logo: file,
        logoBase64: base64,
        logoMimeType: file.type
      }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } catch (error) {
      setError('Erro ao processar a imagem');
      console.error('Erro ao converter imagem:', error);
    }
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
    setFields(prev => ({ 
      ...prev, 
      logo: null,
      logoBase64: null,
      logoMimeType: null
    }));
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
        cpfCnpj: fields.cpfCnpj.replace(/\D/g, ''),
        name: fields.name,
        tradeName: fields.tradeName,
        email: fields.email,
        phone: fields.phone.replace(/\D/g, ''),
        street: fields.street,
        number: fields.number,
        neighborhood: fields.neighborhood,
        city: fields.city,
        uf: fields.uf,
        logoBase64: fields.logoBase64 || null,
        logoMimeType: fields.logoMimeType || null
      };

      const response = await api.post('api/v1/Company', companyData);

      // Gerenciar cookies de sucesso
      Cookies.remove('companyFormData');
      
      Cookies.set('lastCompanyRegistered', JSON.stringify({
        name: fields.name,
        tradeName: fields.tradeName,
        registeredAt: new Date().toISOString()
      }), { expires: 30 });
      
      const companiesCount = parseInt(Cookies.get('companiesRegisteredCount') || '0');
      Cookies.set('companiesRegisteredCount', (companiesCount + 1).toString(), { expires: 365 });
      
      const userStats = {
        lastAction: 'company_registered',
        lastActionDate: new Date().toISOString(),
        totalCompanies: companiesCount + 1
      };
      Cookies.set('userStats', JSON.stringify(userStats), { expires: 365 });

      setSuccess(true);
      setFields(initialFields);
      setTouched({});
      setImagePreview(null);

      setTimeout(() => {
        window.location.href = "/listaempresas";
      }, 3000);

    } catch (err: any) {
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

  const handleClearForm = () => {
    setFields(initialFields);
    setTouched({});
    setError(null);
    setSuccess(false);
    setImagePreview(null);
    Cookies.remove('companyFormData');
  };

  // Função para buscar empresa e carregar imagem
  const loadCompanyImage = async (companyId: string) => {
    try {
      const response = await api.get(`api/v1/Company/${companyId}`);
      const company = response.data;
      
      if (company.logoBase64 && company.logoMimeType) {
        const imageUrl = base64ToImageUrl(company.logoBase64, company.logoMimeType);
        setImagePreview(imageUrl);
        
        setFields(prev => ({
          ...prev,
          logoBase64: company.logoBase64,
          logoMimeType: company.logoMimeType
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar imagem da empresa:', error);
    }
  };

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