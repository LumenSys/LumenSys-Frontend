import React, { useMemo, useRef, useState } from 'react';
import PageLayout from '../../components/PageLayout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import InputField from '../../components/Input/InputField';
import ApiService from '../../services/apiService';
import Cookies from 'js-cookie';
import { Save, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

type FuneralPlanForm = {
  name: string;
  description: string;
  annualValue: string; // kept as string for controlled numeric input, will convert on submit
  monthlyValue: string;
  maxDependents: string;
  maxAge: string;
  dependentAdditional: string;
  available: boolean;
  benefitIds: number[]; // seleção múltipla
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
  benefitIds: []
};

const initialBenefitForm: BenefitFormState = {
  name: '',
  description: ''
};

const PlanosFunerarios: React.FC = () => {
  const api = useMemo(() => ApiService(), []);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = useState<FuneralPlanForm>(() => {
    const saved = Cookies.get('planFormData');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const benefitIds = Array.isArray(parsed?.benefitIds) ? parsed.benefitIds.map((n: any) => Number(n)).filter((n: number) => Number.isFinite(n)) : [];
        return {
          ...initialPlanForm,
          ...parsed,
          benefitIds
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

  // Se houver id na rota, carregar plano para visualização/edição
  const hasFetchedPlanRef = useRef(false);
  React.useEffect(() => {
    const loadPlanForEdit = async () => {
      if (!id) return;
      if (hasFetchedPlanRef.current) return; // evita chamadas duplicadas em StrictMode
      hasFetchedPlanRef.current = true;
      try {
        setLoading(true);
        setError(null);
        const resp = await api.get(`api/v1/FuneralPlans/${id}`);
        const data = resp?.data?.data ?? resp?.data ?? {};
        const toStr = (v: any) => (v == null ? '' : String(v));
        setForm({
          name: toStr(data?.name ?? data?.nome),
          description: toStr(data?.description ?? data?.descricao),
          annualValue: toStr(data?.annualValue ?? data?.valorAnual ?? ''),
          monthlyValue: toStr(data?.monthlyValue ?? data?.valorMensal ?? ''),
          maxDependents: toStr(data?.maxDependents ?? data?.maxDependente ?? '0'),
          maxAge: toStr(data?.maxAge ?? data?.idadeMaxima ?? ''),
          dependentAdditional: toStr(data?.dependentAdditional ?? data?.adicionalDependente ?? '0'),
          available: Boolean(data?.available ?? true),
          benefitIds: Array.isArray(data?.benefitsIds)
            ? data.benefitsIds.map((x: any) => Number(x)).filter((n: number) => Number.isFinite(n))
            : [],
        });
        // Buscar benefícios vinculados via BenefitsPlans, caso o payload do plano não traga a lista
        try {
          const relResp = await api.get('api/v1/BenefitsPlans');
          const relPayload = Array.isArray(relResp.data) ? relResp.data : (Array.isArray(relResp.data?.data) ? relResp.data.data : []);
          const planIdNum = Number(id);
          const linkedIds = (relPayload as any[])
            .filter((row) => Number(row?.funeralPlansId ?? row?.FuneralPlansId) === planIdNum)
            .map((row) => Number(row?.benefitsId ?? row?.BenefitsId))
            .filter((n) => Number.isFinite(n));
          if (linkedIds.length > 0) {
            setForm(prev => ({ ...prev, benefitIds: linkedIds }));
          }
        } catch (relErr) {
          // silencioso: se não conseguir carregar relações, mantém lista vazia
        }
        setActiveTab('plan');
      } catch (err: any) {
        console.error('Erro ao carregar plano:', err);
        const msg = err?.response?.data?.message || err.message || 'Não foi possível carregar o plano.';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };
    loadPlanForEdit();
  }, [api, id]);

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
      // Adiciona o benefício recém-criado à seleção do plano
      if (Number.isFinite(idNumber)) {
        setForm(prev => ({
          ...prev,
          benefitIds: prev.benefitIds.includes(idNumber) ? prev.benefitIds : [...prev.benefitIds, idNumber]
        }));
      }
      setActiveTab('plan');
    } catch (submitError: any) {
      console.error('Erro ao cadastrar benefício:', submitError);
      const message = submitError?.response?.data?.message || submitError.message || 'Erro ao cadastrar benefício.';
      setBenefitError(message);
    } finally {
      setBenefitSubmitting(false);
    }
  };

  const handleToggleBenefit = (benefitId: number) => {
    setForm(prev => {
      const exists = prev.benefitIds.includes(benefitId);
      const next = exists ? prev.benefitIds.filter(id => id !== benefitId) : [...prev.benefitIds, benefitId];
      return { ...prev, benefitIds: next };
    });
  };

  const handleAddBenefitToSelection = (benefitId: number) => {
    setForm(prev => (
      prev.benefitIds.includes(benefitId)
        ? prev
        : { ...prev, benefitIds: [...prev.benefitIds, benefitId] }
    ));
  };

  const handleClearBenefitSelection = () => {
    setForm(prev => ({ ...prev, benefitIds: [] }));
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
    // Benefícios são opcionais neste momento; não validar seleção
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
      benefitIds: form.benefitIds,
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
      const payload: any = {
        // Nome é imutável em edição; ainda incluímos para POST, removemos para PUT
        Name: form.name.trim(),
        Description: form.description.trim(),
        AnnualValue: Number(String(form.annualValue).replace(',', '.')),
        MonthlyValue: Number(String(form.monthlyValue).replace(',', '.')),
        MaxDependents: Number(form.maxDependents || 0),
        MaxAge: Number(form.maxAge || 0),
        DependentAdditional: Number(String(form.dependentAdditional).replace(',', '.')),
        Available: form.available
      };

      // Não enviar BenefitsIds no cadastro de FuneralPlans; vínculo será feito via BenefitsPlans

      const isEdit = Boolean(id);
      // Em edição, nome é bloqueado na UI, mas ainda enviado no JSON

      // 1) Criar ou atualizar plano
      const isEditId = Number(id);
      if (isEdit && Number.isFinite(isEditId) && isEditId > 0) {
        payload.Id = isEditId;
      }
      const planResponse = isEdit
        ? await api.put(`api/v1/FuneralPlans/${id}`, payload)
        : await api.post('api/v1/FuneralPlans', payload);
      const planData = planResponse?.data?.data ?? planResponse?.data ?? {};
      // Tentar múltiplas variações de nome/casing para o ID retornado pelo backend
      const planIdRaw = planData?.id ?? planData?.Id ?? planData?.funeralPlansId ?? planData?.FuneralPlansId ?? planData?.planId ?? planData?.PlanId;
      let planId = Number(planIdRaw);
      if ((!Number.isFinite(planId) || planId <= 0) && isEdit && Number.isFinite(isEditId) && isEditId > 0) {
        // Em PUT, alguns backends não retornam o objeto; usar o id da rota
        planId = isEditId;
      }
      // 2) Vincular benefícios ao plano através do endpoint BenefitsPlans, se houver seleção
      if (Number.isFinite(planId) && planId > 0 && Array.isArray(form.benefitIds) && form.benefitIds.length > 0) {
        const linkPayload = {
          FuneralPlansId: planId,
          BenefitsIds: form.benefitIds.map(n => Number(n))
        };
        await api.post('api/v1/BenefitsPlans', linkPayload);
      }

      // limpar cache local do formulário
      Cookies.remove('planFormData');
      setSuccess(true);
      // confirmação visual imediata
      try { window.alert('Plano cadastrado com sucesso!'); } catch {}
      setForm(initialPlanForm);
      setTimeout(() => navigate('/gerenciarPlanos'), 800);
    } catch (err: any) {
      // Tentar extrair mensagens de validação do backend
      const backend = err?.response?.data;
      const status = err?.response?.status;
      const validation = backend?.errors ? JSON.stringify(backend.errors) : null;
      const msgBase = backend?.message || err.message || 'Erro ao salvar plano funerário';
      const msg = status === 400 && validation ? `${msgBase} | ${validation}` : msgBase;
      setError(msg);
      try { window.alert(`Falha no cadastro do plano: ${msg}`); } catch {}
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout
      title="Cadastro de Planos Funerários"
      subtitle="Crie e gerencie os planos oferecidos"
      actions={
        <Button variant="outline" icon={X} onClick={() => navigate('/gerenciarPlanos')} disabled={loading || benefitSubmitting}>
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
                          onClick={() => { handleAddBenefitToSelection(benefit.id); setActiveTab('plan'); }}
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
                <InputField label="Nome do Plano" name="name" value={form.name} onChange={handleChange} required className="bg-background" disabled={Boolean(id)} />
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
              <h3 className="text-lg font-semibold text-textPrimary mb-4">Benefícios vinculados</h3>
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
                  {benefits.map((benefit) => {
                    const selected = form.benefitIds.includes(benefit.id);
                    return (
                      <label
                        key={benefit.id}
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition ${selected ? 'border-primary bg-primary/5 shadow-sm' : 'border-borderPrimary hover:border-primary/60'}`}
                      >
                        <input
                          type="checkbox"
                          name="benefitSelection"
                          value={benefit.id}
                          checked={selected}
                          onChange={() => handleToggleBenefit(benefit.id)}
                          className="mt-1 h-4 w-4 text-primary focus:ring-primary"
                        />
                        <div>
                          <p className="font-medium text-textPrimary">{benefit.name}</p>
                          {benefit.description && (
                            <p className="text-sm text-textSecondary mt-1">{benefit.description}</p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveTab('benefit')}>
                  Cadastrar novo benefício
                </Button>
                {Array.isArray(form.benefitIds) && form.benefitIds.length > 0 && (
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