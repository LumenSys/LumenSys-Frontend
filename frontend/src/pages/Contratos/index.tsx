import { SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ClipboardList, Plus } from "lucide-react";

import api from "../../services/apiService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import PageLayout from "../../components/PageLayout";
import InputField from "../../components/Input/InputField";

interface Client {
  id: number;
  companyId: number;
  name: string;
  email: string;
  cpf?: string;
}

interface PlanosFunerarios {
  id: number;
  name: string;
  monthlyAmount: number;
  annualAmount: number;
}

const Contratos = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<PlanosFunerarios[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentCompanyId, setCurrentCompanyId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [dependentCount, setDependentCount] = useState<number>(0);
  const { id } = useParams();
  const editingId = useMemo(() => {
    const parsed = Number(id);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  }, [id]);

  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
  // contrato auto-gerado no backend; não manter número manual

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === (selectedClientId ?? -1)) ?? null,
    [clients, selectedClientId]
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === (selectedPlanId ?? -1)) ?? null,
    [plans, selectedPlanId]
  );

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const apiService = api();
      const [clientsResponse, plansResponse] = await Promise.all([
        apiService.get("api/v1/Client"),
        apiService.get("api/v1/FuneralPlans"),
      ]);

      const rawClients = Array.isArray(clientsResponse.data)
        ? clientsResponse.data
        : Array.isArray(clientsResponse.data?.data)
          ? clientsResponse.data.data
          : [];

      const rawPlans = Array.isArray(plansResponse.data)
        ? plansResponse.data
        : Array.isArray(plansResponse.data?.data)
          ? plansResponse.data.data
          : [];

      const normalizedClients: Client[] = rawClients.map((client: any) => ({
        id: Number(client.id ?? client.clientId ?? client.clienteId ?? 0),
        companyId: Number(client.companyId ?? client.company?.id ?? client.empresaId ?? 0),
        name: client.name ?? "Cliente sem nome",
        email: client.email ?? "",
        cpf: client.cpf ?? client.document ?? undefined,
      })).filter((client: Client) => Number.isFinite(client.id) && client.id > 0);

      const normalizedPlans: PlanosFunerarios[] = rawPlans.map((plan: any) => ({
        id: Number(plan.id ?? plan.planId ?? 0),
        name: plan.name ?? plan.title ?? "Plano sem nome",
        monthlyAmount: Number(plan.monthlyAmount ?? plan.monthlyValue ?? 0),
        annualAmount: Number(plan.annualAmount ?? plan.annualValue ?? 0),
      })).filter((plan: PlanosFunerarios) => Number.isFinite(plan.id) && plan.id > 0);

      setClients(normalizedClients.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")));
      setPlans(normalizedPlans.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")));

    } catch (loadError: any) {
      console.error("Erro ao carregar dados para contratos:", loadError);
      const message = loadError?.response?.data?.message || loadError.message || "Não foi possível carregar clientes e planos. Tente novamente.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadExistingContract = useCallback(async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      setError(null);
      const apiService = api();
      const resp = await apiService.get(`api/v1/Contracts/${editingId}`);
      const data = Array.isArray(resp.data) ? resp.data[0] : (resp.data?.data ?? resp.data);
      const clientId = Number(data?.clientId ?? data?.client?.id ?? 0);
      const planId = Number(data?.funeralPlanId ?? data?.planId ?? data?.funeralPlans?.id ?? 0);
      const activeRaw = data?.isActive ?? data?.ativo ?? data?.status ?? true;
      const active = typeof activeRaw === 'boolean' ? activeRaw
        : typeof activeRaw === 'number' ? activeRaw === 1
        : typeof activeRaw === 'string' ? ['ativo','active','true','1'].includes(activeRaw.toLowerCase())
        : true;
      if (Number.isFinite(clientId) && clientId > 0) setSelectedClientId(clientId);
      if (Number.isFinite(planId) && planId > 0) setSelectedPlanId(planId);
      setIsActive(active);
      const dep = Number(data?.dependentCount ?? data?.dependentes ?? 0);
      setDependentCount(Number.isFinite(dep) && dep >= 0 ? dep : 0);
    } catch (err: any) {
      console.error("Erro ao carregar contrato para edição:", err);
      const message = err?.response?.data?.message || err.message || "Não foi possível carregar o contrato.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [editingId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadExistingContract();
  }, [loadExistingContract]);

  useEffect(() => {
    const savedClientId = localStorage.getItem("contract_client_id");
    const savedPlanId = localStorage.getItem("contract_plan_id");

    if (savedClientId) {
      const parsed = Number(savedClientId);
      setSelectedClientId(Number.isFinite(parsed) ? parsed : null);
    }

    if (savedPlanId) {
      const parsed = Number(savedPlanId);
      setSelectedPlanId(Number.isFinite(parsed) ? parsed : null);
    }

  }, []);

  useEffect(() => {
    if (selectedClientId !== null) {
      localStorage.setItem("contract_client_id", String(selectedClientId));
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedPlanId !== null) {
      localStorage.setItem("contract_plan_id", String(selectedPlanId));
    }
  }, [selectedPlanId]);

  // não persistir número de contrato (removido)

  // auto-ocultar mensagens de sucesso/erro após 5 segundos
  useEffect(() => {
    if (!successMessage && !error) return;
    const timer = setTimeout(() => {
      setSuccessMessage(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [successMessage, error]);

  const handleSubmit = async () => {
    if (!selectedClient || !selectedPlan) {
      return;
    }

    const newPayload = {
      // incluir id do contrato quando for edição
      ...(editingId ? { Id: editingId } : {}),
      ClientId: selectedClient.id,
      CompanyId: currentCompanyId ?? selectedClient.companyId,
      FuneralPlanId: selectedPlanId ?? selectedPlan.id,
      DependentCount: dependentCount,
      IsActive: isActive,
      initialDate: new Date().toISOString(),
    };

    const apiService = api();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const resp = editingId
        ? await apiService.put(`api/v1/Contracts/${editingId}`, newPayload)
        : await apiService.post("api/v1/Contracts", newPayload);
      const ok = resp?.status && resp.status >= 200 && resp.status < 300;
      if (ok) {
        setSuccessMessage(editingId ? "Contrato atualizado com sucesso!" : "Contrato criado com sucesso!");
        // reload lists elsewhere if needed
      } else {
        setError(editingId ? "Não foi possível atualizar o contrato." : "Não foi possível criar o contrato.");
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || (editingId ? "Erro ao atualizar contrato" : "Erro ao criar contrato");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const renderSummaryCard = (label: string, amount: number, helper?: string) => (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-textSecondary">{label}</span>
      <span className="text-2xl font-semibold text-textPrimary">{formatCurrency(amount)}</span>
      {helper && <span className="text-sm text-textSecondary">{helper}</span>}
    </div>
  );

  return (
    <PageLayout title={editingId ? "Editar contrato" : "Criar contrato"} subtitle="Use cadastros existentes para prever IDs automaticamente">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6 p-6">
          <div>
            <p className="text-sm font-semibold text-textSecondary">Informações do contrato</p>
            <p className="text-sm text-textPrimary">
              A empresa e o cliente vinculados à apólice serão preenchidos quando você escolher um cadastro.
            </p>
            {error && (
              <p className="mt-2 text-sm text-danger">⚠️ {error}</p>
            )}
          </div>

            <div className="space-y-4">
              <label className="flex flex-col gap-1 text-sm font-medium">
                Cliente
                <select
                  className="rounded-lg border border-borderPrimary bg-background p-3 text-sm text-textPrimary"
                  value={selectedClientId ?? ""}
                  onChange={(event) => {
                    const v = Number(event.target.value);
                    setSelectedClientId(Number.isFinite(v) ? v : null);
                  }}
                  disabled={loading}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.name} — {client.cpf ?? client.email}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium">
                Plano funerário
                <select
                  className="rounded-lg border border-borderPrimary bg-background p-3 text-sm text-textPrimary"
                  value={selectedPlanId ?? ""}
                  onChange={(event) => {
                    const v = Number(event.target.value);
                    setSelectedPlanId(Number.isFinite(v) ? v : null);
                  }}
                  disabled={loading}
                >
                  <option value="">Selecione um plano</option>
                  {plans.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="flex flex-col gap-1 text-sm font-medium">
                Quantidade de dependentes
                <input
                  type="number"
                  min={0}
                  value={dependentCount}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setDependentCount(Number.isFinite(v) && v >= 0 ? v : 0);
                  }}
                  className="rounded-lg border border-borderPrimary bg-background p-3 text-sm text-textPrimary"
                />
              </label>

              {/* Número de contrato removido: gerado no backend */}
            </div>

          <div className="flex items-center gap-3 text-sm text-textSecondary">
            <ClipboardList size={18} />
            <span>O cliente e a empresa são auto preenchidos a partir do cadastro escolhido.</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="flex-1" variant="outline" onClick={handleSubmit} icon={Plus}>
              Salvar contrato
            </Button>
            <Button className="flex-1" variant="outline" onClick={loadData} disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar cadastros"}
            </Button>
            <Button className="flex-1" variant="outline">
              Limpar formulário
            </Button>
          </div>

          <div className="mt-4">
            <label className="inline-flex items-center gap-3 text-sm text-textPrimary">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="h-4 w-4 rounded border border-borderPrimary accent-primary focus:outline-none"
              />
              Manter contrato ativo
            </label>
          </div>

          {successMessage && (
            <p className="mt-2 text-sm text-success">✅ {successMessage}</p>
          )}
          {error && (
            <p className="mt-2 text-sm text-danger">⚠️ {error}</p>
          )}
        </Card>

        <Card className="space-y-6 p-6">
          <div className="text-sm font-semibold text-textSecondary">Resumo do plano</div>
          {loading && (
            <p className="text-sm text-textSecondary">Carregando informações...</p>
          )}
          {selectedPlan ? (
            <div className="space-y-6">
              <div className="grid gap-4">
                {renderSummaryCard("Anuidade", selectedPlan.annualAmount, "Base anual do plano")}
              </div>
              <div className="rounded-lg border border-borderPrimary p-4 text-sm text-textSecondary">
                <p className="font-semibold text-textPrimary">Cliente selecionado:</p>
                <p>{selectedClient?.name}</p>
                <p>{selectedClient?.email}</p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-textSecondary">Selecione um plano para ver os valores.</div>
          )}
        </Card>
      </div>
    </PageLayout>
  );
};

export default Contratos;