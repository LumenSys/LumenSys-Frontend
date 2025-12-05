import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Add, PersonAdd, Search } from "@mui/icons-material";
import { Tabs, Tab } from "@mui/material";
import {
    Alert,
    Box,
    Button,
    Card,
    Chip,
    Container,
    Divider,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ApiService from "../../services/apiService";
import AccessibilityPanel from "../../components/AccessibilityPanel";

type ContractStatus = "Ativo" | "Inativo";

interface ClientSummary {
    id: number;
    name: string;
    cpf?: string;
    phone?: string;
}

interface PlanSummary {
    id: number;
    name: string;
}

interface NormalizedContract {
    id: number;
    clientId: number;
    planId?: number;
    startDate?: string;
    endDate?: string;
    dependentCount: number;
    value: number;
    monthlyFee?: number;
    isActive: boolean;
}

interface ContractListItem {
    id: number;
    clientName: string;
    cpf?: string;
    phone?: string;
    planName?: string;
    status: ContractStatus;
    startDate?: string;
    endDate?: string;
    value: number;
    monthlyFee?: number;
    dependentCount: number;
}

const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (value?: string) => {
    if (!value) return "-";
    const [datePart] = value.split("T");
    const segments = datePart?.split("-") ?? [];
    if (segments.length !== 3 || segments.some((segment) => !segment)) return "-";
    const [year, month, day] = segments;
    return `${day}/${month}/${year}`;
};

const formatCpf = (value?: string) => {
    if (!value) return undefined;
    const digits = value.replace(/\D/g, "");
    if (digits.length !== 11) return value;
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{2})$/, "$1-$2");
};

const formatPhone = (value?: string) => {
    if (!value) return undefined;
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 11) return value;
    const pattern = digits.length === 11 ? /(\d{2})(\d{5})(\d{4})/ : /(\d{2})(\d{4})(\d{4})/;
    const match = digits.match(pattern);
    if (!match) return value;
    const [, area, first, second] = match;
    return `(${area}) ${first}-${second}`;
};

const extractArray = (payload: any) => {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    return [];
};

export default function GerenciarContratos() {
    const navigate = useNavigate();
    const [contracts, setContracts] = useState<ContractListItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [tabValue, setTabValue] = useState<number>(0);

    const loadContracts = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const api = ApiService();
            const [contractsResponse, clientsResponse, plansResponse] = await Promise.all([
                api.get("api/v1/Contracts"),
                api.get("api/v1/Client"),
                api.get("api/v1/FuneralPlans"),
            ]);

            const rawContracts = extractArray(contractsResponse.data);
            const rawClients = extractArray(clientsResponse.data);
            const rawPlans = extractArray(plansResponse.data);

            const clients: ClientSummary[] = rawClients
                .map((client: any) => ({
                    id: Number(client.id ?? client.clientId ?? client.clienteId ?? 0),
                    name: client.name ?? "Cliente sem nome",
                    cpf: client.cpf ?? client.document ?? undefined,
                    phone: client.phone ?? client.telefone ?? undefined,
                }))
                .filter((client: ClientSummary) => Number.isFinite(client.id) && client.id > 0);

            const plans: PlanSummary[] = rawPlans
                .map((plan: any) => ({
                    id: Number(plan.id ?? plan.planId ?? 0),
                    name: plan.name ?? plan.title ?? "Plano sem nome",
                }))
                .filter((plan: PlanSummary) => Number.isFinite(plan.id) && plan.id > 0);

            const normalizedContracts: NormalizedContract[] = rawContracts
                .map((contract: any) => {
                    const contractId = Number(contract.id ?? contract.contractId ?? 0);
                    const clientId = Number(contract.clientId ?? contract.clienteId ?? contract.client?.id ?? 0);
                    const planId = Number(contract.funeralPlanId ?? contract.planId ?? contract.planoFunerarioId ?? 0);
                    const startDate = (contract.startDate ?? contract.dataInicio ?? contract.start_date ?? "")?.toString();
                    const endDate = (contract.endDate ?? contract.dataFim ?? contract.end_date ?? "")?.toString();
                    const dependentCount = Number(contract.dependentCount ?? contract.quantidadeDependentes ?? contract.dependentes ?? 0);
                    const value = Number(contract.value ?? contract.valor ?? contract.total ?? 0);
                    const monthlyFee = Number(contract.monthlyFee ?? contract.mensalidade ?? contract.monthlyAmount ?? 0);
                    const rawStatus = contract.isActive ?? contract.ativo ?? contract.status ?? false;

                    let isActive = false;
                    if (typeof rawStatus === "boolean") {
                        isActive = rawStatus;
                    } else if (typeof rawStatus === "number") {
                        isActive = rawStatus === 1;
                    } else if (typeof rawStatus === "string") {
                        const normalized = rawStatus.toLowerCase();
                        isActive = ["ativo", "active", "true", "1"].includes(normalized);
                    }

                    return {
                        id: contractId,
                        clientId,
                        planId: Number.isFinite(planId) && planId > 0 ? planId : undefined,
                        startDate,
                        endDate,
                        dependentCount: Number.isFinite(dependentCount) && dependentCount >= 0 ? dependentCount : 0,
                        value: Number.isFinite(value) ? value : 0,
                        monthlyFee: Number.isFinite(monthlyFee) && monthlyFee > 0 ? monthlyFee : undefined,
                        isActive,
                    };
                })
                .filter(
                    (contract: NormalizedContract) =>
                        Number.isFinite(contract.id) && contract.id > 0 && Number.isFinite(contract.clientId) && contract.clientId > 0
                );

            const detailedContracts: ContractListItem[] = normalizedContracts
                .map((contract) => {
                    const client = clients.find((item) => item.id === contract.clientId);
                    const plan = contract.planId ? plans.find((item) => item.id === contract.planId) : undefined;

                    return {
                        id: contract.id,
                        clientName: client?.name ?? `Cliente #${contract.clientId}`,
                        cpf: client?.cpf,
                        phone: client?.phone,
                        planName: plan?.name,
                        status: contract.isActive ? "Ativo" : "Inativo",
                        startDate: contract.startDate,
                        endDate: contract.endDate,
                        value: contract.value,
                        monthlyFee: contract.monthlyFee,
                        dependentCount: contract.dependentCount,
                    };
                })
                .sort((a, b) => a.id - b.id);

            setContracts(detailedContracts);
        } catch (loadError: any) {
            console.error("Erro ao carregar contratos:", loadError);
            const message = loadError?.response?.data?.message ?? loadError.message ?? "Não foi possível carregar contratos.";
            setError(message);
            setContracts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadContracts();
    }, [loadContracts]);

    const filteredContracts = useMemo(() => {
        if (!searchTerm) return contracts;
        const normalizedTerm = searchTerm.toLowerCase();
        const numericTerm = searchTerm.replace(/\D/g, "");
        return contracts.filter((contract) => {
            const matchesName = contract.clientName.toLowerCase().includes(normalizedTerm);
            const matchesPlan = contract.planName?.toLowerCase().includes(normalizedTerm);
            const matchesId = contract.id.toString().includes(numericTerm);
            const matchesCpf = contract.cpf?.replace(/\D/g, "").includes(numericTerm);
            const matchesPhone = contract.phone?.replace(/\D/g, "").includes(numericTerm);
            return matchesName || matchesPlan || matchesId || matchesCpf || matchesPhone;
        });
    }, [contracts, searchTerm]);

    return (
        <Container maxWidth="lg" className="py-5">
            {/* Abas para navegação: Lista de Contratos / Dependentes */}
            <Box mb={3} display="flex" justifyContent="center">
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => {
                        setTabValue(newValue);
                        if (newValue === 1) {
                            navigate("/gerenciarContratos/dependentes");
                        }
                    }}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab label="Contratos" />
                    <Tab label="Dependentes" />
                </Tabs>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
                <div>
                    <Typography variant="h4" fontWeight={700}>
                        Contratos de Clientes
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={1}>
                        Visualize os contratos cadastrados de maneira simples.
                    </Typography>
                </div>
                <Box display="flex" gap={2} flexWrap="wrap">
                    <Button
                        variant="outlined"
                        startIcon={<PersonAdd />}
                        onClick={() => navigate("/gerenciarContratos/cadastrarCliente")}
                        size="large"
                        className="border-primary text-primary hover:bg-primary/10"
                    >
                        Novo Cliente
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => navigate("/gerenciarContratos/criarContrato")}
                        size="large"
                        className="bg-primary text-white hover:bg-primary/90"
                    >
                        Novo Contrato
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate("/gerenciarContratos/dependentes")}
                        size="large"
                    >
                        Cadastro de Dependentes
                    </Button>
                    <Button variant="outlined" onClick={loadContracts} disabled={loading} size="large">
                        {loading ? "Atualizando..." : "Atualizar"}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Buscar por cliente"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 480 }}
                />
            </Box>

            <Card>
                {loading && contracts.length === 0 ? (
                    <Box p={3}>
                        <Typography color="text.secondary">Carregando contratos...</Typography>
                    </Box>
                ) : filteredContracts.length === 0 ? (
                    <Box p={3}>
                        <Typography color="text.secondary">
                            {searchTerm
                                ? `Nenhum contrato encontrado para "${searchTerm}".`
                                : "Nenhum contrato cadastrado."}
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {filteredContracts.map((contract, index) => {
                            const formattedCpf = formatCpf(contract.cpf);
                            const formattedPhone = formatPhone(contract.phone);

                            return (
                                <React.Fragment key={contract.id}>
                                    <ListItem
                                        sx={{ py: 2, cursor: 'pointer' }}
                                        onClick={() => navigate(`/gerenciarContratos/criarContrato/${contract.id}`)}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent="space-between"
                                                    flexWrap="wrap"
                                                    gap={1.5}
                                                >
                                                    <Typography variant="h6" component="span">
                                                        {contract.clientName}
                                                    </Typography>
                                                    <Chip
                                                        label={contract.status}
                                                        color={contract.status === "Ativo" ? "success" : "default"}
                                                        size="small"
                                                    />
                                                </Box>
                                            }
                                            secondary={
                                                <Box mt={1} display="flex" flexDirection="column" gap={0.5}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Contrato #{contract.id} • Dependentes: {contract.dependentCount}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Vigência: {formatDate(contract.startDate)} — {formatDate(contract.endDate)}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Valor total: {formatCurrency(contract.value)}
                                                        {contract.monthlyFee
                                                            ? ` • Mensalidade: ${formatCurrency(contract.monthlyFee)}`
                                                            : ""}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {formattedCpf ? `CPF: ${formattedCpf}` : "CPF não informado"}
                                                        {formattedPhone ? ` • Tel: ${formattedPhone}` : ""}
                                                    </Typography>
                                                    {contract.planName && (
                                                        <Typography variant="body2" color="text.secondary">
                                                            Plano funerário: {contract.planName}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < filteredContracts.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            );
                        })}
                    </List>
                )}
            </Card>

            <AccessibilityPanel />
        </Container>
    );
}