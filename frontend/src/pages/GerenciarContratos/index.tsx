// src/pages/GerenciarContratos/index.tsx
import React, { useState } from "react";
import { Add, Visibility, Search } from "@mui/icons-material";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Tab,
    Tabs,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
    Avatar,
} from "@mui/material";

type ContractType = "Premium" | "Padrão" | "Básico";
type ContractStatus = "Ativo" | "Cancelado" | "Suspenso";

interface Contract {
    id: number;
    nomeAssinante: string;
    cpf: string;
    telefone: string;
    plano: ContractType;
    status: ContractStatus;
    dataContratacao: string;
    valorMensal: number;
    dependentes: number;
}

// Interface específica para o formulário com tipos string para inputs
interface NewContractForm {
    nomeAssinante: string;
    cpf: string;
    telefone: string;
    plano: ContractType;
    valorMensal: string; // String para o input
    dependentes: string; // String para o input
}

const initialContracts: Contract[] = [
    {
        id: 1,
        nomeAssinante: "João Silva Santos",
        cpf: "123.456.789-01",
        telefone: "(11) 99999-1234",
        plano: "Premium",
        status: "Ativo",
        dataContratacao: "2024-01-15",
        valorMensal: 299.90,
        dependentes: 3,
    },
    {
        id: 2,
        nomeAssinante: "Maria Oliveira Costa",
        cpf: "987.654.321-09",
        telefone: "(11) 88888-5678",
        plano: "Básico",
        status: "Cancelado",
        dataContratacao: "2023-11-20",
        valorMensal: 89.90,
        dependentes: 1,
    },
    {
        id: 3,
        nomeAssinante: "Carlos Eduardo Pereira",
        cpf: "456.789.123-45",
        telefone: "(11) 77777-9012",
        plano: "Padrão",
        status: "Ativo",
        dataContratacao: "2024-03-10",
        valorMensal: 179.90,
        dependentes: 2,
    },
    {
        id: 4,
        nomeAssinante: "Ana Paula Rodrigues",
        cpf: "321.654.987-12",
        telefone: "(11) 66666-3456",
        plano: "Premium",
        status: "Suspenso",
        dataContratacao: "2023-12-05",
        valorMensal: 299.90,
        dependentes: 4,
    },
    {
        id: 5,
        nomeAssinante: "Roberto Lima Souza",
        cpf: "789.123.456-78",
        telefone: "(11) 55555-7890",
        plano: "Básico",
        status: "Ativo",
        dataContratacao: "2024-02-28",
        valorMensal: 89.90,
        dependentes: 0,
    },
];

const contractTypes: ContractType[] = ["Premium", "Padrão", "Básico"];
const contractStatuses: ContractStatus[] = ["Ativo", "Cancelado", "Suspenso"];

export default function GerenciarContratos() {
    const [contracts, setContracts] = useState<Contract[]>(initialContracts);
    const [tab, setTab] = useState<ContractStatus | "Todos">("Todos");
    const [searchTerm, setSearchTerm] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    
    // Use a interface específica do formulário
    const [newContract, setNewContract] = useState<NewContractForm>({
        nomeAssinante: "",
        cpf: "",
        telefone: "",
        plano: "Básico",
        valorMensal: "89.90",
        dependentes: "0",
    });

    const handleTabChange = (_: React.SyntheticEvent, value: string) => {
        setTab(value as ContractStatus | "Todos");
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleOpenDialog = () => setOpenDialog(true);
    
    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewContract({
            nomeAssinante: "",
            cpf: "",
            telefone: "",
            plano: "Básico",
            valorMensal: "89.90",
            dependentes: "0",
        });
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        
        // Formatação automática para campos específicos
        let formattedValue = value;
        
        if (name === 'cpf') {
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        } else if (name === 'telefone') {
            formattedValue = value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{4})\d+?$/, '$1');
        }
        
        // Agora todos os valores são strings
        setNewContract({ ...newContract, [name]: formattedValue });
    };

    const handleCreateContract = () => {
        if (!newContract.nomeAssinante || !newContract.cpf || !newContract.telefone) return;
        
        const newId = Math.max(...contracts.map(c => c.id), 0) + 1;
        
        // Conversão de string para number aqui
        setContracts([
            ...contracts,
            {
                id: newId,
                nomeAssinante: newContract.nomeAssinante,
                cpf: newContract.cpf,
                telefone: newContract.telefone,
                plano: newContract.plano,
                status: "Ativo" as ContractStatus,
                dataContratacao: new Date().toISOString().slice(0, 10),
                valorMensal: parseFloat(newContract.valorMensal) || 89.90,
                dependentes: parseInt(newContract.dependentes) || 0,
            },
        ]);
        handleCloseDialog();
    };

    const handleChangeStatus = (contractId: number, newStatus: ContractStatus) => {
        setContracts(
            contracts.map((c) =>
                c.id === contractId ? { ...c, status: newStatus } : c
            )
        );
    };

    // Filtrar contratos por status e termo de busca
    const filteredContracts = contracts.filter((contract) => {
        const matchesTab = tab === "Todos" || contract.status === tab;
        const matchesSearch = contract.nomeAssinante
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const getStatusColor = (status: ContractStatus) => {
        switch (status) {
            case "Ativo":
                return "success";
            case "Cancelado":
                return "error";
            case "Suspenso":
                return "warning";
            default:
                return "default";
        }
    };

    const getPlanoColor = (plano: ContractType) => {
        switch (plano) {
            case "Premium":
                return "primary";
            case "Padrão":
                return "info";
            case "Básico":
                return "secondary";
            default:
                return "default";
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <div>
                    <Typography variant="h4" fontWeight={700}>
                        Contratos de Clientes
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mt={1}>
                        Gerencie os contratos dos seus clientes da funerária
                    </Typography>
                </div>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => {
                        window.location.href = "/criarcontrato";
                    }}
                    size="large"
                >
                    Novo Contrato
                </Button>
            </Box>

            {/* Search Bar */}
            <Box mb={3}>
                <TextField
                    fullWidth
                    placeholder="Buscar por nome do assinante..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ maxWidth: 400 }}
                />
            </Box>

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                sx={{ mb: 3 }}
            >
                <Tab label="Todos" value="Todos" />
                {contractStatuses.map((status) => (
                    <Tab key={status} label={status} value={status} />
                ))}
            </Tabs>

            {/* Contracts List */}
            <Card>
                <List>
                    {filteredContracts.length === 0 ? (
                        <ListItem>
                            <ListItemText
                                primary={
                                    <Typography color="text.secondary" align="center">
                                        {searchTerm 
                                            ? `Nenhum contrato encontrado para "${searchTerm}"`
                                            : "Nenhum contrato encontrado."
                                        }
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ) : (
                        filteredContracts.map((contract, index) => (
                            <React.Fragment key={contract.id}>
                                <ListItem
                                    sx={{
                                        py: 2,
                                        '&:hover': {
                                            backgroundColor: 'action.hover',
                                        },
                                    }}
                                >
                                    <Avatar
                                        sx={{
                                            mr: 2,
                                            bgcolor: getPlanoColor(contract.plano) + '.main',
                                            color: 'white',
                                        }}
                                    >
                                        {contract.nomeAssinante.charAt(0).toUpperCase()}
                                    </Avatar>
                                    
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="h6" component="span">
                                                    {contract.nomeAssinante}
                                                </Typography>
                                                <Chip
                                                    label={contract.plano}
                                                    color={getPlanoColor(contract.plano)}
                                                    size="small"
                                                />
                                                <Chip
                                                    label={contract.status}
                                                    color={getStatusColor(contract.status)}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Box mt={1}>
                                                <Typography variant="body2" color="text.secondary">
                                                    CPF: {contract.cpf} • Tel: {contract.telefone}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Contratado em: {new Date(contract.dataContratacao).toLocaleDateString('pt-BR')} • 
                                                    Valor: {formatCurrency(contract.valorMensal)} • 
                                                    Dependentes: {contract.dependentes}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                    
                                    <ListItemSecondaryAction>
                                        <Box display="flex" gap={1}>
                                            <IconButton
                                                edge="end"
                                                onClick={() => {/* Ver detalhes */}}
                                            >
                                                <Visibility />
                                            </IconButton>
                                            
                                            {contract.status === "Ativo" && (
                                                <>
                                                    <Button
                                                        size="small"
                                                        color="warning"
                                                        onClick={() => handleChangeStatus(contract.id, "Suspenso")}
                                                    >
                                                        Suspender
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleChangeStatus(contract.id, "Cancelado")}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                </>
                                            )}
                                            
                                            {contract.status === "Suspenso" && (
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    onClick={() => handleChangeStatus(contract.id, "Ativo")}
                                                >
                                                    Reativar
                                                </Button>
                                            )}
                                        </Box>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                {index < filteredContracts.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </Card>

            {/* Dialog para novo contrato */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>Novo Contrato de Cliente</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={1}>
                        <TextField
                            label="Nome do Assinante"
                            name="nomeAssinante"
                            value={newContract.nomeAssinante}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        
                        <TextField
                            label="CPF"
                            name="cpf"
                            value={newContract.cpf}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            placeholder="000.000.000-00"
                        />
                        
                        <TextField
                            label="Telefone"
                            name="telefone"
                            value={newContract.telefone}
                            onChange={handleInputChange}
                            fullWidth
                            required
                            placeholder="(00) 00000-0000"
                        />
                        
                        <TextField
                            select
                            label="Plano"
                            name="plano"
                            value={newContract.plano}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        >
                            {contractTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </TextField>
                        
                        <TextField
                            label="Valor Mensal (R$)"
                            name="valorMensal"
                            type="number"
                            value={newContract.valorMensal}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                inputProps: { min: 0, step: 0.01 }
                            }}
                        />
                        
                        <TextField
                            label="Número de Dependentes"
                            name="dependentes"
                            type="number"
                            value={newContract.dependentes}
                            onChange={handleInputChange}
                            fullWidth
                            InputProps={{
                                inputProps: { min: 0 }
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button
                        onClick={handleCreateContract}
                        variant="contained"
                        disabled={!newContract.nomeAssinante || !newContract.cpf || !newContract.telefone}
                    >
                        Criar Contrato
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}