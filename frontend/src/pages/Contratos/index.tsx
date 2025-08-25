import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Avatar,
  Paper,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Stack,
  SelectChangeEvent,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Save,
  ArrowBack,
  Person,
  CalendarToday,
  AttachMoney,
  CheckCircle,
  Cancel,
  Info,
  PersonAdd,
} from '@mui/icons-material';

// Interfaces baseadas na API C#
interface ContractData {
  isActive: boolean;
  startDate: string;
  endDate: string;
  dependentCount: number;
  monthlyFee: number;
  value: number;
  clientId: number;
}

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface NewClientData {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

interface FuneralPlan {
  id: number;
  name: string;
  description: string;
  annualValue: number;
  monthlyValue: number;
  maxDependents: number;
  maxAge: number;
  dependentAdditional: number;
}

// Mock data - substitua por chamadas reais da API
const mockClients: Client[] = [
  { id: 1, name: 'João Silva Santos', email: 'joao@email.com', phone: '(11) 99999-1234', cpf: '123.456.789-01' },
  { id: 2, name: 'Maria Oliveira Costa', email: 'maria@email.com', phone: '(11) 88888-5678', cpf: '987.654.321-09' },
  { id: 3, name: 'Carlos Eduardo Pereira', email: 'carlos@email.com', phone: '(11) 77777-9012', cpf: '456.789.123-45' },
];

const mockPlans: FuneralPlan[] = [
  {
    id: 1,
    name: 'Plano Básico',
    description: 'Plano com serviços essenciais para atendimento funerário',
    annualValue: 1200.00,
    monthlyValue: 100.00,
    maxDependents: 2,
    maxAge: 65,
    dependentAdditional: 50.00,
  },
  {
    id: 2,
    name: 'Plano Premium',
    description: 'Plano completo com todos os serviços incluídos',
    annualValue: 2400.00,
    monthlyValue: 200.00,
    maxDependents: 5,
    maxAge: 75,
    dependentAdditional: 75.00,
  },
  {
    id: 3,
    name: 'Plano Familiar',
    description: 'Plano especial para famílias com múltiplos dependentes',
    annualValue: 3600.00,
    monthlyValue: 300.00,
    maxDependents: 8,
    maxAge: 80,
    dependentAdditional: 100.00,
  },
];

const initialContract: ContractData = {
  isActive: true,
  startDate: new Date().toISOString().split('T')[0],
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  dependentCount: 0,
  monthlyFee: 0,
  value: 0,
  clientId: 0,
};

const initialNewClient: NewClientData = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
};

export default function CriarContrato() {
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractData>(initialContract);
  const [selectedPlan, setSelectedPlan] = useState<FuneralPlan | null>(null);
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [plans, setPlans] = useState<FuneralPlan[]>(mockPlans);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Controle de abas: 'existing' ou 'new'
  const [clientTab, setClientTab] = useState<'existing' | 'new'>('existing');
  const [newClient, setNewClient] = useState<NewClientData>(initialNewClient);

  // Calcular valores automaticamente
  useEffect(() => {
    if (selectedPlan) {
      const baseValue = selectedPlan.monthlyValue;
      const dependentCost = contract.dependentCount * selectedPlan.dependentAdditional;
      const monthlyFee = baseValue + dependentCost;
      const annualValue = monthlyFee * 12;

      setContract(prev => ({
        ...prev,
        monthlyFee,
        value: annualValue,
      }));
    }
  }, [selectedPlan, contract.dependentCount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setContract(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
        type === 'number' ? parseFloat(value) || 0 :
          value,
    }));
  };

  const handleNewClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    // Formatação automática
    if (name === 'cpf') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else if (name === 'phone') {
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
    
    setNewClient(prev => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;

    if (name === 'planId') {
      const plan = plans.find(p => p.id === Number(value));
      setSelectedPlan(plan || null);
    }

    setContract(prev => ({
      ...prev,
      [name]: name === 'clientId' ? Number(value) : value,
    }));
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: 'existing' | 'new') => {
    setClientTab(newValue);
    // Limpar seleção quando mudar de aba
    if (newValue === 'new') {
      setContract(prev => ({ ...prev, clientId: 0 }));
    } else {
      setNewClient(initialNewClient);
    }
    setError(null);
  };

  const createNewClient = async (): Promise<Client> => {
    // Simular criação do cliente na API
    const newClientId = Math.max(...clients.map(c => c.id), 0) + 1;
    const createdClient: Client = {
      id: newClientId,
      ...newClient,
    };
    
    // Adicionar à lista local (em produção, isso viria da API)
    setClients(prev => [...prev, createdClient]);
    
    return createdClient;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (clientTab === 'existing' && !contract.clientId) {
      setError('Por favor, selecione um cliente.');
      return;
    }
    
    if (clientTab === 'new') {
      if (!newClient.name || !newClient.cpf || !newClient.phone || !newClient.email) {
        setError('Por favor, preencha todos os campos do novo cliente.');
        return;
      }
    }
    
    if (!selectedPlan) {
      setError('Por favor, selecione um plano.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let finalClientId = contract.clientId;
      
      // Se for novo cliente, criar primeiro
      if (clientTab === 'new') {
        const createdClient = await createNewClient();
        finalClientId = createdClient.id;
      }

      // Simular chamada da API para criar contrato
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Aqui você faria a chamada real para a API
      // const contractData = { ...contract, clientId: finalClientId };
      // const response = await fetch('/api/contracts', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(contractData),
      // });

      setSuccess(true);
      setTimeout(() => {
        navigate('/contratos');
      }, 2000);

    } catch (err: any) {
      setError('Erro ao criar contrato. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(c => c.id === contract.clientId);
  const currentClient = clientTab === 'existing' ? selectedClient : newClient;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box mb={4}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton onClick={() => navigate('/contratos')} color="primary">
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight={700}>
            Criar Novo Contrato
          </Typography>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Preencha os dados para criar um novo contrato funerário
        </Typography>
      </Box>

      {/* Success/Error Messages */}
      {success && (
        <Alert severity="success" sx={{ mb: 3 }} icon={<CheckCircle />}>
          Contrato criado com sucesso! Redirecionando...
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} icon={<Cancel />}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Layout principal usando CSS Grid */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: '2fr 1fr'
            },
            gap: 4,
            mb: 4
          }}
        >
          {/* Coluna esquerda - Formulários */}
          <Box>
            {/* Card - Informações do Cliente */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person color="primary" />
                  Informações do Cliente
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Tabs para escolher entre cliente existente ou novo */}
                <Tabs value={clientTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                  <Tab
                    label="Cliente Existente"
                    value="existing"
                    icon={<Person />}
                    iconPosition="start"
                  />
                  <Tab
                    label="Novo Cliente"
                    value="new"
                    icon={<PersonAdd />}
                    iconPosition="start"
                  />
                </Tabs>

                {/* Conteúdo das abas */}
                {clientTab === 'existing' ? (
                  // Cliente existente
                  <Box>
                    <FormControl fullWidth required>
                      <InputLabel>Cliente</InputLabel>
                      <Select
                        name="clientId"
                        value={contract.clientId || ''}
                        onChange={handleSelectChange}
                        label="Cliente"
                      >
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            <Box display="flex" alignItems="center" gap={2}>
                              <Avatar sx={{ width: 32, height: 32 }}>
                                {client.name.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1">{client.name}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {client.cpf} • {client.phone}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                ) : (
                  // Novo cliente
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: '1fr',
                        md: 'repeat(2, 1fr)'
                      },
                      gap: 2
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Nome Completo"
                      name="name"
                      value={newClient.name}
                      onChange={handleNewClientChange}
                      required
                      sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                    />
                    <TextField
                      fullWidth
                      label="CPF"
                      name="cpf"
                      value={newClient.cpf}
                      onChange={handleNewClientChange}
                      required
                      placeholder="000.000.000-00"
                    />
                    <TextField
                      fullWidth
                      label="Telefone"
                      name="phone"
                      value={newClient.phone}
                      onChange={handleNewClientChange}
                      required
                      placeholder="(00) 00000-0000"
                    />
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      type="email"
                      value={newClient.email}
                      onChange={handleNewClientChange}
                      required
                      sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}
                      placeholder="cliente@email.com"
                    />
                  </Box>
                )}

                {/* Preview do cliente selecionado/inserido */}
                {(selectedClient || (clientTab === 'new' && newClient.name)) && (
                  <Paper sx={{ p: 2, bgcolor: 'primary.50', mt: 3 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      {clientTab === 'existing' ? 'Cliente Selecionado' : 'Novo Cliente'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Nome:</strong> {currentClient?.name || '-'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Email:</strong> {currentClient?.email || '-'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Telefone:</strong> {currentClient?.phone || '-'}
                    </Typography>
                    <Typography variant="body2">
                      <strong>CPF:</strong> {currentClient?.cpf || '-'}
                    </Typography>
                  </Paper>
                )}
              </CardContent>
            </Card>

            {/* Card - Detalhes do Contrato */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CalendarToday color="primary" />
                  Detalhes do Contrato
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* Campos do contrato usando CSS Grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                      xs: '1fr',
                      md: 'repeat(2, 1fr)'
                    },
                    gap: 3
                  }}
                >
                  <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
                    <FormControl fullWidth required>
                      <InputLabel>Plano Funerário</InputLabel>
                      <Select
                        name="planId"
                        value={selectedPlan?.id || ''}
                        onChange={handleSelectChange}
                        label="Plano Funerário"
                      >
                        {plans.map((plan) => (
                          <MenuItem key={plan.id} value={plan.id}>
                            <Box>
                              <Typography variant="body1">{plan.name}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {formatCurrency(plan.monthlyValue)}/mês • Max. {plan.maxDependents} dependentes
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  <TextField
                    fullWidth
                    label="Data de Início"
                    name="startDate"
                    type="date"
                    value={contract.startDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Data de Término"
                    name="endDate"
                    type="date"
                    value={contract.endDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    required
                  />

                  <TextField
                    fullWidth
                    label="Número de Dependentes"
                    name="dependentCount"
                    type="number"
                    value={contract.dependentCount}
                    onChange={handleInputChange}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: selectedPlan?.maxDependents || 10
                      }
                    }}
                    helperText={selectedPlan ? `Máximo: ${selectedPlan.maxDependents} dependentes` : ''}
                  />

                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={contract.isActive}
                          onChange={handleInputChange}
                          name="isActive"
                          color="success"
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography>Contrato Ativo</Typography>
                          <Tooltip title="Define se o contrato estará ativo imediatamente após a criação">
                            <Info fontSize="small" color="action" />
                          </Tooltip>
                        </Box>
                      }
                    />
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Coluna direita - Preview do Contrato */}
          <Box>
            <Card sx={{ position: 'sticky', top: 24 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AttachMoney color="primary" />
                  Resumo do Contrato
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {selectedPlan ? (
                  <Stack spacing={2}>
                    <Box>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Plano Selecionado
                      </Typography>
                      <Typography variant="h6">{selectedPlan.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {selectedPlan.description}
                      </Typography>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Valores
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">Plano base:</Typography>
                        <Typography variant="body2">{formatCurrency(selectedPlan.monthlyValue)}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography variant="body2">
                          Dependentes ({contract.dependentCount}):
                        </Typography>
                        <Typography variant="body2">
                          {formatCurrency(contract.dependentCount * selectedPlan.dependentAdditional)}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1 }} />
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Total Mensal:
                        </Typography>
                        <Typography variant="subtitle1" fontWeight="bold" color="primary">
                          {formatCurrency(contract.monthlyFee)}
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                          Valor Anual:
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(contract.value)}
                        </Typography>
                      </Box>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Status
                      </Typography>
                      <Chip
                        icon={contract.isActive ? <CheckCircle /> : <Cancel />}
                        label={contract.isActive ? 'Ativo' : 'Inativo'}
                        color={contract.isActive ? 'success' : 'default'}
                        variant="outlined"
                      />
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle2" gutterBottom>
                        Período
                      </Typography>
                      <Typography variant="body2">
                        <strong>Início:</strong> {new Date(contract.startDate).toLocaleDateString('pt-BR')}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Término:</strong> {new Date(contract.endDate).toLocaleDateString('pt-BR')}
                      </Typography>
                    </Box>
                  </Stack>
                ) : (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Selecione um plano para ver o resumo
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Actions */}
        <Box display="flex" gap={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate('/contratos')}
            disabled={loading}
            size="large"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || 
              (clientTab === 'existing' && !contract.clientId) || 
              (clientTab === 'new' && (!newClient.name || !newClient.cpf || !newClient.phone || !newClient.email)) ||
              !selectedPlan}
            startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            size="large"
          >
            {loading ? 'Criando...' : 'Criar Contrato'}
          </Button>
        </Box>
      </form>
    </Container>
  );
}