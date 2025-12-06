import React, { useCallback, useEffect, useMemo, useState } from "react";
import ApiService from "../../services/apiService";
import AccessibilityPanel from "../../components/AccessibilityPanel";

interface CompanyApiResponse {
    id?: number;
    cpfCnpj?: string;
    companyName?: string;
    tradeName?: string;
    email?: string;
    phone?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
    city?: string;
    uf?: string;
}

interface Company {
    id: number;
    companyName: string;
    tradeName: string;
    cpfCnpj: string;
    email: string;
    phone?: string;
    city?: string;
    uf?: string;
    street?: string;
    number?: string;
    neighborhood?: string;
}

type FormMode = "view" | "edit";

interface CompanyFormData {
    companyName: string;
    tradeName: string;
    cpfCnpj: string;
    email: string;
    phone: string;
    city: string;
    uf: string;
    street: string;
    number: string;
    neighborhood: string;
}

const formatCnpj = (value?: string | null) => {
    if (!value) {
        return "Não informado";
    }

    const digits = value.replace(/\D/g, "");

    if (digits.length !== 14) {
        return value;
    }

    return digits.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
};

const maskCnpj = (value: string) => {
    let digits = value.replace(/\D/g, "").slice(0, 14);
    digits = digits.replace(/^(\d{2})(\d)/, "$1.$2");
    digits = digits.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    digits = digits.replace(/\.(\d{3})(\d)/, ".$1/$2");
    digits = digits.replace(/(\d{4})(\d)/, "$1-$2");
    return digits;
};

const maskPhone = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);

    if (digits.length <= 2) {
        return digits;
    }

    if (digits.length <= 6) {
        return digits.replace(/(\d{2})(\d+)/, "($1) $2");
    }

    if (digits.length <= 10) {
        return digits.replace(/(\d{2})(\d{4})(\d+)/, "($1) $2-$3");
    }

    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
};

const emptyFormData: CompanyFormData = {
    companyName: "",
    tradeName: "",
    cpfCnpj: "",
    email: "",
    phone: "",
    city: "",
    uf: "",
    street: "",
    number: "",
    neighborhood: "",
};

const buildFormData = (company: Company | null): CompanyFormData => {
    if (!company) {
        return { ...emptyFormData };
    }

    return {
        companyName: company.companyName ?? "",
        tradeName: company.tradeName ?? "",
        cpfCnpj: maskCnpj(company.cpfCnpj ?? ""),
        email: company.email ?? "",
        phone: maskPhone(company.phone ?? ""),
        city: company.city ?? "",
        uf: (company.uf ?? "").toUpperCase().slice(0, 2),
        street: company.street ?? "",
        number: company.number ?? "",
        neighborhood: company.neighborhood ?? "",
    };
};

const ListOfCompanies: React.FC = () => {
    const api = useMemo(() => ApiService(), []);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
    const [formMode, setFormMode] = useState<FormMode | null>(null);
    const [formData, setFormData] = useState<CompanyFormData>(emptyFormData);
    const [formSaving, setFormSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [formMessage, setFormMessage] = useState<string | null>(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const itemsPerPage = 5;

    const isViewMode = formMode === "view";
    const isEditMode = formMode === "edit";

    const loadCompanies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("api/v1/Company");
            const payload = Array.isArray(response.data)
                ? response.data
                : Array.isArray(response.data?.data)
                    ? response.data.data
                    : [];
            const data = payload as CompanyApiResponse[];

            const normalized: Company[] = data.map((item, index) => ({
                id: item.id ?? index,
                companyName: item.companyName ?? item.tradeName ?? "Empresa sem nome",
                tradeName: item.tradeName ?? item.companyName ?? "Empresa sem nome",
                cpfCnpj: item.cpfCnpj ?? "",
                email: item.email ?? "Não informado",
                phone: item.phone,
                city: item.city,
                uf: item.uf,
                street: item.street,
                number: item.number,
                neighborhood: item.neighborhood,
            }));

            setCompanies(normalized);
            setSelectedCompany((previous) => {
                if (!previous) {
                    return previous;
                }

                const updated = normalized.find((item) => item.id === previous.id);
                return updated ?? previous;
            });
        } catch (fetchError) {
            console.error("Erro ao carregar empresas:", fetchError);
            setError("Não foi possível carregar as empresas. Tente novamente mais tarde.");
            setCompanies([]);
        } finally {
            setLoading(false);
        }
    }, [api]);

    useEffect(() => {
        loadCompanies();
    }, [loadCompanies]);

    useEffect(() => {
        setFormData(buildFormData(selectedCompany));
    }, [selectedCompany]);

    const filteredCompanies = companies.filter(company => {
        const query = search.trim().toLowerCase();
        const normalizedSearchDigits = search.replace(/\D/g, "");
        const normalizedCnpj = company.cpfCnpj.replace(/\D/g, "");

        if (!query) {
            return true;
        }

        return (
            company.tradeName.toLowerCase().includes(query) ||
            company.companyName.toLowerCase().includes(query) ||
            company.email.toLowerCase().includes(query) ||
            (normalizedSearchDigits
                ? normalizedCnpj.includes(normalizedSearchDigits)
                : normalizedCnpj.includes(query))
        );
    });

    const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(filteredCompanies.length / itemsPerPage));
        if (currentPage > maxPage) {
            setCurrentPage(maxPage);
        }
    }, [filteredCompanies.length, itemsPerPage, currentPage]);

    const openCompanyPanel = (companyId: number, mode: FormMode) => {
        const company = companies.find((item) => item.id === companyId);
        if (!company) {
            return;
        }

        setSelectedCompany(company);
        setFormMode(mode);
        setFormError(null);
        setFormMessage(null);
    };

    const handleEdit = (id: number) => {
        openCompanyPanel(id, "edit");
    };

    const handleDetails = (id: number) => {
        openCompanyPanel(id, "view");
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setCurrentPage(1); // Resetar para primeira página
    };

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const formattedValue = name === "cpfCnpj"
            ? maskCnpj(value)
            : name === "phone"
                ? maskPhone(value)
                : name === "uf"
                    ? value.toUpperCase().slice(0, 2)
                    : value;

        setFormData((previous) => ({
            ...previous,
            [name]: formattedValue,
        }));
    };

    const handleCloseForm = () => {
        setSelectedCompany(null);
        setFormMode(null);
        setFormError(null);
        setFormMessage(null);
        setConfirmOpen(false);
    };

    const handleEnableEdit = () => {
        if (!selectedCompany) {
            return;
        }

        setFormMode("edit");
        setFormError(null);
        setFormMessage(null);
    };

    const handleCancelEdit = () => {
        if (!selectedCompany) {
            return;
        }

        setFormMode("view");
        setFormError(null);
        setFormMessage(null);
        setFormData(buildFormData(selectedCompany));
        setConfirmOpen(false);
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedCompany || !isEditMode) {
            return;
        }

        setFormError(null);
        setFormMessage(null);
        setConfirmOpen(true);
    };

    const handleCancelConfirm = () => {
        if (formSaving) {
            return;
        }

        setConfirmOpen(false);
    };

    const handleConfirmSave = async () => {
        if (!selectedCompany || !isEditMode) {
            return;
        }

        setConfirmOpen(false);
        setFormSaving(true);
        setFormError(null);
        setFormMessage(null);

        try {
            const payload = {
                cpfCnpj: formData.cpfCnpj.replace(/\D/g, ""),
                companyName: formData.companyName,
                tradeName: formData.tradeName,
                email: formData.email,
                phone: formData.phone.replace(/\D/g, ""),
                city: formData.city,
                uf: formData.uf,
                street: formData.street,
                number: formData.number,
                neighborhood: formData.neighborhood,
            };

            await api.put(`api/v1/Company/${selectedCompany.id}`, payload);
            setFormMessage("Empresa atualizada com sucesso.");
            await loadCompanies();
            setFormMode("view");
        } catch (submitError) {
            console.error("Erro ao atualizar empresa:", submitError);
            setFormError("Não foi possível salvar as alterações. Tente novamente.");
            setFormMode("edit");
        } finally {
            setFormSaving(false);
        }
    };

    const inputClass = (readOnly: boolean) =>
        `mt-1 block w-full rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none ${readOnly
            ? "bg-gray-50 border-gray-200 text-gray-600 cursor-default"
            : "bg-white border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"}`;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Lista de Empresas
                    </h1>
                    <p className="text-gray-600">
                        Gerencie todas as empresas cadastradas no sistema
                    </p>
                </div>

                {/* Search and Actions */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nome, CNPJ ou email..."
                                value={search}
                                onChange={handleSearchChange}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <button
                                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-60 disabled:cursor-not-allowed"
                                onClick={() => loadCompanies()}
                                disabled={loading}
                                type="button"
                            >
                                {loading ? "Atualizando..." : "Atualizar lista"}
                            </button>
                            <button
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                onClick={() => window.location.href = "/CadastroEmpresa"}
                                type="button"
                            >
                                + Nova Empresa
                            </button>
                        </div>
                    </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {error && !loading && (
                        <div className="px-6 py-4 bg-red-50 border-b border-red-100">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}
                    {loading ? (
                        <div className="p-12 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="mt-4 text-gray-600">Carregando empresas...</p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nome
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                CNPJ
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedCompanies.length > 0 ? (
                                            paginatedCompanies.map((company) => (
                                                <tr
                                                    key={company.id}
                                                    className={`transition-colors ${selectedCompany?.id === company.id
                                                        ? "bg-blue-50 hover:bg-blue-100"
                                                        : "hover:bg-gray-50"}`}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {company.tradeName || company.companyName}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">
                                                            {formatCnpj(company.cpfCnpj)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">
                                                            {company.email}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEdit(company.id)}
                                                                className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
                                                            >
                                                                Editar
                                                            </button>
                                                            <button
                                                                onClick={() => handleDetails(company.id)}
                                                                className="bg-gray-600 text-white px-3 py-1.5 rounded-md hover:bg-gray-700 transition-colors text-sm"
                                                            >
                                                                Detalhes
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-6 py-12 text-center">
                                                    <div className="text-gray-500">
                                                        {error ? error : search ?
                                                            `Nenhuma empresa encontrada para "${search}"` :
                                                            'Nenhuma empresa cadastrada'
                                                        }
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {selectedCompany && formMode && (
                                <div className="border-t border-gray-200 bg-gray-50 px-6 py-6">
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">
                                                {isEditMode ? "Editar empresa" : "Detalhes da empresa"}
                                            </h2>
                                            <p className="text-sm text-gray-600">
                                                {selectedCompany.tradeName || selectedCompany.companyName}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {isViewMode && (
                                                <button
                                                    type="button"
                                                    onClick={handleEnableEdit}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                                                >
                                                    Editar
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={handleCloseForm}
                                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
                                            >
                                                Fechar
                                            </button>
                                        </div>
                                    </div>

                                    {formError && (
                                        <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                            {formError}
                                        </div>
                                    )}

                                    {formMessage && (
                                        <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                            {formMessage}
                                        </div>
                                    )}

                                    <form className="space-y-6" onSubmit={handleFormSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                                                    Razão Social
                                                </label>
                                                <input
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formData.companyName}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="tradeName" className="block text-sm font-medium text-gray-700">
                                                    Nome Fantasia
                                                </label>
                                                <input
                                                    id="tradeName"
                                                    name="tradeName"
                                                    value={formData.tradeName}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="cpfCnpj" className="block text-sm font-medium text-gray-700">
                                                    CNPJ
                                                </label>
                                                <input
                                                    id="cpfCnpj"
                                                    name="cpfCnpj"
                                                    value={formData.cpfCnpj}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                                    Telefone
                                                </label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                                                    Logradouro
                                                </label>
                                                <input
                                                    id="street"
                                                    name="street"
                                                    value={formData.street}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="number" className="block text-sm font-medium text-gray-700">
                                                    Número
                                                </label>
                                                <input
                                                    id="number"
                                                    name="number"
                                                    value={formData.number}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700">
                                                    Bairro
                                                </label>
                                                <input
                                                    id="neighborhood"
                                                    name="neighborhood"
                                                    value={formData.neighborhood}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                                                    Cidade
                                                </label>
                                                <input
                                                    id="city"
                                                    name="city"
                                                    value={formData.city}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                                                    UF
                                                </label>
                                                <input
                                                    id="uf"
                                                    name="uf"
                                                    value={formData.uf}
                                                    onChange={handleFormChange}
                                                    readOnly={isViewMode}
                                                    className={inputClass(isViewMode)}
                                                />
                                            </div>
                                        </div>

                                        {isEditMode && (
                                            <div className="flex flex-wrap justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                                                    disabled={formSaving}
                                                >
                                                    Cancelar
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                                    disabled={formSaving}
                                                >
                                                    {formSaving ? "Salvando..." : "Salvar alterações"}
                                                </button>
                                            </div>
                                        )}
                                    </form>
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="bg-white px-6 py-4 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredCompanies.length)} de {filteredCompanies.length} empresas
                                        </div>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Anterior
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-2 text-sm rounded-md transition-colors ${currentPage === page
                                                            ? 'bg-blue-600 text-white'
                                                            : 'text-gray-600 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Próximo
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
            {confirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
                    <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
                        <div className="px-6 py-5 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Confirmar atualização
                            </h3>
                            <p className="mt-2 text-sm text-gray-600">
                                Tem certeza de que deseja salvar as alterações cadastrais desta empresa?
                            </p>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
                            <button
                                type="button"
                                onClick={handleCancelConfirm}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
                                disabled={formSaving}
                            >
                                Não, voltar
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                disabled={formSaving}
                            >
                                {formSaving ? "Salvando..." : "Sim, atualizar"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
             <AccessibilityPanel />
        </div>
    );
};

export default ListOfCompanies;