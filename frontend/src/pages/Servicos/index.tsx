import React, { useState } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Chip,
  Tabs,
  Tab,
  Divider,
} from "@mui/material";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArchiveIcon from "@mui/icons-material/Archive";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SecurityIcon from "@mui/icons-material/Security";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import BusinessIcon from "@mui/icons-material/Business";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import PrintIcon from "@mui/icons-material/Print";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChurchIcon from "@mui/icons-material/Church";
import WorkIcon from "@mui/icons-material/Work";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InventoryIcon from "@mui/icons-material/Inventory";
import SpaIcon from "@mui/icons-material/Spa";

// Exemplo de planos e clientes (substitua por dados reais)
const planos = [{ id: 1, nome: "Plano Ouro" }, { id: 2, nome: "Plano Prata" }, { id: 3, nome: "Plano Bronze" }];
const clientes = [{ id: 1, nome: "João Silva" }, { id: 2, nome: "Maria Souza" }, { id: 3, nome: "Pedro Santos" }];

const icones = {
  "Organização de Velórios": <EventAvailableIcon color="primary" sx={{ fontSize: 40 }} />,
  "Transporte Funerário": <DirectionsCarIcon color="primary" sx={{ fontSize: 40 }} />,
  "Floricultura": <LocalFloristIcon color="primary" sx={{ fontSize: 40 }} />,
  "Fotografia e Filmagem": <CameraAltIcon color="primary" sx={{ fontSize: 40 }} />,
  "Música e Coral": <MusicNoteIcon color="primary" sx={{ fontSize: 40 }} />,
  "Segurança": <SecurityIcon color="primary" sx={{ fontSize: 40 }} />,
  "Limpeza e Higienização": <CleaningServicesIcon color="primary" sx={{ fontSize: 40 }} />,
  "Documentação Legal": <BusinessIcon color="primary" sx={{ fontSize: 40 }} />,
  "Buffet e Recepção": <LocalDiningIcon color="primary" sx={{ fontSize: 40 }} />,
  "Impressões e Comunicados": <PrintIcon color="primary" sx={{ fontSize: 40 }} />,
  "Cuidados Especiais": <FavoriteIcon color="primary" sx={{ fontSize: 40 }} />,
  "Serviços Religiosos": <ChurchIcon color="primary" sx={{ fontSize: 40 }} />,
  "Preparação do Corpo": <WorkIcon color="primary" sx={{ fontSize: 40 }} />,
  "Atendimento Domiciliar": <HomeIcon color="primary" sx={{ fontSize: 40 }} />,
  "Apoio Psicológico": <PeopleIcon color="primary" sx={{ fontSize: 40 }} />,
  "Translado": <LocalShippingIcon color="primary" sx={{ fontSize: 40 }} />,
  "Urnas e Caixões": <InventoryIcon color="primary" sx={{ fontSize: 40 }} />,
  "Tanatopraxia": <SpaIcon color="primary" sx={{ fontSize: 40 }} />,
};

type Servico = {
  id: number;
  title: string;
  description: string;
  icon: keyof typeof icones;
  planoId?: number;
  clienteId?: number;
  concluido?: boolean;
  arquivado?: boolean;
  // Propriedades específicas do serviço
  dataFuneral?: string;
  horarioFuneral?: string;
  localFuneral?: string;
  cemiterio?: string;
  observacoes?: string;
  responsavel?: string;
  telefoneContato?: string;
  dataCriacao?: string;
  dataConclusao?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  valor?: number;
  fornecedor?: string;
};

type FormData = {
  title: string;
  description: string;
  icon: keyof typeof icones;
  planoId?: number;
  clienteId?: number;
  dataFuneral?: string;
  horarioFuneral?: string;
  localFuneral?: string;
  cemiterio?: string;
  observacoes?: string;
  responsavel?: string;
  telefoneContato?: string;
  prioridade?: 'baixa' | 'media' | 'alta';
  valor?: number;
  fornecedor?: string;
};

const Servicos: React.FC = () => {
  const [servicos, setServicos] = useState<Servico[]>([
    {
      id: 1,
      title: "Organização de Velórios",
      description: "Cuidamos de toda a organização do velório, incluindo preparação do ambiente, decoração e coordenação geral",
      icon: "Organização de Velórios",
      dataFuneral: "2024-08-20",
      horarioFuneral: "14:00",
      localFuneral: "Igreja São Pedro",
      responsavel: "João da Silva",
      telefoneContato: "(11) 99999-9999",
      dataCriacao: "2024-08-16",
      prioridade: "alta",
      valor: 2500.00,
    },
    {
      id: 2,
      title: "Transporte Funerário",
      description: "Oferecemos transporte funerário seguro e digno com veículos especializados",
      icon: "Transporte Funerário",
      concluido: true,
      dataConclusao: "2024-08-15",
      prioridade: "media",
      valor: 800.00,
      fornecedor: "Transportes Dignidade",
    },
    {
      id: 3,
      title: "Floricultura",
      description: "Arranjos florais personalizados para homenagear o ente querido",
      icon: "Floricultura",
      arquivado: true,
      concluido: true,
      dataConclusao: "2024-08-10",
      prioridade: "baixa",
      valor: 350.00,
      fornecedor: "Flores & Vida",
    },
    {
      id: 4,
      title: "Preparação do Corpo",
      description: "Serviços de tanatopraxia e preparação adequada do corpo para o velório",
      icon: "Preparação do Corpo",
      dataFuneral: "2024-08-22",
      horarioFuneral: "09:00",
      responsavel: "Dr. Carlos Santos",
      prioridade: "alta",
      valor: 1200.00,
    },
    {
      id: 5,
      title: "Documentação Legal",
      description: "Auxílio na obtenção de certidões de óbito e demais documentos necessários",
      icon: "Documentação Legal",
      dataFuneral: "2024-08-21",
      responsavel: "Advogado Silva",
      prioridade: "alta",
      valor: 400.00,
    },
    {
      id: 6,
      title: "Apoio Psicológico",
      description: "Atendimento psicológico para familiares em momento de luto",
      icon: "Apoio Psicológico",
      responsavel: "Psicóloga Maria",
      telefoneContato: "(11) 88888-8888",
      prioridade: "media",
      valor: 200.00,
    },
  ]);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);
  const [tabValue, setTabValue] = useState(0); // 0: Ativos, 1: Concluídos, 2: Arquivados
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    icon: "Organização de Velórios",
    planoId: undefined,
    clienteId: undefined,
    dataFuneral: "",
    horarioFuneral: "",
    localFuneral: "",
    cemiterio: "",
    observacoes: "",
    responsavel: "",
    telefoneContato: "",
    prioridade: "media",
    valor: 0,
    fornecedor: "",
  });

  // Filtrar serviços por aba
  const servicosFiltrados = servicos.filter((servico) => {
    if (tabValue === 0) return !servico.concluido && !servico.arquivado; // Ativos
    if (tabValue === 1) return servico.concluido && !servico.arquivado; // Concluídos
    if (tabValue === 2) return servico.arquivado; // Arquivados
    return false;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (servico?: Servico) => {
    if (servico) {
      setEditing(servico);
      setForm({
        title: servico.title,
        description: servico.description,
        icon: servico.icon,
        planoId: servico.planoId,
        clienteId: servico.clienteId,
        dataFuneral: servico.dataFuneral || "",
        horarioFuneral: servico.horarioFuneral || "",
        localFuneral: servico.localFuneral || "",
        cemiterio: servico.cemiterio || "",
        observacoes: servico.observacoes || "",
        responsavel: servico.responsavel || "",
        telefoneContato: servico.telefoneContato || "",
        prioridade: servico.prioridade || "media",
        valor: servico.valor || 0,
        fornecedor: servico.fornecedor || "",
      });
    } else {
      setEditing(null);
      setForm({
        title: "",
        description: "",
        icon: "Organização de Velórios",
        planoId: undefined,
        clienteId: undefined,
        dataFuneral: "",
        horarioFuneral: "",
        localFuneral: "",
        cemiterio: "",
        observacoes: "",
        responsavel: "",
        telefoneContato: "",
        prioridade: "media",
        valor: 0,
        fornecedor: "",
      });
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: name === 'valor' ? parseFloat(value) || 0 : value 
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string | number>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ 
      ...prev, 
      [name]: value === "" ? undefined : value 
    }));
  };

  const handleSave = () => {
    if (editing) {
      setServicos((prev) =>
        prev.map((s) => (s.id === editing.id ? { ...s, ...form } : s))
      );
    } else {
      setServicos((prev) => [
        ...prev,
        { 
          ...form, 
          id: Date.now(), 
          concluido: false,
          arquivado: false,
          dataCriacao: new Date().toISOString().split('T')[0]
        },
      ]);
    }
    setOpen(false);
  };

  const handleConcluir = (id: number) => {
    setServicos((prev) =>
      prev.map((s) => 
        s.id === id 
          ? { 
              ...s, 
              concluido: true, 
              dataConclusao: new Date().toISOString().split('T')[0] 
            } 
          : s
      )
    );
  };

  const handleArquivar = (id: number) => {
    setServicos((prev) =>
      prev.map((s) => (s.id === id ? { ...s, arquivado: !s.arquivado } : s))
    );
  };

  const handleReativar = (id: number) => {
    setServicos((prev) =>
      prev.map((s) => 
        s.id === id 
          ? { ...s, concluido: false, arquivado: false, dataConclusao: undefined } 
          : s
      )
    );
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getPrioridadeColor = (prioridade?: string) => {
    switch (prioridade) {
      case 'alta': return 'error';
      case 'media': return 'warning';
      case 'baixa': return 'success';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h3" align="center" color="text.primary" gutterBottom sx={{ fontWeight: 700 }}>
        Gerenciamento de Serviços Funerários
      </Typography>
      <Typography variant="h6" align="center" color="text.secondary" paragraph>
        Gerencie todos os serviços funerários da sua empresa em um só lugar.
      </Typography>

      {/* Estatísticas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {servicos.filter(s => !s.concluido && !s.arquivado).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Serviços Ativos</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" fontWeight="bold">
            {servicos.filter(s => s.concluido && !s.arquivado).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Concluídos</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" fontWeight="bold">
            {servicos.filter(s => s.arquivado).length}
          </Typography>
          <Typography variant="body2" color="text.secondary">Arquivados</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="info.main" fontWeight="bold">
            {formatCurrency(servicos.reduce((total, s) => total + (s.valor || 0), 0))}
          </Typography>
          <Typography variant="body2" color="text.secondary">Valor Total</Typography>
        </Card>
      </Box>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ativos" />
          <Tab label="Concluídos" />
          <Tab label="Arquivados" />
        </Tabs>
        <Button variant="contained" onClick={() => handleOpen()}>
          Adicionar Serviço
        </Button>
      </Box>
      
      {/* Grid responsivo usando CSS Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)'
          },
          gap: 3,
          mt: 4
        }}
      >
        {servicosFiltrados.map((servico) => (
          <Card
            key={servico.id}
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: 3,
              borderRadius: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 6 },
              opacity: servico.arquivado ? 0.7 : 1,
              border: servico.concluido ? '2px solid #4caf50' : servico.arquivado ? '2px solid #ff9800' : 'none',
            }}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                {icones[servico.icon]}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {servico.title}
                  </Typography>
                  <Stack direction="row" spacing={1} mt={1}>
                    {servico.concluido && (
                      <Chip label="Concluído" size="small" color="success" />
                    )}
                    {servico.arquivado && (
                      <Chip label="Arquivado" size="small" color="warning" />
                    )}
                    {servico.prioridade && (
                      <Chip 
                        label={servico.prioridade.toUpperCase()} 
                        size="small" 
                        color={getPrioridadeColor(servico.prioridade)} 
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {servico.description}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Informações detalhadas */}
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                  <CalendarTodayIcon fontSize="small" />
                  Data: {formatDate(servico.dataFuneral)}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon fontSize="small" />
                  Horário: {servico.horarioFuneral || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary" display="flex" alignItems="center" gap={1}>
                  <LocationOnIcon fontSize="small" />
                  Local: {servico.localFuneral || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Valor:</strong> {formatCurrency(servico.valor)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Plano:</strong> {planos.find(p => p.id === servico.planoId)?.nome || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Cliente:</strong> {clientes.find(c => c.id === servico.clienteId)?.nome || "-"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Responsável:</strong> {servico.responsavel || "-"}
                </Typography>
                {servico.fornecedor && (
                  <Typography variant="body2" color="text.secondary">
                    <strong>Fornecedor:</strong> {servico.fornecedor}
                  </Typography>
                )}
              </Stack>

              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
                <Button variant="outlined" onClick={() => handleOpen(servico)} size="small">
                  Editar
                </Button>
                
                {!servico.concluido && !servico.arquivado && (
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleConcluir(servico.id)}
                    size="small"
                  >
                    Concluir
                  </Button>
                )}

                {servico.concluido && !servico.arquivado && (
                  <>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={() => handleArquivar(servico.id)}
                      size="small"
                      startIcon={<ArchiveIcon />}
                    >
                      Arquivar
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleReativar(servico.id)}
                      size="small"
                    >
                      Reativar
                    </Button>
                  </>
                )}

                {servico.arquivado && (
                  <Button
                    variant="outlined"
                    onClick={() => handleArquivar(servico.id)}
                    size="small"
                  >
                    Desarquivar
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {servicosFiltrados.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="text.secondary">
            {tabValue === 0 && "Nenhum serviço ativo encontrado"}
            {tabValue === 1 && "Nenhum serviço concluído encontrado"}
            {tabValue === 2 && "Nenhum serviço arquivado encontrado"}
          </Typography>
        </Box>
      )}

      {/* Dialog para adicionar/editar serviços */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle>{editing ? "Editar Serviço" : "Adicionar Serviço"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 1 }}>
            {/* Coluna 1 - Informações Básicas */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Informações Básicas
              </Typography>
              <TextField
                margin="dense"
                label="Título"
                name="title"
                fullWidth
                value={form.title}
                onChange={handleTextChange}
                required
              />
              <TextField
                margin="dense"
                label="Descrição"
                name="description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={handleTextChange}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  name="icon"
                  value={form.icon}
                  label="Tipo de Serviço"
                  onChange={handleSelectChange}
                >
                  {Object.keys(icones).map((key) => (
                    <MenuItem key={key} value={key}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        {icones[key as keyof typeof icones]}
                        <span>{key}</span>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="Valor (R$)"
                name="valor"
                type="number"
                fullWidth
                value={form.valor}
                onChange={handleTextChange}
                inputProps={{ step: 0.01, min: 0 }}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Prioridade</InputLabel>
                <Select
                  name="prioridade"
                  value={form.prioridade || ""}
                  label="Prioridade"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="baixa">Baixa</MenuItem>
                  <MenuItem value="media">Média</MenuItem>
                  <MenuItem value="alta">Alta</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Coluna 2 - Detalhes do Funeral */}
            <Box>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Detalhes do Funeral
              </Typography>
              <TextField
                margin="dense"
                label="Data do Funeral"
                name="dataFuneral"
                type="date"
                fullWidth
                value={form.dataFuneral}
                onChange={handleTextChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Horário do Funeral"
                name="horarioFuneral"
                type="time"
                fullWidth
                value={form.horarioFuneral}
                onChange={handleTextChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                margin="dense"
                label="Local do Funeral"
                name="localFuneral"
                fullWidth
                value={form.localFuneral}
                onChange={handleTextChange}
                placeholder="Igreja, capela, etc."
              />
              <TextField
                margin="dense"
                label="Cemitério"
                name="cemiterio"
                fullWidth
                value={form.cemiterio}
                onChange={handleTextChange}
              />
              <TextField
                margin="dense"
                label="Responsável"
                name="responsavel"
                fullWidth
                value={form.responsavel}
                onChange={handleTextChange}
                placeholder="Nome do responsável"
              />
              <TextField
                margin="dense"
                label="Telefone de Contato"
                name="telefoneContato"
                fullWidth
                value={form.telefoneContato}
                onChange={handleTextChange}
                placeholder="(11) 99999-9999"
              />
            </Box>
          </Box>

          {/* Linha completa para campos maiores */}
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Plano</InputLabel>
              <Select
                name="planoId"
                value={form.planoId || ""}
                label="Plano"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Nenhum</MenuItem>
                {planos.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Cliente Falecido</InputLabel>
              <Select
                name="clienteId"
                value={form.clienteId || ""}
                label="Cliente Falecido"
                onChange={handleSelectChange}
              >
                <MenuItem value="">Nenhum</MenuItem>
                {clientes.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.nome}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Fornecedor"
              name="fornecedor"
              fullWidth
              value={form.fornecedor}
              onChange={handleTextChange}
              placeholder="Nome do fornecedor do serviço"
            />
            <TextField
              margin="dense"
              label="Observações"
              name="observacoes"
              fullWidth
              multiline
              rows={3}
              value={form.observacoes}
              onChange={handleTextChange}
              placeholder="Informações adicionais, pedidos especiais, etc."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Servicos;