import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Building, Users, Car, FlowerIcon as Flower, RefreshCcw } from 'lucide-react';
import { Container, Typography, Box, Tabs, Tab, CardContent, Stack, Chip, Divider, Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, DialogActions, Alert, Autocomplete, FormHelperText } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '../../components/Button';
import { SelectChangeEvent } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApiService from "../../services/apiService";


const icones = {
  "Organização de Velórios": <Calendar className="text-primary" size={32} />,
  "Transporte Funerário": <Car className="text-primary" size={32} />,
  "Floricultura": <Flower className="text-primary" size={32} />,
  "Documentação Legal": <Building className="text-primary" size={32} />,
  "Apoio Psicológico": <Users className="text-primary" size={32} />,
};

type Plano = {
  id: number;
  nome: string;
};

type Cliente = {
  id: number;
  nome: string;
  email?: string;
};

type Beneficio = {
  id: number;
  nome: string;
  descricao?: string;
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
  endTime?: string;
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
  endTime?: string;
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
  const apiService = useMemo(() => ApiService(), []);
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [beneficios, setBeneficios] = useState<Beneficio[]>([]);
  const [beneficiosPorPlano, setBeneficiosPorPlano] = useState<Record<number, number[]>>({});
  const [planosPorCliente, setPlanosPorCliente] = useState<Record<number, number[]>>({});

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
    endTime: "",
    localFuneral: "",
    cemiterio: "",
    observacoes: "",
    responsavel: "",
    telefoneContato: "",
    prioridade: "media",
    valor: 0,
    fornecedor: "",
  });
  const extractPayload = (response: any) => {
    if (!response) return [];
    if (Array.isArray(response.data)) return response.data;
    if (Array.isArray(response.data?.data)) return response.data.data;
    return [];
  };

  const loadServicos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [
        servicosResponse,
        clientesResponse,
        planosResponse,
        contratosResponse,
        beneficiosResponse,
      ] = await Promise.allSettled([
        apiService.get("api/v1/Client"),
        apiService.get("api/v1/FuneralPlans"),
        apiService.get("api/v1/Contracts"),
        apiService.get("api/v1/Benefits"),
        apiService.get("api/v1/BenefitsPlans"),
      ]);

      if (servicosResponse.status !== "fulfilled") {
        throw servicosResponse.reason ?? new Error("Não foi possível carregar os serviços cadastrados.");
      }

      if (clientesResponse.status !== "fulfilled") {
        throw clientesResponse.reason ?? new Error("Não foi possível carregar os clientes disponíveis.");
      }

      if (planosResponse.status !== "fulfilled") {
        throw planosResponse.reason ?? new Error("Não foi possível carregar os planos funerários cadastrados.");
      }

      if (contratosResponse.status !== "fulfilled") {
        console.warn(
          "Não foi possível carregar os contratos para relacionar clientes e planos:",
          contratosResponse.reason
        );
      }

      if (beneficiosResponse.status !== "fulfilled") {
        console.warn("Não foi possível carregar a lista de benefícios:", beneficiosResponse.reason);
      }


      const rawServicos = extractPayload(servicosResponse.value);
      const rawClientes = extractPayload(clientesResponse.value);
      const rawPlanos = extractPayload(planosResponse.value);
      const rawContratos = contratosResponse.status === "fulfilled" ? extractPayload(contratosResponse.value) : [];
      const rawBeneficios = beneficiosResponse.status === "fulfilled" ? extractPayload(beneficiosResponse.value) : [];

      const normalizedClientes: Cliente[] = (rawClientes as any[]).reduce<Cliente[]>((acc, raw) => {
        const id = Number(raw?.id ?? raw?.clientId ?? raw?.clienteId ?? raw?.ClientId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        acc.push({
          id,
          nome: raw?.name ?? raw?.fullName ?? raw?.nome ?? `Cliente ${id}`,
          email: raw?.email ?? raw?.Email ?? raw?.mail ?? undefined,
        });

        return acc;
      }, []);

      const normalizedPlanos: Plano[] = (rawPlanos as any[]).reduce<Plano[]>((acc, raw) => {
        const id = Number(raw?.id ?? raw?.planId ?? raw?.PlanId ?? raw?.funeralPlansId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        acc.push({
          id,
          nome: raw?.name ?? raw?.title ?? raw?.nome ?? `Plano ${id}`,
        });

        return acc;
      }, []);

      const normalizedServicos: Servico[] = (rawServicos as any[]).reduce<Servico[]>((acc, raw) => {
        const id = Number(raw?.id ?? raw?.serviceId ?? raw?.ServicoId ?? raw?.servicesId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        const status = (raw?.status ?? raw?.Status ?? "").toString().toLowerCase();
        const concluido = Boolean(
          raw?.concluido ??
            raw?.concluded ??
            raw?.completed ??
            raw?.isCompleted ??
            status.includes("conclu")
        );
        const arquivadoFromPayload = raw?.arquivado ?? raw?.archived ?? raw?.isArchived;
        const arquivado = (
          typeof arquivadoFromPayload === "boolean"
            ? arquivadoFromPayload
            : arquivadoFromPayload != null
              ? Boolean(arquivadoFromPayload)
              : false
        ) || status.includes("arquiv") || status.includes("archive");

        const iconKey = raw?.icon ?? raw?.serviceType ?? raw?.tipo ?? raw?.category;
        const icon = typeof iconKey === "string" && iconKey in icones ? (iconKey as keyof typeof icones) : "Organização de Velórios";

        const prioridade = (raw?.prioridade ?? raw?.priority ?? "") as Servico["prioridade"];

        const toDateLabel = (value: any) => {
          if (!value) return undefined;
          const date = new Date(value);
          if (!Number.isNaN(date.getTime())) {
            return date.toISOString().split("T")[0];
          }
          if (typeof value === "string") {
            return value;
          }
          return undefined;
        };

        acc.push({
          id,
          title: raw?.title ?? raw?.name ?? raw?.serviceName ?? `Serviço ${id}`,
          description: raw?.description ?? raw?.details ?? raw?.observacoes ?? "Sem descrição disponível.",
          icon,
          planoId: Number(raw?.planId ?? raw?.planoId ?? raw?.funeralPlansId ?? raw?.PlanId ?? NaN) || undefined,
          clienteId: Number(raw?.clientId ?? raw?.clienteId ?? raw?.ClientId ?? NaN) || undefined,
          concluido,
          arquivado,
          dataFuneral: toDateLabel(raw?.dataFuneral ?? raw?.funeralDate),
          horarioFuneral: raw?.horarioFuneral ?? raw?.funeralTime ?? raw?.hora ?? undefined,
          endTime: raw?.endTime ?? undefined,
          localFuneral: raw?.localFuneral ?? raw?.funeralLocation ?? raw?.local ?? undefined,
          cemiterio: raw?.cemiterio ?? raw?.cemetery ?? undefined,
          observacoes: raw?.observacoes ?? raw?.notes ?? undefined,
          responsavel: raw?.responsavel ?? raw?.responsible ?? undefined,
          telefoneContato: raw?.telefoneContato ?? raw?.phone ?? raw?.contactPhone ?? undefined,
          dataCriacao: toDateLabel(raw?.dataCriacao ?? raw?.createdAt ?? raw?.createdOn),
          dataConclusao: toDateLabel(raw?.dataConclusao ?? raw?.completedAt ?? raw?.concludedOn),
          prioridade: prioridade === "alta" || prioridade === "media" || prioridade === "baixa" ? prioridade : undefined,
          valor: Number(raw?.valor ?? raw?.price ?? raw?.amount ?? raw?.value ?? 0) || 0,
          fornecedor: raw?.fornecedor ?? raw?.provider ?? undefined,
        });

        return acc;
      }, []);
      const normalizedBeneficios: Beneficio[] = (rawBeneficios as any[]).reduce<Beneficio[]>((acc, raw) => {
        const id = Number(raw?.id ?? raw?.benefitId ?? raw?.BenefitId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        acc.push({
          id,
          nome: raw?.name ?? raw?.title ?? raw?.benefit ?? `Benefício ${id}`,
          descricao: raw?.description ?? raw?.details ?? undefined,
        });

        return acc;
      }, []);

      const beneficioPorPlanoMap = (rawBeneficios as any[]).reduce<Record<number, number[]>>((acc, raw) => {
        const planId = Number(raw?.funeralPlansId ?? raw?.planId ?? raw?.PlanoId ?? raw?.funeralPlanId);
        const benefitId = Number(raw?.benefitsId ?? raw?.benefitId ?? raw?.BenefitId ?? raw?.beneficioId);

        if (!Number.isFinite(planId) || !Number.isFinite(benefitId)) {
          return acc;
        }

        if (!acc[planId]) {
          acc[planId] = [];
        }

        if (!acc[planId].includes(benefitId)) {
          acc[planId].push(benefitId);
        }

        return acc;
      }, {});

      const planosPorClienteMap = (rawContratos as any[]).reduce<Record<number, number[]>>((acc, raw) => {
        const clientId = Number(raw?.clientId ?? raw?.clienteId ?? raw?.customerId ?? raw?.ClientId);
        const planId = Number(raw?.planoFunerarioId ?? raw?.funeralPlansId ?? raw?.planId ?? raw?.PlanoId);

        if (!Number.isFinite(clientId) || !Number.isFinite(planId)) {
          return acc;
        }

        if (!acc[clientId]) {
          acc[clientId] = [];
        }

        if (!acc[clientId].includes(planId)) {
          acc[clientId].push(planId);
        }

        return acc;
      }, {});

      const clientesOrdenados = [...normalizedClientes].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
      const planosOrdenados = [...normalizedPlanos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
      const beneficiosOrdenados = [...normalizedBeneficios].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
      const servicosOrdenados = [...normalizedServicos].sort((a, b) => {
        const toTimestamp = (value?: string) => {
          if (!value) {
            return 0;
          }

          const date = new Date(value);
          return Number.isNaN(date.getTime()) ? 0 : date.getTime();
        };

        const diffByDate = toTimestamp(b.dataCriacao) - toTimestamp(a.dataCriacao);
        if (diffByDate !== 0) {
          return diffByDate;
        }

        return (b.id ?? 0) - (a.id ?? 0);
      });

      setClientes(clientesOrdenados);
      setPlanos(planosOrdenados);
      setServicos(servicosOrdenados);
      setBeneficios(beneficiosOrdenados);
      setBeneficiosPorPlano(beneficioPorPlanoMap);
      setPlanosPorCliente(planosPorClienteMap);
    } catch (loadError: any) {
      console.error("Erro ao carregar serviços:", loadError);
      const message = loadError?.response?.data?.message || loadError.message || "Não foi possível carregar os serviços cadastrados.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  useEffect(() => {
    loadServicos();
  }, [loadServicos]);

  const servicosFiltrados = useMemo(() => {
    return servicos.filter((servico) => {
      if (tabValue === 0) return !servico.concluido && !servico.arquivado; // Ativos
      if (tabValue === 1) return servico.concluido && !servico.arquivado; // Concluídos
      if (tabValue === 2) return servico.arquivado; // Arquivados
      return false;
    });
  }, [servicos, tabValue]);

  const estatisticas = useMemo(() => {
    const ativos = servicos.filter((s) => !s.concluido && !s.arquivado).length;
    const concluidos = servicos.filter((s) => s.concluido && !s.arquivado).length;
    const arquivados = servicos.filter((s) => s.arquivado).length;
    const valorTotal = servicos.reduce((total, s) => total + (s.valor || 0), 0);

    return { ativos, concluidos, arquivados, valorTotal };
  }, [servicos]);

  const selectedClientOption = useMemo<Cliente | null>(() => {
    if (!form.clienteId) {
      return null;
    }

    return clientes.find((cliente) => cliente.id === form.clienteId) ?? null;
  }, [clientes, form.clienteId]);

  const selectedClientPlanIds = useMemo<number[]>(() => {
    if (!form.clienteId) {
      return [];
    }

    return planosPorCliente[form.clienteId] ?? [];
  }, [form.clienteId, planosPorCliente]);

  const selectedClientPlanNames = useMemo(() => {
    if (selectedClientPlanIds.length === 0) {
      return [] as string[];
    }

    return selectedClientPlanIds.map((planId) => (
      planos.find((plano) => plano.id === planId)?.nome ?? `Plano ${planId}`
    ));
  }, [selectedClientPlanIds, planos]);

  const selectedClientBenefits = useMemo(() => {
    if (selectedClientPlanIds.length === 0) {
      return [] as Beneficio[];
    }

    const seen = new Set<number>();
    const collected: Beneficio[] = [];

    selectedClientPlanIds.forEach((planId) => {
      const benefitIds = beneficiosPorPlano[planId] ?? [];
      benefitIds.forEach((benefitId) => {
        if (seen.has(benefitId)) {
          return;
        }

        seen.add(benefitId);
        const benefit = beneficios.find((item) => item.id === benefitId);
        if (benefit) {
          collected.push(benefit);
        }
      });
    });

    return collected.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR", { sensitivity: "base" }));
  }, [selectedClientPlanIds, beneficiosPorPlano, beneficios]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpen = (servico?: Servico) => {
    setSaveError(null);
    setSaving(false);
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
        endTime: servico.endTime || "",
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
        endTime: "",
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

  const handleClose = () => {
    setOpen(false);
    setSaveError(null);
    setSaving(false);
  };

  const handleSelectClient = (_event: React.SyntheticEvent, newValue: Cliente | null) => {
    setForm((prev) => {
      if (!newValue) {
        return {
          ...prev,
          clienteId: undefined,
          planoId: undefined,
        };
      }

      const planIds = planosPorCliente[newValue.id] ?? [];
      const firstPlanId = planIds[0];

      return {
        ...prev,
        clienteId: newValue.id,
        planoId: firstPlanId ?? prev.planoId ?? undefined,
      };
    });
  };

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
      [name]: value === "" ? undefined : typeof value === "number" ? value : Number.isNaN(Number(value)) ? value : Number(value) 
    }));
  };

  const isSaveDisabled = !form.title.trim();

  useEffect(() => {
    if (!form.clienteId || editing) {
      return;
    }

    const planIds = planosPorCliente[form.clienteId];
    if (!planIds || planIds.length === 0) {
      return;
    }

    if (!form.planoId || !planIds.includes(form.planoId)) {
      setForm((prev) => ({
        ...prev,
        planoId: planIds[0],
      }));
    }
  }, [form.clienteId, form.planoId, planosPorCliente, editing]);

  const handleSave = async () => {
    setSaveError(null);
    setSaving(true);

    const payload = {
      title: form.title.trim(),
      description: form.description?.trim() || "",
      icon: form.icon,
      planId: form.planoId ?? null,
      clientId: form.clienteId ?? null,
      dataFuneral: form.dataFuneral || null,
      horarioFuneral: form.horarioFuneral || null,
      endTime: form.endTime || null,
      localFuneral: form.localFuneral || null,
      cemiterio: form.cemiterio || null,
      observacoes: form.observacoes || null,
      responsavel: form.responsavel || null,
      telefoneContato: form.telefoneContato || null,
      prioridade: form.prioridade || null,
      valor: form.valor ?? 0,
      fornecedor: form.fornecedor || null,
      concluido: editing?.concluido ?? false,
      arquivado: editing?.arquivado ?? false,
    };

    try {
      if (editing) {
        await apiService.put(`api/v1/Benefits/${editing.id}`, payload);
      } else {
        await apiService.post("api/v1/Benefits", payload);
      }

      await loadServicos();
      setOpen(false);
    } catch (saveErr: any) {
      console.error("Erro ao salvar serviço:", saveErr);
      const message = saveErr?.response?.data?.message || saveErr.message || "Não foi possível salvar o serviço.";
      setSaveError(message);
    } finally {
      setSaving(false);
    }
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
    if (value == null) return "-";
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
        Serviços Funerários
      </Typography>

      {/* Estatísticas */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 2 }}>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="primary.main" fontWeight="bold">
            {loading ? '...' : estatisticas.ativos}
          </Typography>
          <Typography variant="body2" color="text.secondary">Serviços Ativos</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" fontWeight="bold">
            {loading ? '...' : estatisticas.concluidos}
          </Typography>
          <Typography variant="body2" color="text.secondary">Concluídos</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="warning.main" fontWeight="bold">
            {loading ? '...' : estatisticas.arquivados}
          </Typography>
          <Typography variant="body2" color="text.secondary">Arquivados</Typography>
        </Card>
        <Card sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h4" color="info.main" fontWeight="bold">
            {loading ? '...' : formatCurrency(estatisticas.valorTotal)}
          </Typography>
          <Typography variant="body2" color="text.secondary">Valor Total</Typography>
        </Card>
      </Box>

      <Box display="flex" justifyContent="flex-end" mb={loading || error ? 2 : 4}>
        <Button
          variant="outline"
          icon={RefreshCcw}
          onClick={loadServicos}
          loading={loading}
        >
          Atualizar dados
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Ativos" />
          <Tab label="Concluídos" />
          <Tab label="Arquivados" />
        </Tabs>
        <Button variant="primary" onClick={() => handleOpen()}>
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
                <Button variant="outline" onClick={() => handleOpen(servico)} size="sm">
                  Editar
                </Button>
                
                {!servico.concluido && !servico.arquivado && (
                  <Button
                    variant="primary"
                    onClick={() => handleConcluir(servico.id)}
                    size="sm"
                  >
                    Concluir
                  </Button>
                )}

                {servico.concluido && !servico.arquivado && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleArquivar(servico.id)}
                      size="sm"
                    >
                      Arquivar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleReativar(servico.id)}
                      size="sm"
                    >
                      Reativar
                    </Button>
                  </>
                )}

                {servico.arquivado && (
                  <Button
                    variant="outline"
                    onClick={() => handleArquivar(servico.id)}
                    size="sm"
                  >
                    Desarquivar
                  </Button>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {loading && servicos.length === 0 && (
        <Box textAlign="center" py={6}>
          <Typography variant="body2" color="text.secondary">
            Carregando serviços cadastrados...
          </Typography>
        </Box>
      )}

      {servicosFiltrados.length === 0 && !loading && (
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
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
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
            <Autocomplete
              options={clientes}
              value={selectedClientOption}
              onChange={handleSelectClient}
              getOptionLabel={(option) => {
                const email = option.email ? ` — ${option.email}` : "";
                return `${option.nome}${email}`;
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              noOptionsText="Nenhum cliente encontrado"
              loading={loading}
              disabled={loading || clientes.length === 0}
              clearOnBlur={false}
              loadingText="Carregando clientes..."
              clearText="Limpar seleção"
              autoHighlight
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cliente"
                  placeholder="Digite o nome ou e-mail para buscar"
                  margin="dense"
                  fullWidth
                />
              )}
              fullWidth
            />
            <FormControl fullWidth margin="dense" sx={{ mt: 1 }}>
              <InputLabel>Plano</InputLabel>
              <Select
                name="planoId"
                value={form.planoId || ""}
                label="Plano"
                onChange={handleSelectChange}
                disabled={selectedClientPlanIds.length === 1}
              >
                <MenuItem value="">Nenhum</MenuItem>
                {planos.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </Select>
              {selectedClientPlanIds.length === 1 && (
                <FormHelperText>
                  Este cliente está vinculado a um único plano pelo contrato vigente.
                </FormHelperText>
              )}
            </FormControl>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Benefícios do plano
              </Typography>
              {selectedClientOption == null ? (
                <Typography variant="body2" color="text.secondary">
                  Selecione um cliente para visualizar os benefícios disponíveis.
                </Typography>
              ) : selectedClientBenefits.length === 0 ? (
                <Alert severity="info" sx={{ py: 0.5 }}>
                  Este cliente não possui benefícios vinculados aos planos atuais.
                </Alert>
              ) : (
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {selectedClientBenefits.map((beneficio) => (
                    <Chip
                      key={beneficio.id}
                      label={beneficio.nome}
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 0.5, mb: 0.5 }}
                      title={beneficio.descricao || undefined}
                    />
                  ))}
                </Stack>
              )}
              {selectedClientPlanNames.length > 0 && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Plano associado: {selectedClientPlanNames.join(", ")}
                </Typography>
              )}
            </Box>
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
          <Button
            onClick={handleSave}
            variant="primary"
            loading={saving}
            disabled={saving || isSaveDisabled}
          >
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Servicos;