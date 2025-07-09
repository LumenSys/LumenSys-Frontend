import React, { useState } from "react";
import InputField from '../../components/Input/InputField';

const initialFields = {
  nomeEmpresa: "",
  razaoSocial: "",
  cnpj: "",
  email: "",
  telefone: "",
  cidade: "",
  rua: "",
  bairro: "",
  numero: "",
  uf: "",
};

const FormElementInput = () => {
  const [fields, setFields] = useState(initialFields);
  const [touched, setTouched] = useState<{ [K in keyof typeof initialFields]?: boolean }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const isEmpty = (key: keyof typeof initialFields) => touched[key] && !fields[key];
  const isFilled = (key: keyof typeof initialFields) => fields[key] && touched[key];

  return (
    <section className="py-12 flex items-center justify-center min-h-screen bg-background">
      <div className="container max-w-5xl mx-auto">
        <form className="grid grid-cols-2 gap-x-8 gap-y-6 bg-surface p-10 rounded-lg shadow-md">
          <h2 className="col-span-2 text-3xl font-bold text-center mb-6 text-textPrimary">
            Cadastro de Empresa
          </h2>

          <DefaultColumn>
            <InputField
              label="Nome da empresa:"
              name="nomeEmpresa"
              placeholder="Digite o nome da empresa"
              value={fields.nomeEmpresa}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("nomeEmpresa") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Razão Social:"
              name="razaoSocial"
              placeholder="Razão Social"
              value={fields.razaoSocial}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("razaoSocial") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="CNPJ:"
              name="cnpj"
              placeholder="Digite o CNPJ da empresa"
              value={fields.cnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("cnpj") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Email:"
              name="email"
              type="email"
              placeholder="Digite o email da empresa"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("email") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Telefone:"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={fields.telefone}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("telefone") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Cidade:"
              name="cidade"
              placeholder="Digite sua cidade"
              value={fields.cidade}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("cidade") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Rua:"
              name="rua"
              placeholder="Digite sua rua"
              value={fields.rua}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("rua") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Bairro:"
              name="bairro"
              placeholder="Digite seu bairro"
              value={fields.bairro}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("bairro") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="Número:"
              name="numero"
              placeholder="Digite o número"
              value={fields.numero}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("numero") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <InputField
              label="UF:"
              name="uf"
              placeholder="Digite sua UF"
              value={fields.uf}
              onChange={handleChange}
              onBlur={handleBlur}
              required
              className="focus:ring-primary text-textPrimary bg-background"
            />
            {isEmpty("uf") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <div className="col-span-2 w-full mt-6 flex gap-4 justify-end">
            {/* Botão "Voltar" */}
            <button
              type="button"
              className="w-full bg-red-600 text-background px-6 py-3 rounded-lg hover:bg-red-700 transition"
              onClick={() => window.location.href = "/"}
            >
              Voltar
            </button>

            {/* Botão "Enviar" */}
            <button
              type="submit"
              className="w-full bg-primary text-background px-6 py-3 rounded-lg hover:bg-secondary transition"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

type DefaultColumnProps = {
  children: React.ReactNode;
};

const DefaultColumn = ({ children }: DefaultColumnProps) => (
  <div>
    {children}
  </div>
);

export default FormElementInput;