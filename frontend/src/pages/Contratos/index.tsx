import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  Stack,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add"; // Importação correta

// Mock data for plans
const PLANS = [
  {
    id: "basic",
    name: "Plano Básico",
    details: [
      "Atendimento 24h",
      "Urna simples",
      "Translado até 100km",
      "Velório de até 4h",
    ],
  },
  {
    id: "premium",
    name: "Plano Premium",
    details: [
      "Atendimento 24h",
      "Urna luxo",
      "Translado ilimitado",
      "Velório de até 12h",
      "Coroa de flores",
      "Sala VIP",
    ],
  },
  {
    id: "familiar",
    name: "Plano Familiar",
    details: [
      "Cobertura para até 5 membros",
      "Todos benefícios do Premium",
      "Descontos em serviços adicionais",
    ],
  },
];

// Mock initial contracts
const initialContracts = [
  {
    id: 1,
    client: "João da Silva",
    planId: "premium",
    active: true,
    createdAt: "2024-06-01",
  },
  {
    id: 2,
    client: "Maria Oliveira",
    planId: "basic",
    active: false,
    createdAt: "2024-05-15",
  },
];

const getPlanById = (id: string) => PLANS.find((p) => p.id === id);

export default function ContratosPage() {
  const [contracts, setContracts] = useState(initialContracts);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    client: "",
    planId: "",
    active: true,
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setForm({ client: "", planId: "", active: true });
  };

  // Handler para inputs de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para selects
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler para switches
  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContracts((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        client: form.client,
        planId: form.planId,
        active: form.active,
        createdAt: new Date().toISOString().slice(0, 10),
      },
    ]);
    handleClose();
  };

  const handleToggleActive = (id: number) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, active: !c.active } : c
      )
    );
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1100, margin: "0 auto" }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Gerenciamento de Contratos
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Visualize, crie e gerencie contratos dos clientes da funerária.
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 3 }}
        onClick={handleOpen}
      >
        Novo Contrato
      </Button>
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Plano</TableCell>
              <TableCell>Ativo</TableCell>
              <TableCell>Data de Criação</TableCell>
              <TableCell>Detalhes do Plano</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => {
              const plan = getPlanById(contract.planId);
              return (
                <TableRow key={contract.id}>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>
                    <Chip
                      label={plan?.name}
                      color={
                        contract.planId === "premium"
                          ? "primary"
                          : contract.planId === "familiar"
                          ? "success"
                          : "default"
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={contract.active}
                      onChange={() => handleToggleActive(contract.id)}
                      color="success"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(contract.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {plan?.details.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      color={contract.active ? "error" : "success"}
                      onClick={() => handleToggleActive(contract.id)}
                    >
                      {contract.active ? "Inativar" : "Ativar"}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
            {contracts.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Nenhum contrato cadastrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for new contract */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Novo Contrato</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                label="Nome do Cliente"
                name="client"
                value={form.client}
                onChange={handleTextChange}
                required
                fullWidth
              />
              <FormControl fullWidth required>
                <InputLabel>Tipo de Plano</InputLabel>
                <Select
                  name="planId"
                  value={form.planId}
                  label="Tipo de Plano"
                  onChange={handleSelectChange}
                >
                  {PLANS.map((plan) => (
                    <MenuItem key={plan.id} value={plan.id}>
                      {plan.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {form.planId && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Detalhes do Plano Selecionado:
                  </Typography>
                  <ul>
                    {getPlanById(form.planId)?.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </Box>
              )}
              <FormControl>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Switch
                    checked={form.active}
                    onChange={handleSwitchChange}
                    name="active"
                    color="success"
                  />
                  <Typography>
                    {form.active ? "Ativo" : "Inativo"}
                  </Typography>
                </Stack>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}