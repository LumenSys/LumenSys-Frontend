import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Building2, Save, Trash2, X, Upload, Edit2, Plus, MapPin, Mail, Phone, AlertTriangle, LucideIcon } from 'lucide-react';

// ====================================================================
// 1. Tipagem
// ====================================================================

type CompanyData = {
  id?: string;
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
  logoBase64?: string | null;
  logoMimeType?: string | null;
};

// ====================================================================
// 2. MOCK COMPONENTS (Substituem os imports externos para compilação)
// ====================================================================

// --- MOCK: PageLayout ---
interface PageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, actions }) => (
  <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-inter">
    <div className="flex justify-between items-center mb-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
        <p className="text-gray-500">{subtitle}</p>
      </header>
      {actions && <div>{actions}</div>}
    </div>
    <main>{children}</main>
  </div>
);

// --- MOCK: Card ---
interface CardProps {
  children: React.ReactNode;
  className?: string;
}
const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`bg-white p-6 rounded-xl shadow-lg ${className}`}>
    {children}
  </div>
);

// --- MOCK: Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  icon?: LucideIcon;
  loading?: boolean;
  size?: 'sm' | 'md';
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon: Icon,
  loading = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'flex items-center justify-center rounded-lg font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  let sizeClasses;
  if (size === 'sm') sizeClasses = 'px-3 py-1.5 text-sm';
  else sizeClasses = 'px-4 py-2 text-base';

  let variantClasses = '';
  if (variant === 'primary') variantClasses = 'bg-blue-600 text-white hover:bg-blue-700';
  else if (variant === 'outline') variantClasses = 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50';
  else if (variant === 'danger') variantClasses = 'bg-red-600 text-white hover:bg-red-700';
  else if (variant === 'ghost') variantClasses = 'bg-transparent text-gray-600 hover:bg-gray-100 border-transparent';

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 20} className={children ? 'mr-2' : ''} />}
          {children}
        </>
      )}
    </button>
  );
};

// --- MOCK: InputField ---
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

const InputField: React.FC<InputFieldProps> = ({ label, name, className = '', ...props }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      className={`block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
      {...props}
    />
  </div>
);

// ====================================================================
// 3. MOCK ApiService (Simula a API para testes)
// ====================================================================

// Dados simulados em memória para persistência simples
let MOCK_COMPANY_DATA: CompanyData = {
  id: '12345',
  cpfCnpj: '00.000.000/0001-00',
  name: 'LumenSys Soluções S.A.',
  tradeName: 'LumenSys Tecnologia',
  email: 'contato@lumensys.com.br',
  phone: '(11) 98765-4321',
  street: 'Rua das Inovações',
  number: '1000',
  neighborhood: 'Centro Empresarial',
  city: 'São Paulo',
  uf: 'SP',
  // Exemplo de logo em base64 (um pequeno SVG)
  logoBase64: 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI2FkYmZmYiI+PHBhdGggZD0yIDJjNS41MjMgMCAxMCA0LjQ3NyAxMCAxMHMtNC40NzcgMTAtMTAgMTBTMiAxNy41MjMgMiAxMmMwLTUuNTIzIDQuNDc3LTEwIDEwLTEwek0xMiA0YTMgMyAwIDEgMC0zIDMtMyAzIDAgMCAwIDMtM3ptMCA0YTcgNyAwIDEgMSAwIDE0LTVBNy4wMDkgNy4wMDkgMCAwIDEgMTIgOHoiLz48L3N2ZyA=',
  logoMimeType: 'image/svg+xml',
};

// Estrutura de resposta simulada (Axios-like)
const createMockResponse = (data: any, status: number = 200, message: string = 'Sucesso') => ({
  data: {
    data: data,
    message: message,
    code: 'Success',
  },
  status: status,
  statusText: 'OK',
});

const ApiService = () => {
  return {
    get: async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simula delay
      
      const parts = url.split('/');
      const id = parts[parts.length - 1];

      if (id === 'null' || id === 'undefined' || isNaN(parseInt(id, 10))) {
        // Simula o erro 400 que o usuário estava vendo para IDs inválidos
        return Promise.reject({
          response: {
            status: 400,
            data: { message: 'ID da empresa inválido ou mal formatado na URL.' }
          }
        });
      }
      
      if (id !== MOCK_COMPANY_DATA.id) {
        // Simula 404 para ID não encontrado
        return Promise.reject({
          response: {
            status: 404,
            data: { message: 'Empresa não encontrada.' }
          }
        });
      }

      return createMockResponse(MOCK_COMPANY_DATA);
    },
    put: async (url: string, data: any) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simula atualização
      Object.assign(MOCK_COMPANY_DATA, data);
      return createMockResponse(MOCK_COMPANY_DATA, 200, 'Empresa atualizada com sucesso!');
    },
    del: async (url: string) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Simula exclusão
      MOCK_COMPANY_DATA = {} as CompanyData; // Simula a remoção
      return createMockResponse(null, 200, 'Empresa excluída com sucesso!');
    }
  };
};

// ====================================================================
// 4. Componente Modal de Confirmação (Substitui window.confirm)
// ====================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  loading: boolean;
}

const ModalConfirmation: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  loading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full p-6 space-y-6 animate-in fade-in-50 duration-300">
        <div className="flex items-center gap-4">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        
        <p className="text-gray-600">{message}</p>
        
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm} 
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </Card>
    </div>
  );
};

// ====================================================================
// 5. Componente Principal (O CONTEÚDO DA PÁGINA)
// ====================================================================

const PerfilEmpresaContent = () => { // Renomeado para Content
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const companyIdString = searchParams.get('id'); // ID como string da URL

  // Tenta converter o ID para string válida ou null
  const companyId = useMemo(() => {
    if (!companyIdString) return null;
    const id = parseInt(companyIdString, 10);
    // Retorna o ID como string apenas se for um número válido (> 0)
    return isNaN(id) || id <= 0 ? null : companyIdString;
  }, [companyIdString]);
  
  const api = ApiService();

  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true); // Começa como true
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Estados para edição
  const [editedFields, setEditedFields] = useState<CompanyData>({
    cpfCnpj: '',
    name: '',
    tradeName: '',
    email: '',
    phone: '',
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    uf: '',
  });

  // Função de Carregamento
  const loadCompany = useCallback(async () => {
    if (!companyId) {
      setError('ID da empresa inválido ou não fornecido.');
      setLoading(false);
      return;
    }
    
    console.log(`DEBUG: Tentando carregar empresa com ID: ${companyId}`);
    
    // setLoading(true); // O estado inicial já faz isso, mas reativa em caso de recarga
    setError(null);
    
    try {
      // Endpoint: /api/v1/Company/{id}
      const response = await api.get(`api/v1/Company/${companyId}`); 
      const data = response.data.data; // Acessa o objeto 'data' dentro da Response do C#
      
      if (!data || Object.keys(data).length === 0) { // Verifica se o mock está vazio após exclusão
         throw new Error("Empresa não encontrada ou excluída.");
      }

      setCompany(data);
      setEditedFields(data);
      
      // Carregar preview da imagem se existir
      if (data.logoBase64 && data.logoMimeType) {
        setImagePreview(`data:${data.logoMimeType};base64,${data.logoBase64}`);
      } else {
        setImagePreview(null);
      }
    } catch (err: any) {
      const apiMessage = err.response?.data?.message;
      const defaultMessage = `Erro ao carregar empresa. Status: ${err.response?.status || 'network'}.`;
      
      setError(apiMessage || defaultMessage);
      console.error("Erro ao carregar empresa:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, [companyId, api]);

  // Carregar dados na montagem do componente
  useEffect(() => {
    if (companyId) {
      loadCompany();
    } else if (companyIdString) {
      // Se companyIdString existe mas companyId (numérico) é null
      setError('ID da empresa inválido.');
      setLoading(false);
    } else {
      setError('ID da empresa não fornecido.');
      setLoading(false);
    }
  }, [companyId, companyIdString, loadCompany]);

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

    setEditedFields({ ...editedFields, [name]: formattedValue });
  };
  
  // Funções fileToBase64 e handleImageUpload permanecem as mesmas
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
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    } catch (error) {
      setError('Erro ao processar a imagem');
    }
  };


  const handleUpdate = async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: any = {
        // Garante que o ID está sendo enviado no body do PUT
        id: parseInt(companyId, 10), 
        cpfCnpj: editedFields.cpfCnpj.replace(/\D/g, ''),
        name: editedFields.name,
        tradeName: editedFields.tradeName,
        email: editedFields.email,
        phone: editedFields.phone.replace(/\D/g, ''),
        street: editedFields.street,
        number: editedFields.number,
        neighborhood: editedFields.neighborhood,
        city: editedFields.city,
        uf: editedFields.uf,
      };

      // Lógica de imagem (permanece igual)
      if (newImageFile) {
        const base64 = await fileToBase64(newImageFile);
        updateData.logoBase64 = base64;
        updateData.logoMimeType = newImageFile.type;
      } else if (company?.logoBase64 && !newImageFile) {
        updateData.logoBase64 = company.logoBase64;
        updateData.logoMimeType = company.logoMimeType;
      } else {
        // Se a logo foi removida
        updateData.logoBase64 = null;
        updateData.logoMimeType = null;
      }
      
      // Endpoint: /api/v1/Company/{id}
      await api.put(`api/v1/Company/${companyId}`, updateData); 
      
      setSuccess('Empresa atualizada com sucesso!');
      setIsEditing(false);
      setNewImageFile(null);
      await loadCompany();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar empresa');
    } finally {
      setLoading(false);
    }
  };

  // Lógica de modal de exclusão
  const handleConfirmDelete = async () => {
    if (!companyId) return;
    
    setLoading(true);
    setError(null);
    setShowDeleteModal(false);

    try {
      // Endpoint: /api/v1/Company/{id}
      await api.del(`api/v1/Company/${companyId}`);
      // Em um ambiente real, você navegaria. Aqui, simulamos o erro de carregamento pós-exclusão.
      navigate('/listaempresas');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir empresa');
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteClick = () => {
      setShowDeleteModal(true);
  }

  const handleCancel = () => {
    setIsEditing(false);
    // Recarrega o estado original do company para editedFields
    if (company) {
        setEditedFields(company);
        if (company.logoBase64 && company.logoMimeType) {
            setImagePreview(`data:${company.logoMimeType};base64,${company.logoBase64}`);
        } else {
            setImagePreview(null);
        }
    }
    setNewImageFile(null);
    setError(null);
  };

  // Estados de carregamento e erro iniciais
  if (loading && !company) {
    return (
      <PageLayout title="Perfil da Empresa" subtitle="Carregando...">
        <Card>
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Carregando dados da empresa...</p>
          </div>
        </Card>
      </PageLayout>
    );
  }

  // Estado de erro irrecuperável (ID inválido/não fornecido ou erro 400 inicial)
  if (error && !company) {
    return (
      <PageLayout title="Perfil da Empresa" subtitle="Erro ao carregar">
        <Card className="bg-red-50 border border-red-200">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <Button
              variant="outline"
              onClick={() => navigate('/listaempresas')}
              className="mt-4 border-red-600 text-red-600 hover:bg-red-50"
            >
              Voltar para Lista
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <>
      <PageLayout
        title={isEditing ? 'Editar Empresa' : 'Perfil da Empresa'}
        subtitle={company?.tradeName || 'Detalhes da empresa'}
        actions={
          <div className="flex gap-3">
            <Button
              variant="outline"
              icon={Plus}
              onClick={() => navigate('/cadastroempresa')}
            >
              Nova Empresa
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/listaempresas')}
            >
              Voltar
            </Button>
          </div>
        }
      >
        {/* Mensagens de Feedback */}
        {error && (
          <Card className="bg-red-100 border border-red-300 mb-6">
            <div className="text-red-700 text-sm">⚠️ {error}</div>
          </Card>
        )}
        
        {success && (
          <Card className="bg-green-100 border border-green-300 mb-6">
            <div className="text-green-700 text-sm">✅ {success}</div>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Logo e Ações */}
          <div className="space-y-6">
            <Card>
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Logo da Empresa</h3>
                
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="mx-auto w-48 h-48 rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt={company?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <label className="cursor-pointer">
                          <Button variant="outline" size="sm" icon={Upload} className="w-full">
                            Alterar Imagem
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                            className="hidden"
                          />
                        </label>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setImagePreview(null);
                            setNewImageFile(null);
                          }}
                          className="text-gray-500 hover:bg-gray-100"
                        >
                          Remover
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mx-auto w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Building2 className="text-gray-400" size={64} />
                  </div>
                )}
              </div>
            </Card>

            {/* Card de Ações */}
            {!isEditing ? (
              <Card>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    icon={Edit2}
                    onClick={() => setIsEditing(true)}
                    className="w-full"
                  >
                    Editar Empresa
                  </Button>
                  <Button
                    variant="outline"
                    icon={Trash2}
                    onClick={handleDeleteClick}
                    disabled={loading}
                    className="w-full text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Excluir Empresa
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="space-y-3">
                  <Button
                    variant="primary"
                    icon={Save}
                    onClick={handleUpdate}
                    loading={loading}
                    className="w-full"
                  >
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outline"
                    icon={X}
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full"
                  >
                    Cancelar
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Coluna Direita - Informações */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informações Básicas */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Building2 size={20} />
                Informações da Empresa
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  {isEditing ? (
                    <InputField
                      label="CNPJ/CPF"
                      name="cpfCnpj"
                      value={editedFields.cpfCnpj}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">CNPJ/CPF</label>
                      <p className="text-gray-800 font-medium">{company?.cpfCnpj}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Razão Social"
                      name="name"
                      value={editedFields.name}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Razão Social</label>
                      <p className="text-gray-800 font-medium">{company?.name}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Nome Fantasia"
                      name="tradeName"
                      value={editedFields.tradeName}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Nome Fantasia</label>
                      <p className="text-gray-800 font-medium">{company?.tradeName}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Contato */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Mail size={20} />
                Contato
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {isEditing ? (
                    <InputField
                      label="E-mail"
                      name="email"
                      type="email"
                      value={editedFields.email}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Mail className="text-blue-600 mt-1" size={18} />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">E-mail</label>
                        <p className="text-gray-800">{company?.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Telefone"
                      name="phone"
                      value={editedFields.phone}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div className="flex items-start gap-3">
                      <Phone className="text-blue-600 mt-1" size={18} />
                      <div>
                        <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
                        <p className="text-gray-800">{company?.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Endereço */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin size={20} />
                Endereço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {isEditing ? (
                    <InputField
                      label="Rua/Avenida"
                      name="street"
                      value={editedFields.street}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Rua/Avenida</label>
                      <p className="text-gray-800">{company?.street}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Número"
                      name="number"
                      value={editedFields.number}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Número</label>
                      <p className="text-gray-800">{company?.number}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Bairro"
                      name="neighborhood"
                      value={editedFields.neighborhood}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Bairro</label>
                      <p className="text-gray-800">{company?.neighborhood}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="Cidade"
                      name="city"
                      value={editedFields.city}
                      onChange={handleChange}
                      required
                      className="focus:ring-blue-500"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Cidade</label>
                      <p className="text-gray-800">{company?.city}</p>
                    </div>
                  )}
                </div>

                <div>
                  {isEditing ? (
                    <InputField
                      label="UF"
                      name="uf"
                      value={editedFields.uf}
                      onChange={handleChange}
                      required
                      maxLength={2}
                      className="focus:ring-blue-500 uppercase"
                      disabled={loading}
                    />
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">UF</label>
                      <p className="text-gray-800">{company?.uf}</p>
                    </div>
                  )}
                </div>
              </div>

              {!isEditing && company && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-blue-600 mt-1" size={18} />
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Endereço Completo</label>
                      <p className="text-gray-800">
                        {company.street}, {company.number} - {company.neighborhood}
                        <br />
                        {company.city} - {company.uf}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </PageLayout>
      
      {/* Modal de Confirmação de Exclusão */}
      <ModalConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message={`Você tem certeza que deseja excluir a empresa "${company?.name || 'esta empresa'}"? Esta ação não poderá ser desfeita.`}
        confirmText="Excluir Permanentemente"
        loading={loading}
      />
    </>
  );
};

export default PerfilEmpresaContent;