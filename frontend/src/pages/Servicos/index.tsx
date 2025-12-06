import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, Building, Users, Car, FlowerIcon as Flower, RefreshCcw, Droplet, Flame, Feather } from 'lucide-react';
import { Typography, Box, Tabs, Tab, CardContent, Stack, Chip, Divider, Dialog, DialogTitle, DialogContent, TextField, FormControl, InputLabel, Select, MenuItem, DialogActions, Alert, Autocomplete, FormHelperText } from '@mui/material';
import Card from '@mui/material/Card';
import Button from '../../components/Button';
import { SelectChangeEvent } from "@mui/material";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ApiService from "../../services/apiService";
import PageLayout from "../../components/PageLayout";


const icones = {
  "Serviço Funerário": <Feather size={32} strokeWidth={1.8} />,
  "Organização de Velórios": <Calendar size={32} strokeWidth={1.8} />,
  "Transporte Funerário": <Car size={32} strokeWidth={1.8} />,
  "Thanatopraxia": <Droplet size={32} strokeWidth={1.8} />,
  "Cremação": <Flame size={32} strokeWidth={1.8} />,
  "Floricultura": <Flower size={32} strokeWidth={1.8} />,
  "Documentação Legal": <Building size={32} strokeWidth={1.8} />,
  "Apoio Psicológico": <Users size={32} strokeWidth={1.8} />,
};

type ServiceCategory = {
  id: string;
  label: string;
  description: string;
  iconKeys: (keyof typeof icones)[];
  primaryIconKey: keyof typeof icones;
};

const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: "transport",
    label: "Transporte",
    description: "Logística e translado em veículos funerários.",
    iconKeys: ["Transporte Funerário"],
    primaryIconKey: "Transporte Funerário",
  },
  {
    id: "thanatopraxia",
    label: "Thanatopraxia",
    description: "Preparação técnica e conservação do corpo.",
    iconKeys: ["Thanatopraxia"],
    primaryIconKey: "Thanatopraxia",
  },
  {
    id: "cremacao",
    label: "Cremação",
    description: "Procedimentos e cerimônias de cremação.",
    iconKeys: ["Cremação"],
    primaryIconKey: "Cremação",
  },
  {
    id: "funeral",
    label: "Funeral",
    description: "Organização completa de velórios e cerimônias.",
    iconKeys: ["Serviço Funerário", "Organização de Velórios"],
    primaryIconKey: "Serviço Funerário",
  },
];

const DEFAULT_CATEGORY_ID = "funeral";

const renderIcon = (iconKey: keyof typeof icones, size = 32) => {
  const iconNode = icones[iconKey];
  if (React.isValidElement(iconNode)) {
    const typedIcon = iconNode as React.ReactElement<{ size?: number }>;
    return React.cloneElement(typedIcon, { size });
  }

  return iconNode;
};
const CATEGORY_STYLES: Record<string, {
  accent: string;
  iconBg: string;
  chip: {
    active: "success" | "primary" | "secondary" | "default" | "warning" | "info" | "error";
    concluded: "success" | "primary" | "secondary" | "default" | "warning" | "info" | "error";
    archived: "success" | "primary" | "secondary" | "default" | "warning" | "info" | "error";
  };
}> = {
  transport: {
    accent: "#2563eb",
    iconBg: "rgba(37,99,235,0.12)",
    chip: { active: "success", concluded: "primary", archived: "warning" },
  },
  thanatopraxia: {
    accent: "#0d9488",
    iconBg: "rgba(13,148,136,0.12)",
    chip: { active: "success", concluded: "primary", archived: "warning" },
  },
  cremacao: {
    accent: "#f97316",
    iconBg: "rgba(249,115,22,0.14)",
    chip: { active: "success", concluded: "primary", archived: "warning" },
  },
  funeral: {
    accent: "#7c3aed",
    iconBg: "rgba(124,58,237,0.12)",
    chip: { active: "success", concluded: "primary", archived: "warning" },
  },
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
  const defaultCategory = SERVICE_CATEGORIES.find((category) => category.id === DEFAULT_CATEGORY_ID) ?? SERVICE_CATEGORIES[0];
  const defaultIcon = (defaultCategory?.primaryIconKey ?? "Serviço Funerário") as keyof typeof icones;
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
  const [activeCategory, setActiveCategory] = useState<string>(defaultCategory?.id ?? DEFAULT_CATEGORY_ID);
  const [tabValue, setTabValue] = useState(0); // 0: Ativos, 1: Concluídos, 2: Arquivados
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    icon: defaultIcon,
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
  const activeCategoryConfig = useMemo(
    () => SERVICE_CATEGORIES.find((category) => category.id === activeCategory) ?? null,
    [activeCategory]
  );
  const categoryStyleForIcon = useCallback(
    (iconKey: keyof typeof icones) => {
      const category = SERVICE_CATEGORIES.find((item) => item.iconKeys.includes(iconKey));
      if (!category) {
        return CATEGORY_STYLES[DEFAULT_CATEGORY_ID];
      }

      return CATEGORY_STYLES[category.id] ?? CATEGORY_STYLES[DEFAULT_CATEGORY_ID];
    },
    []
  );
  const formIconStyle = useMemo(() => categoryStyleForIcon(form.icon), [form.icon, categoryStyleForIcon]);
  const servicosDaCategoria = useMemo(() => {
    if (!activeCategoryConfig) {
      return servicos;
    }

    return servicos.filter((servico) => activeCategoryConfig.iconKeys.includes(servico.icon));
  }, [servicos, activeCategoryConfig]);
  const categoryStats = useMemo(() => {
    return SERVICE_CATEGORIES.reduce<Record<string, {
      total: number;
      ativos: number;
      concluidos: number;
      arquivados: number;
      valorTotal: number;
    }>>((acc, category) => {
      const items = servicos.filter((servico) => category.iconKeys.includes(servico.icon));
      const ativos = items.filter((item) => !item.concluido && !item.arquivado).length;
      const concluidos = items.filter((item) => item.concluido && !item.arquivado).length;
      const arquivados = items.filter((item) => item.arquivado).length;
      const valorTotal = items.reduce((total, item) => total + (item.valor || 0), 0);

      acc[category.id] = {
        total: items.length,
        ativos,
        concluidos,
        arquivados,
        valorTotal,
      };

      return acc;
    }, {});
  }, [servicos]);
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

        const statusRaw = raw?.status ?? raw?.Status ?? raw?.ativo ?? raw?.isActive ?? raw?.active;
        let isActive = true;
        if (typeof statusRaw === "string") {
          const lowered = statusRaw.toLowerCase();
          if (lowered.includes("inativ") || lowered.includes("desativ") || lowered.includes("cancel")) {
            isActive = false;
          }
        } else if (typeof statusRaw === "boolean") {
          isActive = statusRaw;
        }

        if (!isActive) {
          return acc;
        }

        acc.push({
          id,
          nome: raw?.name ?? raw?.fullName ?? raw?.clientName ?? raw?.nome ?? `Cliente ${id}`,
          email: raw?.email ?? raw?.Email ?? raw?.mail ?? undefined,
        });

        return acc;
      }, []);

      const normalizedPlanos: Plano[] = (rawPlanos as any[]).reduce<Plano[]>((acc, raw) => {
        const id = Number(raw?.id ?? raw?.planId ?? raw?.PlanId ?? raw?.funeralPlansId);
        if (!Number.isFinite(id)) {
          return acc;
        }

        const availableRaw = raw?.available ?? raw?.isAvailable ?? raw?.ativo ?? raw?.status;
        let isAvailable = true;
        if (typeof availableRaw === "string") {
          const lowered = availableRaw.toLowerCase();
          if (lowered.includes("inativ") || lowered.includes("desativ") || lowered.includes("indispon")) {
            isAvailable = false;
          }
        } else if (typeof availableRaw === "boolean") {
          isAvailable = availableRaw;
        }

        if (!isAvailable) {
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

        const normalizeName = (value: unknown) => (typeof value === "string" ? value.trim().toLowerCase() : "");
        const possibleClientNames = [
          raw?.clientName,
          raw?.clienteNome,
          raw?.nomeCliente,
          raw?.client?.name,
          raw?.client?.fullName,
          raw?.client?.nome,
          raw?.cliente?.nome,
          raw?.cliente?.name,
        ]
          .map(normalizeName)
          .filter((value) => value.length > 0);
        const isClientName = (value: unknown) => {
          const normalized = normalizeName(value);
          return normalized.length > 0 && possibleClientNames.includes(normalized);
        };

        const titleCandidates: unknown[] = [
          raw?.title,
          raw?.serviceTitle,
          raw?.serviceName,
          raw?.nomeServico,
          raw?.descricao,
          raw?.description,
        ];
        let resolvedTitle = "";
        for (const candidate of titleCandidates) {
          if (typeof candidate !== "string") {
            continue;
          }

          const trimmed = candidate.trim();
          if (!trimmed) {
            continue;
          }

          if (isClientName(trimmed)) {
            continue;
          }

          resolvedTitle = trimmed;
          break;
        }

        if (!resolvedTitle) {
          resolvedTitle = `Serviço ${id}`;
        }

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
          title: resolvedTitle,
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
      const planosAtivosIds = new Set<number>(normalizedPlanos.map((plano) => plano.id));

      const beneficioPorPlanoMap = (rawBeneficios as any[]).reduce<Record<number, number[]>>((acc, raw) => {
        const planId = Number(raw?.funeralPlansId ?? raw?.planId ?? raw?.PlanoId ?? raw?.funeralPlanId);
        const benefitId = Number(raw?.benefitsId ?? raw?.benefitId ?? raw?.BenefitId ?? raw?.beneficioId);

        if (!Number.isFinite(planId) || !Number.isFinite(benefitId) || !planosAtivosIds.has(planId)) {
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

        if (!Number.isFinite(clientId) || !Number.isFinite(planId) || !planosAtivosIds.has(planId)) {
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
    return servicosDaCategoria.filter((servico) => {
      if (tabValue === 0) return !servico.concluido && !servico.arquivado; // Ativos
      if (tabValue === 1) return servico.concluido && !servico.arquivado; // Concluídos
      if (tabValue === 2) return servico.arquivado; // Arquivados
      return false;
    });
  }, [servicosDaCategoria, tabValue]);

  const estatisticas = useMemo(() => {
    const ativos = servicosDaCategoria.filter((s) => !s.concluido && !s.arquivado).length;
    const concluidos = servicosDaCategoria.filter((s) => s.concluido && !s.arquivado).length;
    const arquivados = servicosDaCategoria.filter((s) => s.arquivado).length;
    const valorTotal = servicosDaCategoria.reduce((total, s) => total + (s.valor || 0), 0);

    return { ativos, concluidos, arquivados, valorTotal };
  }, [servicosDaCategoria]);

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

  const selectablePlans = useMemo(() => {
    if (selectedClientPlanIds.length > 0) {
      const filtered = planos.filter((plano) => selectedClientPlanIds.includes(plano.id));
      if (filtered.length > 0) {
        return filtered;
      }
    }

    return planos;
  }, [planos, selectedClientPlanIds]);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCategoryTabChange = (_: React.SyntheticEvent, newCategoryId: string) => {
    setActiveCategory(newCategoryId);
    setTabValue(0);
  };

  const handleOpen = (servico?: Servico, presetIcon?: Servico["icon"]) => {
    setSaveError(null);
    setSaving(false);
    if (servico) {
      setEditing(servico);
      const relatedCategory = SERVICE_CATEGORIES.find((category) => category.iconKeys.includes(servico.icon));
      if (relatedCategory) {
        setActiveCategory(relatedCategory.id);
      }
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
      const targetIcon = presetIcon ?? activeCategoryConfig?.primaryIconKey ?? defaultIcon;
      if (presetIcon) {
        const targetCategory = SERVICE_CATEGORIES.find((category) => category.iconKeys.includes(presetIcon));
        if (targetCategory) {
          setActiveCategory(targetCategory.id);
        }
      }
      setForm({
        title: "",
        description: "",
        icon: targetIcon,
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

      const planIds = (planosPorCliente[newValue.id] ?? []).filter((planId) =>
        planos.some((plano) => plano.id === planId)
      );
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

    const planIds = (planosPorCliente[form.clienteId] ?? []).filter((planId) =>
      planos.some((plano) => plano.id === planId)
    );
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
    <PageLayout
      title="Serviços Funerários"
      actions={(
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Button
            variant="outline"
            icon={RefreshCcw}
            onClick={loadServicos}
            loading={loading}
          >
            Atualizar dados
          </Button>
          <Button
            variant="primary"
            onClick={() => handleOpen(undefined, activeCategoryConfig?.primaryIconKey ?? defaultIcon)}
          >
            Adicionar Serviço
          </Button>
        </Stack>
      )}
    >
      <Typography variant="body1" color="text.secondary">
        Escolha o tipo de serviço para visualizar indicadores e gerenciar processos específicos.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeCategory}
          onChange={handleCategoryTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
        >
          {SERVICE_CATEGORIES.map((category) => {
            const stats = categoryStats[category.id] ?? {
              total: 0,
              ativos: 0,
              concluidos: 0,
              arquivados: 0,
              valorTotal: 0,
            };
            const categoryStyle = CATEGORY_STYLES[category.id] ?? CATEGORY_STYLES[DEFAULT_CATEGORY_ID];

            return (
              <Tab
                key={category.id}
                value={category.id}
                label={
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: categoryStyle.iconBg,
                        color: categoryStyle.accent,
                      }}
                    >
                      {renderIcon(category.primaryIconKey, 18)}
                    </Box>
                    <Box textAlign="left">
                      <Typography variant="button" sx={{ textTransform: 'none', display: 'block' }}>
                        {category.label}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        {loading ? '...' : `${stats.total} serviços`}
                      </Typography>
                    </Box>
                  </Stack>
                }
                sx={{
                  alignItems: 'flex-start',
                  textTransform: 'none',
                  minHeight: 64,
                  py: 1.5,
                  px: 2,
                }}
              />
            );
          })}
        </Tabs>
      </Box>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="overline" color="primary.main" sx={{ letterSpacing: 1 }}>
              Ativos
            </Typography>
            <Typography variant="h4" color="primary.main" fontWeight="bold">
              {loading ? '...' : estatisticas.ativos}
            </Typography>
            <Typography variant="body2" color="text.secondary">Serviços em andamento</Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="overline" color="success.main" sx={{ letterSpacing: 1 }}>
              Concluídos
            </Typography>
            <Typography variant="h4" color="success.main" fontWeight="bold">
              {loading ? '...' : estatisticas.concluidos}
            </Typography>
            <Typography variant="body2" color="text.secondary">Processos finalizados</Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="overline" color="warning.main" sx={{ letterSpacing: 1 }}>
              Arquivados
            </Typography>
            <Typography variant="h4" color="warning.main" fontWeight="bold">
              {loading ? '...' : estatisticas.arquivados}
            </Typography>
            <Typography variant="body2" color="text.secondary">Aguardando nova ação</Typography>
          </Card>
          <Card sx={{ p: 3, textAlign: 'center', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="overline" color="info.main" sx={{ letterSpacing: 1 }}>
              Valor total
            </Typography>
            <Typography variant="h4" color="info.main" fontWeight="bold">
              {loading ? '...' : formatCurrency(estatisticas.valorTotal)}
            </Typography>
            <Typography variant="body2" color="text.secondary">Somatório financeiro</Typography>
          </Card>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
          <Tab label="Ativos" />
          <Tab label="Concluídos" />
          <Tab label="Arquivados" />
        </Tabs>
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
        {servicosFiltrados.map((servico) => {
          const style = categoryStyleForIcon(servico.icon);
          const borderColor = servico.concluido ? '#4caf50' : servico.arquivado ? '#ff9800' : style.accent;

          return (
          <Card
            key={servico.id}
            sx={(theme) => ({
              height: "100%",
              display: "flex",
              flexDirection: "column",
              boxShadow: 2,
              borderRadius: 2,
              transition: "transform 0.2s ease-in-out",
              "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
              opacity: servico.arquivado ? 0.7 : 1,
              border: `1px solid ${servico.concluido || servico.arquivado ? borderColor : theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
            })}
          >
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: style.iconBg,
                    color: style.accent,
                  }}
                >
                  {renderIcon(servico.icon, 26)}
                </Box>
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

              <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                <Chip
                  label={`Plano: ${planos.find(p => p.id === servico.planoId)?.nome || "-"}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  label={`Cliente: ${clientes.find(c => c.id === servico.clienteId)?.nome || "-"}`}
                  size="small"
                  variant="outlined"
                  color="secondary"
                />
                {servico.responsavel && (
                  <Chip
                    label={`Responsável: ${servico.responsavel}`}
                    size="small"
                    variant="outlined"
                    color="info"
                  />
                )}
              </Stack>

              <Divider sx={{ my: 2, opacity: 0.6 }} />

              {/* Informações detalhadas */}
              <Stack spacing={1.2}>
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
          );
        })}
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
            {tabValue === 0 && `Nenhum serviço ativo encontrado para ${activeCategoryConfig?.label ?? "esta categoria"}`}
            {tabValue === 1 && `Nenhum serviço concluído encontrado para ${activeCategoryConfig?.label ?? "esta categoria"}`}
            {tabValue === 2 && `Nenhum serviço arquivado encontrado para ${activeCategoryConfig?.label ?? "esta categoria"}`}
          </Typography>
        </Box>
      )}

      {/* Dialog para adicionar/editar serviços */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
        <DialogTitle sx={{ pr: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: formIconStyle.iconBg,
                  color: formIconStyle.accent,
                }}
              >
                {renderIcon(form.icon, 26)}
              </Box>
              <Box>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 2 }}>
                  {activeCategoryConfig?.label ?? "Serviço"}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {editing ? "Editar Serviço" : "Adicionar Serviço"}
                </Typography>
              </Box>
            </Stack>
            <Chip label={form.icon} color="primary" variant="outlined" size="small" />
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pb: 0 }}>
          {saveError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {saveError}
            </Alert>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 1 }}>
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
                        {renderIcon(key as keyof typeof icones, 18)}
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

          <Divider sx={{ my: 3 }} />

          {/* Linha completa para campos maiores */}
          <Box>
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
              >
                <MenuItem value="">Nenhum</MenuItem>
                {selectablePlans.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.nome}</MenuItem>
                ))}
              </Select>
              {selectedClientPlanIds.length > 0 && selectablePlans.length === 1 && (
                <FormHelperText>
                  Este cliente está vinculado a um único plano pelo contrato vigente. Ajuste apenas se necessário.
                </FormHelperText>
              )}
              {selectedClientPlanIds.length > 0 && selectablePlans.length > 1 && (
                <FormHelperText>
                  Listando apenas os planos associados ao cliente selecionado.
                </FormHelperText>
              )}
            </FormControl>
            {selectedClientPlanIds.length > 0 && selectablePlans.length === 0 && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                O cliente possui contratos, mas nenhum plano ativo está disponível para seleção.
              </Alert>
            )}
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
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose} variant="outline">Cancelar</Button>
          <Button
            onClick={handleSave}
            variant="primary"
            loading={saving}
            disabled={saving || isSaveDisabled}
          >
            {editing ? "Salvar alterações" : "Salvar serviço"}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default Servicos;