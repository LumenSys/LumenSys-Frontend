import { SetStateAction, useEffect, useMemo, useState } from "react";
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

  const [selectedClientId, setSelectedClientId] = useState<number | "">("");
  const [selectedPlanId, setSelectedPlanId] = useState<number | "">("");
  const [contractNumber, setContractNumber] = useState("");

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === Number(selectedClientId)) ?? null,
    [clients, selectedClientId]
  );

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === Number(selectedPlanId)) ?? null,
    [plans, selectedPlanId]
  );

  useEffect(() => {
    (async () => {
      const apiService = api();
      const [clientsResponse, plansResponse] = await Promise.all([
        apiService.get("api/v1/Clients"),
        apiService.get("api/v1/PlanosFunerarios"),
      ]);

      setClients(clientsResponse.data);
      setPlans(plansResponse.data);
    })();
  }, []);

  useEffect(() => {
    const savedClientId = localStorage.getItem("contract_client_id");
    const savedPlanId = localStorage.getItem("contract_plan_id");
    const savedContractNumber = localStorage.getItem("contract_number") ?? "";

    if (savedClientId) {
      setSelectedClientId(Number(savedClientId));
    }

    if (savedPlanId) {
      setSelectedPlanId(Number(savedPlanId));
    }

    setContractNumber(savedContractNumber);
  }, []);

  useEffect(() => {
    if (selectedClientId !== "") {
      localStorage.setItem("contract_client_id", selectedClientId.toString());
    }
  }, [selectedClientId]);

  useEffect(() => {
    if (selectedPlanId !== "") {
      localStorage.setItem("contract_plan_id", selectedPlanId.toString());
    }
  }, [selectedPlanId]);

  useEffect(() => {
    localStorage.setItem("contract_number", contractNumber);
  }, [contractNumber]);

  const handleSubmit = async () => {
    if (!selectedClient || !selectedPlan) return;

    const payload = {
      contrato: contractNumber,
      planoFunerarioId: selectedPlan.id,
      clienteId: selectedClient.id,
      companyId: selectedClient.companyId,
    };

    const apiService = api();
    await apiService.post("api/v1/Contracts", payload);
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
    <PageLayout title="Criar contrato" subtitle="Use cadastros existentes para prever IDs automaticamente">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6 p-6">
          <div>
            <p className="text-sm font-semibold text-textSecondary">Informações do contrato</p>
            <p className="text-sm text-textPrimary">
              A empresa e o cliente vinculados à apólice serão preenchidos quando você escolher um cadastro.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex flex-col gap-1 text-sm font-medium">
              Cliente
              <select
                className="rounded-lg border border-borderPrimary bg-background p-3 text-sm text-textPrimary"
                value={selectedClientId}
                onChange={(event) => setSelectedClientId(Number(event.target.value) || "")}
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
                value={selectedPlanId}
                onChange={(event) => setSelectedPlanId(Number(event.target.value) || "")}
              >
                <option value="">Selecione um plano</option>
                {plans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name}
                  </option>
                ))}
              </select>
            </label>

            <InputField
              name="contractNumber"
              label="Número do contrato"
              placeholder="CONTRATO-000"
              value={contractNumber}
              onChange={(event: { target: { value: SetStateAction<string>; }; }) => setContractNumber(event.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 text-sm text-textSecondary">
            <ClipboardList size={18} />
            <span>O cliente e a empresa são auto preenchidos a partir do cadastro escolhido.</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="flex-1" variant="outline" onClick={handleSubmit} icon={Plus}>
              Salvar contrato
            </Button>
            <Button className="flex-1" variant="outline">
              Limpar formulário
            </Button>
          </div>
        </Card>

        <Card className="space-y-6 p-6">
          <div className="text-sm font-semibold text-textSecondary">Resumo do plano</div>
          {selectedPlan ? (
            <div className="space-y-6">
              <div className="grid gap-4">
                {renderSummaryCard("Mensalidade", selectedPlan.monthlyAmount, "Atualizada a cada mês")}
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