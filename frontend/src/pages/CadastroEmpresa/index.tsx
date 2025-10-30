import React, { useState, useEffect, useRef } from "react";
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';
import Cookies from 'js-cookie';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Building2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

// Tipo interno do formulário
type CompanyData = {
  cpfCnpj: string;
  companyName: string; // mapeado para CompanyName no backend
  tradeName: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  uf: string; // será enviado como UF (maiúsculo)
  companyLogo?: File | null; // File para preview / envio como Base64
};

const initialFields: CompanyData = {
  cpfCnpj: "",
  companyName: "",
  tradeName: "",
  email: "",
  phone: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  uf: "",
  companyLogo: null,
};

// Componente reutilizável para mostrar logo (aceita Base64 string vindo do backend)
export interface CompanyLogoDisplayProps {
  companyLogoBytes?: string | null; // base64 string
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
export const CompanyLogoDisplay: React.FC<CompanyLogoDisplayProps> = ({
  companyLogoBytes,
  companyName,
  size = 'md',
  className = ''
}) => {
  const sizeClasses: Record<string, string> = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-32 h-32'
  };

  if (companyLogoBytes) {
    const imageUrl = `data:image/jpeg;base64,${companyLogoBytes}`;
    return (
      <img
        src={imageUrl}
        alt={`Logo da ${companyName}`}
        className={`${sizeClasses[size]} object-cover rounded-lg ${className}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
      <Building2 className="text-gray-400" size={size === 'sm' ? 16 : size === 'md' ? 24 : 32} />
    </div>
  );
};

const CadastroEmpresa: React.FC = () => {
  const api = ApiService();

  const [fields, setFields] = useState<CompanyData>(() => {
    const savedData = Cookies.get('companyFormData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        return { ...initialFields, ...parsed };
      } catch {
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleWrapperKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openFilePicker();
    }
  };

  // Converte File -> base64 (DataURL) e retorna apenas a parte base64 (sem prefix)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const res = reader.result as string;
        const base64 = res.split(',')[1] ?? '';
        resolve(base64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  // Converte um array de bytes (se backend retornar array numbers) para base64
  const byteArrayToBase64 = (arr: number[] | Uint8Array): string => {
    const u8 = arr instanceof Uint8Array ? arr : new Uint8Array(arr);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < u8.length; i += chunk) {
      binary += String.fromCharCode(...u8.subarray(i, i + chunk));
    }
    return btoa(binary);
  };

  // Salva dados no cookie (não salvar o File)
  useEffect(() => {
    const hasData = Object.values(fields).some(v => {
      if (v === null || v === undefined) return false;
      if (typeof v === 'string') return v.trim() !== '';
      if (v instanceof File) return false; // não conta para persistência
      return !!v;
    });

    if (hasData) {
      const dataToSave: Partial<CompanyData> = { ...fields };
      delete (dataToSave as any).companyLogo; // remover File do cookie
      Cookies.set('companyFormData', JSON.stringify(dataToSave), { expires: 1, secure: true, sameSite: 'strict' });
    } else {
      Cookies.remove('companyFormData');
    }
  }, [fields]);

  useEffect(() => {
    Cookies.set('lastVisitedPage', 'cadastro-empresa', { expires: 7 });
    Cookies.set('lastActivity', new Date().toISOString(), { expires: 1 });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formatted = value;

    if (name === 'cpfCnpj') {
      formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 18);
    } else if (name === 'phone') {
      formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .substring(0, 15);
    } else if (name === 'uf') {
      formatted = value.toUpperCase().substring(0, 2);
    }

    setFields(prev => ({ ...prev, [name]: formatted } as CompanyData));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const isEmpty = (key: keyof CompanyData) => !!(touched[key] && !fields[key]);

  const isValidCNPJ = (cnpj: string) => {
    const clean = cnpj.replace(/\D/g, '');
    return clean.length === 14;
  };

  const isValidEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const errors: string[] = [];
    const required: (keyof CompanyData)[] = ['cpfCnpj', 'companyName', 'tradeName', 'email', 'phone', 'street', 'number', 'neighborhood', 'city', 'uf'];

    required.forEach(k => {
      const v = fields[k];
      if (!v || (typeof v === 'string' && v.trim() === '')) {
        errors.push(`${getFieldLabel(k)} é obrigatório`);
      }
    });

    if (fields.cpfCnpj && !isValidCNPJ(fields.cpfCnpj)) errors.push('CNPJ deve ter 14 dígitos');
    if (fields.email && !isValidEmail(fields.email)) errors.push('Email deve ter um formato válido');
    if (fields.uf && fields.uf.length !== 2) errors.push('UF deve ter 2 caracteres');

    return errors;
  };

  const getFieldLabel = (key: keyof CompanyData): string => {
    const labels: Record<keyof CompanyData, string> = {
      cpfCnpj: 'CNPJ',
      companyName: 'Razão Social',
      tradeName: 'Nome Fantasia',
      email: 'Email',
      phone: 'Telefone',
      street: 'Rua',
      number: 'Número',
      neighborhood: 'Bairro',
      city: 'Cidade',
      uf: 'UF',
      companyLogo: 'Logo da Empresa'
    };
    return labels[key];
  };

  // Upload / preview
  const handleImageUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setError('Formato de imagem não suportado. Use JPEG, PNG, WebP ou SVG');
      return;
    }
    setFields(prev => ({ ...prev, companyLogo: file }));
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleImageUpload(f);
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
    setFields(prev => ({ ...prev, companyLogo: null }));
    setImagePreview(null);
  };

  // Submissão -> montar payload com chaves que o backend espera (PascalCase)
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
      const payload: any = {
        CpfCnpj: fields.cpfCnpj.replace(/\D/g, ''),
        CompanyName: fields.companyName,
        TradeName: fields.tradeName,
        Email: fields.email,
        Phone: fields.phone.replace(/\D/g, ''),
        Street: fields.street,
        Number: fields.number,
        Neighborhood: fields.neighborhood,
        City: fields.city,
        UF: fields.uf.toUpperCase(),
        CompanyLogo: null // será preenchido se houver imagem
      };

      if (fields.companyLogo) {
        // converter File -> base64
        const base64 = await fileToBase64(fields.companyLogo);
        // enviar como string Base64 (backend pode converter para byte[])
        payload.CompanyLogo = base64;
      }

      await api.post('api/v1/Company', payload);

      // ações pós-sucesso
      Cookies.remove('companyFormData');
      Cookies.set('lastCompanyRegistered', JSON.stringify({
        companyName: fields.companyName,
        tradeName: fields.tradeName,
        registeredAt: new Date().toISOString()
      }), { expires: 30 });

      const companiesCount = parseInt(Cookies.get('companiesRegisteredCount') || '0', 10);
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

      setTimeout(() => { window.location.href = '/listaempresas'; }, 2000);
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || 'Erro ao cadastrar empresa';
      const errorInfo = {
        timestamp: new Date().toISOString(),
        error: errMsg,
        endpoint: 'api/v1/Company',
        userAgent: navigator.userAgent
      };
      Cookies.set('lastError', JSON.stringify(errorInfo), { expires: 7 });
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  // Se for necessário carregar empresa existente e mostrar o logo (adaptável)
  const loadCompanyImage = async (companyId: string) => {
    try {
      const res = await api.get(`api/v1/Company/${companyId}`);
      const company = res.data;
      if (!company) return;

      // company.CompanyLogo pode vir como base64 string ou como array de bytes
      if (company.CompanyLogo) {
        let base64 = '';
        if (typeof company.CompanyLogo === 'string') {
          base64 = company.CompanyLogo;
        } else if (Array.isArray(company.CompanyLogo)) {
          base64 = byteArrayToBase64(company.CompanyLogo);
        }
        if (base64) {
          setImagePreview(`data:image/jpeg;base64,${base64}`);
        }
      }

      // opcional: preencher campos do form com os dados retornados
      // setFields(prev => ({ ...prev, ...mappedValuesFromCompany }));
    } catch (err) {
      console.error('Erro ao carregar empresa:', err);
    }
  };

  // utilitário de labels
  const stats = (() => {
    try {
      const s = Cookies.get('userStats');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  })();

  return (
    <PageLayout
      title="Cadastro de Empresa"
      subtitle="Registre uma nova empresa no sistema"
      actions={
        <Button variant="outline" icon={X} onClick={() => window.location.href = "/listaempresas"} disabled={loading}>
          Cancelar
        </Button>
      }
    >
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <div className="text-center space-y-4">
            <h3 className="text-lg font-semibold text-textPrimary flex items-center justify-center gap-2">
              <ImageIcon size={20} />
              Logo da Empresa
            </h3>

            <div
              className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${dragActive ? 'border-primary bg-primary/5 scale-105' : 'border-footer hover:border-primary/50 hover:bg-primary/5'}`}
              onDrop={handleImageDrop}
              onDragOver={handleImageDragOver}
              onDragLeave={handleImageDragLeave}
              onClick={openFilePicker}                /* abre o seletor ao clicar na área */
              tabIndex={0}                            /* permite foco pelo teclado */
              role="button"
              aria-label="Fazer upload do logo da empresa"
              onKeyDown={handleWrapperKeyDown}        /* abre com Enter/Space */
            >
              {/* input oculto reutilizável (abre o seletor do SO) */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
              />
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="mx-auto w-32 h-32 rounded-lg overflow-hidden bg-footer">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex gap-3 justify-center">
                    <Button variant="outline" size="sm" onClick={removeImage}>Remover</Button>
                    <label className="cursor-pointer">
                      <Button variant="ghost" size="sm" icon={Upload}>Alterar</Button>
                      <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="hidden" />
                    </label>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Upload className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-textPrimary font-medium">Arraste uma imagem ou clique para fazer upload</p>
                    <p className="text-textSecondary text-sm mt-1">PNG, JPG, WebP ou SVG até 5MB</p>
                  </div>
                  <label className="cursor-pointer">
                    <Button variant="outline" icon={Upload}>Escolher Arquivo</Button>
                    <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])} className="hidden" />
                  </label>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-6 flex items-center gap-2"><Building2 size={20} /> Informações da Empresa</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputField label="CNPJ/CPF" name="cpfCnpj" placeholder="00.000.000/0000-00" value={fields.cpfCnpj} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('cpfCnpj') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Razão Social" name="companyName" placeholder="Nome oficial da empresa" value={fields.companyName} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('companyName') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Nome Fantasia" name="tradeName" placeholder="Nome comercial" value={fields.tradeName} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('tradeName') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="E-mail" name="email" type="email" placeholder="contato@empresa.com" value={fields.email} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('email') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Telefone" name="phone" placeholder="(11) 99999-9999" value={fields.phone} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('phone') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-textPrimary mb-6">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <InputField label="Rua/Avenida" name="street" placeholder="Nome da rua" value={fields.street} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('street') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Número" name="number" placeholder="123" value={fields.number} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('number') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Bairro" name="neighborhood" placeholder="Centro" value={fields.neighborhood} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('neighborhood') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="Cidade" name="city" placeholder="São Paulo" value={fields.city} onChange={handleChange} onBlur={handleBlur} required className="focus:ring-primary text-textPrimary bg-background" />
              {isEmpty('city') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
            </div>

            <div>
              <InputField label="UF" name="uf" placeholder="SP" value={fields.uf} onChange={handleChange} onBlur={handleBlur} required maxLength={2} className="focus:ring-primary text-textPrimary bg-background uppercase" />
              {isEmpty('uf') && <span className="text-danger text-sm mt-1 block">Campo obrigatório</span>}
              {fields.uf && fields.uf.length !== 2 && touched.uf && <span className="text-danger text-sm mt-1 block">UF deve ter 2 caracteres</span>}
            </div>
          </div>
        </Card>

        {error && <Card className="bg-danger/10 border-danger/20"><div className="text-danger text-sm">⚠️ {error}</div></Card>}
        {success && <Card className="bg-success/10 border-success/20"><div className="text-success text-sm">✅ Empresa cadastrada com sucesso! Redirecionando...</div></Card>}

        <Card>
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button type="button" variant="outline" onClick={() => { setFields(initialFields); setTouched({}); setError(null); setImagePreview(null); Cookies.remove('companyFormData'); }} disabled={loading} icon={X}>Limpar Formulário</Button>
            <Button type="submit" variant="primary" loading={loading} icon={Save} size="lg">Cadastrar Empresa</Button>
          </div>
        </Card>
      </form>
    </PageLayout>
  );
};

export default CadastroEmpresa;