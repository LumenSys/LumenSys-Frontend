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
};

const initial: FuneralPlanForm = {
  name: '',
  description: '',
  annualValue: '',
  monthlyValue: '',
  maxDependents: '0',
  maxAge: '',
  dependentAdditional: '0'
};

const PlanosFunerarios: React.FC = () => {
  const api = ApiService();
  const navigate = useNavigate();

  const [form, setForm] = useState<FuneralPlanForm>(() => {
    const saved = Cookies.get('planFormData');
    if (saved) {
      try { return { ...initial, ...JSON.parse(saved) }; } catch { return initial; }
    }
    return initial;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
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
      dependentAdditional: form.dependentAdditional
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
        DependentAdditional: Number(String(form.dependentAdditional).replace(',', '.'))
      };

      // Altere o endpoint se o backend usar outro path (ex: api/v1/Plan)
      await api.post('api/v1/PlanosFunerarios', payload);

      // limpar cache local do formulário
      Cookies.remove('planFormData');
      setSuccess(true);
      setForm(initial);
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
        <Button variant="outline" icon={X} onClick={() => navigate('/gerenciarplanos')} disabled={loading}>
          Voltar
        </Button>
      }
    >
      {error && <Card className="bg-danger/10 border-danger/20"><div className="text-danger text-sm">⚠️ {error}</div></Card>}
      {success && <Card className="bg-success/10 border-success/20"><div className="text-success text-sm">✅ Plano cadastrado com sucesso!</div></Card>}

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
            <div className="md:col-span-2">
              <InputField label="Descrição" name="description" value={form.description} onChange={handleChange} textarea rows={4} className="bg-background" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => { setForm(initial); Cookies.remove('planFormData'); }} disabled={loading} icon={X}>Limpar</Button>
            <Button type="submit" variant="primary" loading={loading} icon={Save}>Salvar Plano</Button>
          </div>
        </Card>
      </form>
    </PageLayout>
  );
};

export default PlanosFunerarios;