import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/apiService";
import Button from "../../components/Button";
import Card from "../../components/Card";
import InputField from "../../components/Input/InputField";
import PageLayout from "../../components/PageLayout";
import AccessibilityPanel from "../../components/AccessibilityPanel";

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

type StatusState = {
  type: "success" | "error";
  text: string;
};

const CadastroCliente = () => {
  const [form, setForm] = useState(initialFormState);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<StatusState | null>(null);
  const redirectTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();

  const filledFields = useMemo(
    () => Object.values(form).filter((value) => value.trim()).length,
    [form]
  );

  const handleFieldChange = (field: keyof typeof initialFormState) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleReset = () => {
    if (redirectTimeoutRef.current) {
      window.clearTimeout(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
    setForm(initialFormState);
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      const apiService = api();
      await apiService.post("api/v1/Client", {
        ...form,
        companyId: 1,
      });
      setStatus({ type: "success", text: "Cliente salvo com sucesso. Redirecionando..." });
      setForm(initialFormState);
      redirectTimeoutRef.current = window.setTimeout(() => {
        navigate("/contratos");
      }, 1200);
    } catch (error) {
      setStatus({ type: "error", text: "Não foi possível salvar o cliente. Tente novamente." });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        window.clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  return (
    <PageLayout
      title="Cadastro de cliente"
    >
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="p-6 lg:col-span-2">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-textSecondary">Dados pessoais</p>
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Rua"
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
              <InputField
                label="Cidade"
                name="city"
                value={form.city}
                onChange={handleFieldChange("city")}
              />
              <InputField label="UF" name="uf" value={form.uf} onChange={handleFieldChange("uf")} />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                className="flex-1"
                variant="primary"
                type="submit"
                disabled={saving || filledFields < 5}
              >
                {saving ? "Salvando..." : "Salvar cliente"}
              </Button>
              <Button className="flex-1" variant="outline" onClick={handleReset} disabled={saving}>
                Limpar formulário
              </Button>
            </div>

            {status && (
              <p className={`text-sm ${status.type === "success" ? "text-success" : "text-danger"}`}>
                {status.text}
              </p>
            )}
          </form>
        </Card>
      </div>
      <AccessibilityPanel />
    </PageLayout>
  );
};

export default CadastroCliente;