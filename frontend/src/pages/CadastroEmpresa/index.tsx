import React, { useState } from "react";

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
    <section className="py-12 dark:bg-dark flex items-center justify-center min-h-screen">
      <div className="container max-w-5xl mx-auto"> {/* Aumentamos o tamanho do container */}
        <form className="grid grid-cols-2 gap-x-8 gap-y-6 bg-white dark:bg-dark-2 p-10 rounded-lg shadow-md">
          <h2 className="col-span-2 text-3xl font-bold text-center mb-6 text-textPrimary"> {/* Centralizando e ajustando o título */}
            Cadastro de Empresa
          </h2>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Nome da empresa:
            </label>
            <input
              type="text"
              name="nomeEmpresa"
              placeholder="Digite o nome da empresa"
              value={fields.nomeEmpresa}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("nomeEmpresa") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("nomeEmpresa") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Razão Social:
            </label>
            <input
              type="text"
              name="razaoSocial"
              placeholder="Razão Social"
              value={fields.razaoSocial}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("razaoSocial") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("razaoSocial") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              CNPJ:
            </label>
            <input
              type="text"
              name="cnpj"
              placeholder="Digite o CNPJ da empresa"
              value={fields.cnpj}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("cnpj") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("cnpj") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Email:
            </label>
            <input
              type="email"
              name="email"
              placeholder="Digite o email da empresa"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("email") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("email") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>


          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Telefone:
            </label>
            <input
              type="text"
              name="telefone"
              placeholder="(99) 99999-9999"
              value={fields.telefone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("telefone") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("telefone") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Cidade:
            </label>
            <input
              type="text"
              name="cidade"
              placeholder="Digite sua cidade"
              value={fields.cidade}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("cidade") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("cidade") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Rua:
            </label>
            <input
              type="text"
              name="rua"
              placeholder="Digite sua rua"
              value={fields.rua}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("rua") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("rua") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Bairro:
            </label>
            <input
              type="text"
              name="bairro"
              placeholder="Digite seu bairro"
              value={fields.bairro}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("bairro") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("bairro") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              Número:
            </label>
            <input
              type="text"
              name="numero"
              placeholder="Digite o número"
              value={fields.numero}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("numero") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
            />
            {isEmpty("numero") && (
              <span className="text-danger text-sm">Campo obrigatório</span>
            )}
          </DefaultColumn>

          <DefaultColumn>
            <label className="mb-2 block text-base font-medium text-textPrimary">
              UF:
            </label>
            <input
              type="text"
              name="uf"
              placeholder="Digite sua UF"
              value={fields.uf}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full bg-transparent rounded-md border py-[10px] px-5 text-dark-6 outline-none transition focus:border-primary
                ${isFilled("uf") ? "border-green-500" : "border-stroke dark:border-dark-3"}
              `}
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
              className="w-full bg-secondary text-background px-6 py-3 rounded-lg hover:bg-hoverButton transition"
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