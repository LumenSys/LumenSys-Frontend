import React, { useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';
import Cookies from 'js-cookie';
import { Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type FuneralPlanForm = {
  name: string;
  description: string;
  annualValue: string; // kept as string for controlled numeric input, will convert on submit
  monthlyValue: string;
  maxDependents: string;
  maxAge: string;
  dependentAdditional: string;
  available: boolean;
  benefitId: number | null;
};

type BenefitFormState = {
  name: string;
  description: string;
};

type BenefitItem = {
  id: number;
  name: string;
  description?: string;
};

const initialPlanForm: FuneralPlanForm = {
  name: '',
  description: '',
  annualValue: '',
  monthlyValue: '',
  maxDependents: '0',
  maxAge: '',
  dependentAdditional: '0',
  available: true,
  benefitId: null
};

const initialBenefitForm: BenefitFormState = {
  name: '',
  description: ''
};

const PlanosFunerarios: React.FC = () => {
  const api = ApiService();
  const navigate = useNavigate();

  const [form, setForm] = useState<FuneralPlanForm>(() => {
    const saved = Cookies.get('planFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const benefitId = parsed?.benefitId != null ? Number(parsed.benefitId) : null;
        return {
          ...initialPlanForm,
          ...parsed,
          benefitId: Number.isFinite(benefitId) ? benefitId : null
        };
      } catch {
        return initialPlanForm;
      }
    }
    return initialPlanForm;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'benefit' | 'plan'>('benefit');
  const [benefitForm, setBenefitForm] = useState<BenefitFormState>(initialBenefitForm);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [benefitsLoading, setBenefitsLoading] = useState(false);
  const [benefitSubmitting, setBenefitSubmitting] = useState(false);
  const [benefitError, setBenefitError] = useState<string | null>(null);
  const [benefitSuccess, setBenefitSuccess] = useState<string | null>(null);
  const [benefitsFetchError, setBenefitsFetchError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleAvailable = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, available: e.target.checked }));
  };

  const handleBenefitFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBenefitForm(prev => ({ ...prev, [name]: value }));
  };

  const loadBenefits = React.useCallback(async () => {
    setBenefitsLoading(true);
    setBenefitsFetchError(null);

    try {
      const response = await api.get('api/v1/Benefits');
      const payload = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];

      const normalized: BenefitItem[] = (payload as any[]).reduce<BenefitItem[]>((acc, raw) => {
        const rawId = raw?.id ?? raw?.benefitId ?? raw?.BenefitId;
        const idNumber = Number(rawId);
        if (!Number.isFinite(idNumber)) {
          return acc;
        }

        acc.push({
          id: idNumber,
          name: raw?.name ?? raw?.title ?? raw?.benefit ?? 'Benefício sem nome',
          description: raw?.description ?? raw?.details ?? ''
        });
        return acc;
      }, []);

      setBenefits(normalized);
    } catch (loadError: any) {
      console.error('Erro ao carregar benefícios:', loadError);
      const message = loadError?.response?.data?.message || loadError.message || 'Não foi possível carregar os benefícios cadastrados.';
      setBenefitsFetchError(message);
    } finally {
      setBenefitsLoading(false);
    }
  }, [api]);

  React.useEffect(() => {
    loadBenefits();
  }, [loadBenefits]);

  const handleBenefitSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setBenefitError(null);
    setBenefitSuccess(null);

    if (!benefitForm.name.trim()) {
      setBenefitError('Nome do benefício é obrigatório.');
      return;
    }

    if (!benefitForm.description.trim()) {
      setBenefitError('Descrição do benefício é obrigatória.');
      return;
    }

    setBenefitSubmitting(true);

    try {
      const payload = {
        Name: benefitForm.name.trim(),
        Description: benefitForm.description.trim()
      };

      const response = await api.post('api/v1/Benefits', payload);
      const data = response?.data?.data ?? response?.data ?? {};
      const rawId = data?.id ?? data?.benefitId ?? data?.BenefitId;
      const idNumber = Number(rawId);
      const normalizedId = Number.isFinite(idNumber) ? idNumber : Date.now();

      const created: BenefitItem = {
        id: normalizedId,
        name: data?.name ?? data?.title ?? payload.Name,
        description: data?.description ?? payload.Description
      };

      setBenefits(prev => {
        const withoutDuplicated = prev.filter(item => item.id !== created.id);
        return [...withoutDuplicated, created];
      });

      setBenefitSuccess('Benefício cadastrado com sucesso.');
      setBenefitForm(initialBenefitForm);
      setForm(prev => ({ ...prev, benefitId: Number.isFinite(idNumber) ? idNumber : prev.benefitId }));
      setActiveTab('plan');
    } catch (submitError: any) {
      console.error('Erro ao cadastrar benefício:', submitError);
      const message = submitError?.response?.data?.message || submitError.message || 'Erro ao cadastrar benefício.';
      setBenefitError(message);
    } finally {
      setBenefitSubmitting(false);
    }
  };

  const handleSelectBenefit = (benefitId: number) => {
    setForm(prev => ({ ...prev, benefitId }));
  };

  const handleClearBenefitSelection = () => {
    setForm(prev => ({ ...prev, benefitId: null }));
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!form.name.trim()) errs.push('Nome do plano é obrigatório.');
    if (!form.description.trim()) errs.push('Descrição é obrigatória.');
    const toPositiveNumber = (v: string) => {
      const n = Number(String(v).replace(',', '.'));
      return !isNaN(n) && isFinite(n) && n >= 0;
    };
    if (form.annualValue === '' || !toPositiveNumber(form.annualValue)) errs.push('Valor anual inválido.');
    if (form.monthlyValue === '' || !toPositiveNumber(form.monthlyValue)) errs.push('Valor mensal inválido.');
    if (form.maxDependents === '' || isNaN(Number(form.maxDependents)) || Number(form.maxDependents) < 0) errs.push('Máximo de dependentes inválido.');
    if (form.maxAge === '' || isNaN(Number(form.maxAge)) || Number(form.maxAge) < 0) errs.push('Idade máxima inválida.');
    if (form.dependentAdditional === '' || !toPositiveNumber(form.dependentAdditional)) errs.push('Adicional por dependente inválido.');
    if (form.benefitId == null) errs.push('Selecione ou cadastre um benefício para o plano.');
    return errs;
  };

  // persist minimal form state (optional)
  React.useEffect(() => {
    const saved = {
      name: form.name,
      description: form.description,
      annualValue: form.annualValue,
      monthlyValue: form.monthlyValue,
      maxDependents: form.maxDependents,
      maxAge: form.maxAge,
      dependentAdditional: form.dependentAdditional,
      available: form.available,
      benefitId: form.benefitId,
    };
    Cookies.set('planFormData', JSON.stringify(saved), { expires: 1 });
  }, [form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const errs = validate();
    if (errs.length > 0) {
      setError(errs.join(' '));
      return;
    }

    setLoading(true);
    try {
      const payload = {
        Name: form.name.trim(),
        Description: form.description.trim(),
        AnnualValue: Number(String(form.annualValue).replace(',', '.')),
        MonthlyValue: Number(String(form.monthlyValue).replace(',', '.')),
        MaxDependents: Number(form.maxDependents || 0),
        MaxAge: Number(form.maxAge || 0),
        DependentAdditional: Number(String(form.dependentAdditional).replace(',', '.')),
        Available: form.available
      };

      const planResponse = await api.post('api/v1/FuneralPlans', payload);
      const planData = planResponse?.data?.data ?? planResponse?.data ?? {};
      const planIdRaw = planData?.id ?? planData?.funeralPlansId ?? planData?.planId;
      const planId = Number(planIdRaw);

      if (form.benefitId != null) {
        if (!Number.isFinite(planId)) {
          throw new Error('Plano cadastrado, porém a API não retornou um identificador válido para vincular o benefício.');
        }

        try {
          await api.post('api/v1/BenefitsPlans', {
            benefitsId: form.benefitId,
            funeralPlansId: planId
          });
        } catch (linkError: any) {
          console.error('Erro ao vincular benefício ao plano:', linkError);
          const linkMessage = linkError?.response?.data?.message || linkError.message || 'Não foi possível vincular o benefício ao plano.';
          throw new Error(`Plano criado, mas houve um problema ao vincular o benefício: ${linkMessage}`);
        }
      }

      // limpar cache local do formulário
      Cookies.remove('planFormData');
      setSuccess(true);
      setForm(initialPlanForm);
      setTimeout(() => navigate('/planosfunerarios'), 1200);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || 'Erro ao salvar plano funerário';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Cadastro de Planos Funerários"
      subtitle="Crie e gerencie os planos oferecidos"
      actions={
        <Button variant="outline" icon={X} onClick={() => navigate('/gerenciarplanos')} disabled={loading || benefitSubmitting}>
          Voltar
        </Button>
      }
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setActiveTab('benefit')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${activeTab === 'benefit' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-background text-textPrimary border-borderPrimary hover:border-primary/60'}`}
        >
          Cadastro de Benefício
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('plan')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${activeTab === 'plan' ? 'bg-primary text-white border-primary shadow-sm' : 'bg-background text-textPrimary border-borderPrimary hover:border-primary/60'}`}
        >
          Cadastro de Plano
        </button>
      </div>

      {activeTab === 'benefit' ? (
        <>
          {benefitError && (
            <Card className="bg-danger/10 border-danger/20">
              <div className="text-danger text-sm">⚠️ {benefitError}</div>
            </Card>
          )}
          {benefitSuccess && (
            <Card className="bg-success/10 border-success/20">
              <div className="text-success text-sm">✅ {benefitSuccess}</div>
            </Card>
          )}
          {benefitsFetchError && (
            <Card className="bg-danger/10 border-danger/20">
              <div className="text-danger text-sm">⚠️ {benefitsFetchError}</div>
            </Card>
          )}

          <form onSubmit={handleBenefitSubmit} className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-textPrimary mb-4">Dados do Benefício</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField
                  label="Nome do Benefício"
                  name="name"
                  value={benefitForm.name}
                  onChange={handleBenefitFormChange}
                  required
                  className="bg-background"
                />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-textPrimary block mb-1">Descrição do Benefício</label>
                  <textarea
                    name="description"
                    value={benefitForm.description}
                    onChange={handleBenefitFormChange}
                    rows={4}
                    className="w-full rounded-lg border border-borderPrimary bg-background px-3 py-2 text-sm text-textPrimary transition focus:border-primary focus:outline-none"
                    placeholder="Explique detalhadamente o benefício oferecido"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <p className="text-sm text-textSecondary">
                  Após salvar o benefício, selecione-o na aba de plano para finalizar o cadastro.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    icon={X}
                    onClick={() => setBenefitForm(initialBenefitForm)}
                    disabled={benefitSubmitting}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    icon={Save}
                    loading={benefitSubmitting}
                  >
                    Salvar Benefício
                  </Button>
                </div>
              </div>
            </Card>

            <Card>
              <h4 className="text-md font-semibold text-textPrimary mb-4">Benefícios cadastrados</h4>
              {benefitsLoading ? (
                <p className="text-sm text-textSecondary">Carregando benefícios...</p>
              ) : benefits.length === 0 ? (
                <p className="text-sm text-textSecondary">Nenhum benefício cadastrado até o momento.</p>
              ) : (
                <div className="space-y-3">
                  {benefits.map((benefit) => (
                    <div
                      key={benefit.id}
                      className="border border-borderPrimary rounded-lg p-4 bg-background flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-textPrimary">{benefit.name}</p>
                        {benefit.description && (
                          <p className="text-sm text-textSecondary mt-1">{benefit.description}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            handleSelectBenefit(benefit.id);
                            setActiveTab('plan');
                          }}
                        >
                          Utilizar no plano
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </form>
        </>
      ) : (
        <>
          {error && (
            <Card className="bg-danger/10 border-danger/20">
              <div className="text-danger text-sm">⚠️ {error}</div>
            </Card>
          )}
          {success && (
            <Card className="bg-success/10 border-success/20">
              <div className="text-success text-sm">✅ Plano cadastrado com sucesso!</div>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-textPrimary mb-4">Dados do Plano</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="Nome do Plano" name="name" value={form.name} onChange={handleChange} required className="bg-background" />
                <InputField label="Valor Mensal" name="monthlyValue" value={form.monthlyValue} onChange={handleChange} required className="bg-background" />
                <InputField label="Valor Anual" name="annualValue" value={form.annualValue} onChange={handleChange} required className="bg-background" />
                <InputField label="Máx. Dependentes" name="maxDependents" type="number" value={form.maxDependents} onChange={handleChange} className="bg-background" />
                <InputField label="Idade Máx." name="maxAge" type="number" value={form.maxAge} onChange={handleChange} className="bg-background" />
                <InputField label="Adicional por Dependente" name="dependentAdditional" value={form.dependentAdditional} onChange={handleChange} className="bg-background" />
                <div className="md:col-span-2 flex items-center">
                  <label htmlFor="plan-available" className="flex items-center gap-3 text-sm text-textPrimary">
                    <input
                      id="plan-available"
                      type="checkbox"
                      checked={form.available}
                      onChange={handleToggleAvailable}
                      className="h-4 w-4 rounded border border-borderPrimary accent-primary focus:outline-none"
                    />
                    Atualizar plano como disponível para contratação
                  </label>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-textPrimary block mb-1">Descrição do Plano</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full rounded-lg border border-borderPrimary bg-background px-3 py-2 text-sm text-textPrimary transition focus:border-primary focus:outline-none"
                    placeholder="Inclua uma visão geral sobre o plano e seu público alvo"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-textPrimary mb-4">Benefício vinculado</h3>
              {benefitsLoading ? (
                <p className="text-sm text-textSecondary">Carregando benefícios cadastrados...</p>
              ) : benefitsFetchError ? (
                <div className="rounded-lg border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
                  {benefitsFetchError}
                  <div className="mt-3">
                    <Button type="button" variant="outline" onClick={loadBenefits}>
                      Tentar novamente
                    </Button>
                  </div>
                </div>
              ) : benefits.length === 0 ? (
                <div className="rounded-lg border border-dashed border-borderPrimary bg-background p-4 text-sm text-textSecondary">
                  Nenhum benefício cadastrado. Cadastre um benefício na aba "Cadastro de Benefício" antes de salvar o plano.
                  <div className="mt-3">
                    <Button type="button" variant="outline" onClick={() => setActiveTab('benefit')}>
                      Ir para benefícios
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {benefits.map((benefit) => (
                    <label
                      key={benefit.id}
                      className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${form.benefitId === benefit.id ? 'border-primary bg-primary/5 shadow-sm' : 'border-borderPrimary hover:border-primary/60'}`}
                    >
                      <input
                        type="radio"
                        name="benefitSelection"
                        value={benefit.id}
                        checked={form.benefitId === benefit.id}
                        onChange={() => handleSelectBenefit(benefit.id)}
                        className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                      />
                      <div>
                        <p className="font-medium text-textPrimary">{benefit.name}</p>
                        {benefit.description && (
                          <p className="text-sm text-textSecondary mt-1">{benefit.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveTab('benefit')}>
                  Cadastrar novo benefício
                </Button>
                {form.benefitId != null && (
                  <Button type="button" variant="ghost" onClick={handleClearBenefitSelection}>
                    Remover seleção
                  </Button>
                )}
              </div>
            </Card>

            <Card>
              <div className="flex flex-wrap gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => { setForm(initialPlanForm); Cookies.remove('planFormData'); }}
                  disabled={loading}
                  icon={X}
                >
                  Limpar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  icon={Save}
                >
                  Salvar Plano
                </Button>
              </div>
            </Card>
          </form>
        </>
      )}
    </PageLayout>
  );
};

export default PlanosFunerarios;