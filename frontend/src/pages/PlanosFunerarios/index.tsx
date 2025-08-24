// src/pages/PlanosFunerarios/index.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  DollarSign, 
  Users, 
  Calendar, 
  FileText, 
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

// Tipo baseado no modelo FuneralPlans da API
type FuneralPlanData = {
  name: string;
  description: string;
  annualValue: number;
  available: boolean;
  maxDependents: number;
  maxAge: number;
  dependentAdditional: number;
  companyId?: number;
};

const initialFields: FuneralPlanData = {
  name: "",
  description: "",
  annualValue: 0,
  available: true,
  maxDependents: 0,
  maxAge: 65,
  dependentAdditional: 0,
};

const PlanosFunerarios: React.FC = () => {
  const navigate = useNavigate();
  const [fields, setFields] = useState<FuneralPlanData>(() => {
    // Recuperar dados salvos do localStorage
    const savedData = localStorage.getItem('funeralPlanFormData');
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

  const [touched, setTouched] = useState<{ [K in keyof FuneralPlanData]?: boolean }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Salvar dados automaticamente
  useEffect(() => {
    const hasData = Object.values(fields).some(value => 
      typeof value === 'string' ? value.trim() !== "" : value !== 0
    );
    
    if (hasData) {
      localStorage.setItem('funeralPlanFormData', JSON.stringify(fields));
    } else {
      localStorage.removeItem('funeralPlanFormData');
    }
  }, [fields]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFields(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFields(prev => ({ ...prev, [name]: numValue }));
    } else {
      setFields(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const isEmpty = (key: keyof FuneralPlanData) => {
    const value = fields[key];
    return touched[key] && (
      typeof value === 'string' ? !value.trim() : 
      typeof value === 'number' ? value === 0 : false
    );
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!fields.name.trim()) errors.push('Nome do plano é obrigatório');
    if (!fields.description.trim()) errors.push('Descrição é obrigatória');
    if (fields.annualValue <= 0) errors.push('Valor anual deve ser maior que zero');
    if (fields.maxDependents < 0) errors.push('Número de dependentes não pode ser negativo');
    if (fields.maxAge < 18) errors.push('Idade máxima deve ser pelo menos 18 anos');
    if (fields.dependentAdditional < 0) errors.push('Valor adicional por dependente não pode ser negativo');

    return errors;
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Aqui você faria a chamada real para a API
      // const response = await fetch('/api/funeralplans', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(fields),
      // });

      localStorage.removeItem('funeralPlanFormData');
      setSuccess(true);
      setFields(initialFields);
      setTouched({});

      setTimeout(() => {
        navigate('/GerenciarPlanos');
      }, 2000);

    } catch (err: any) {
      setError('Erro ao criar plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearForm = () => {
    setFields(initialFields);
    setTouched({});
    setError(null);
    setSuccess(false);
    localStorage.removeItem('funeralPlanFormData');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FileText className="text-blue-600" size={32} />
                Criar Novo Plano Funerário
              </h1>
              <p className="text-gray-600 mt-2">
                Configure os detalhes do plano funerário para seus clientes
              </p>
            </div>
            <button
              onClick={() => navigate('/GerenciarPlanos')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>
          </div>
        </div>

        {/* Auto-save indicator */}
        {localStorage.getItem('funeralPlanFormData') && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg mb-6 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} />
              <span>Dados do formulário foram recuperados automaticamente</span>
            </div>
            <button
              onClick={handleClearForm}
              className="text-amber-600 underline hover:text-amber-800"
            >
              Limpar tudo
            </button>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <CheckCircle size={20} />
            Plano criado com sucesso! Redirecionando...
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertCircle size={20} />
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Informações Básicas
                </h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Plano *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={fields.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Ex: Plano Básico, Plano Premium..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                  {isEmpty("name") && (
                    <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Campo obrigatório
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    name="description"
                    value={fields.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Descreva os benefícios e características do plano..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    required
                  />
                  {isEmpty("description") && (
                    <span className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle size={16} />
                      Campo obrigatório
                    </span>
                  )}
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <DollarSign size={20} className="text-green-600" />
                  Informações Financeiras
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Anual (R$) *
                    </label>
                    <input
                      type="number"
                      name="annualValue"
                      value={fields.annualValue || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                    {fields.annualValue > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        Valor mensal: {formatCurrency(fields.annualValue / 12)}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adicional por Dependente (R$)
                    </label>
                    <input
                      type="number"
                      name="dependentAdditional"
                      value={fields.dependentAdditional || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Coverage Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                  <Users size={20} className="text-purple-600" />
                  Cobertura e Limites
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Dependentes
                    </label>
                    <input
                      type="number"
                      name="maxDependents"
                      value={fields.maxDependents || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} />
                      Idade Máxima (anos)
                    </label>
                    <input
                      type="number"
                      name="maxAge"
                      value={fields.maxAge || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="65"
                      min="18"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Disponibilidade
                </h3>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="available"
                    checked={fields.available}
                    onChange={handleChange}
                    className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Plano disponível para contratação
                  </label>
                </div>
                <p className="text-sm text-gray-500">
                  Planos indisponíveis não aparecerão para novos clientes
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/GerenciarPlanos')}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  disabled={loading}
                >
                  Cancelar
                </button>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Criar Plano
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview do Plano</h3>
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {showPreview && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg">
                    <h4 className="font-bold text-lg">
                      {fields.name || 'Nome do Plano'}
                    </h4>
                    <p className="text-blue-100 text-sm mt-1">
                      {fields.available ? 'Disponível' : 'Indisponível'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Descrição:</p>
                      <p className="text-gray-900">
                        {fields.description || 'Descrição do plano...'}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">Valor Anual</p>
                        <p className="text-green-800 font-bold">
                          {formatCurrency(fields.annualValue)}
                        </p>
                      </div>
                      
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">Valor Mensal</p>
                        <p className="text-blue-800 font-bold">
                          {formatCurrency(fields.annualValue / 12)}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Max. Dependentes:</span>
                        <span className="font-medium">{fields.maxDependents}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Idade Máxima:</span>
                        <span className="font-medium">{fields.maxAge} anos</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Adicional/Dependente:</span>
                        <span className="font-medium">{formatCurrency(fields.dependentAdditional)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanosFunerarios;