import { ChangeEvent, useMemo, useState } from "react";

import api from "../../services/apiService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import InputField from "../../components/Input/InputField";
import PageLayout from "../../components/PageLayout";

const initialFormState = {
  name: "",
  cpf: "",
  phone: "",
  email: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  uf: "",
};

const CadastroCliente = () => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const filledFields = useMemo(
    () => Object.values(form).filter((value) => value.trim()).length,
    [form]
  );

  const handleFieldChange = (field: keyof typeof initialFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleReset = () => {
    setForm(initialFormState);
    setStatusMessage("");
  };

  const handleSubmit = async () => {
    setSaving(true);
    setStatusMessage("");

    try {
      const apiService = api();
      await apiService.post("api/v1/Client", {
        ...form,
        companyId: 1,
      });
      setStatusMessage("Cliente salvo com sucesso.");
      handleReset();
    } catch (error) {
      setStatusMessage("Não foi possível salvar o cliente. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageLayout
      title="Cadastro de cliente"
      subtitle="Use os dados oficiais para vincular contratos e planos"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="space-y-6 p-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-textSecondary">Dados pessoais</p>
            <p className="text-sm text-textPrimary">
              Informe os dados fundamentais do cliente para gerar contratos.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Nome completo"
              name="name"
              value={form.name}
              onChange={handleFieldChange("name")}
            />
            <InputField label="CPF" name="cpf" value={form.cpf} onChange={handleFieldChange("cpf")} />
            <InputField
              label="Telefone"
              name="phone"
              value={form.phone}
              onChange={handleFieldChange("phone")}
            />
            <InputField
              label="E-mail"
              name="email"
              type="email"
              value={form.email}
              onChange={handleFieldChange("email")}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-textSecondary">Endereço completo</p>
            <p className="text-sm text-textPrimary">
              Campos usados para validar o contato e a localização do cliente.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <InputField
              label="Logradouro"
              name="street"
              value={form.street}
              onChange={handleFieldChange("street")}
            />
            <InputField
              label="Número"
              name="number"
              value={form.number}
              onChange={handleFieldChange("number")}
            />
            <InputField
              label="Bairro"
              name="neighborhood"
              value={form.neighborhood}
              onChange={handleFieldChange("neighborhood")}
            />
            <InputField label="Cidade" name="city" value={form.city} onChange={handleFieldChange("city")} />
            <InputField label="UF" name="uf" value={form.uf} onChange={handleFieldChange("uf")} />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button className="flex-1" variant="primary" onClick={handleSubmit} disabled={saving || filledFields < 5}>
              {saving ? "Salvando..." : "Salvar cliente"}
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleReset} disabled={saving}>
              Limpar formulário
            </Button>
          </div>

          {statusMessage && <p className="text-sm text-textSecondary">{statusMessage}</p>}
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <p className="text-sm font-semibold text-textSecondary">Progresso do cadastro</p>
            <p className="text-sm text-textPrimary">
              {filledFields} de {Object.keys(initialFormState).length} campos preenchidos.
            </p>
          </div>
          <div className="space-y-2 text-sm text-textSecondary">
            <p>
              <strong className="text-textPrimary">CPF:</strong> {form.cpf || "Ainda não informado"}
            </p>
            <p>
              <strong className="text-textPrimary">Telefone:</strong> {form.phone || "Ainda não informado"}
            </p>
            <p>
              <strong className="text-textPrimary">Cidade / UF:</strong> {form.city || "—"} / {form.uf || "—"}
            </p>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default CadastroCliente;