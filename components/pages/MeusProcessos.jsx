"use client";

import { useState } from "react";
import {
  FileSearch,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  Download,
  Trash2,
  Filter,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const processes = [
  {
    id: 1,
    title: "Pregão Eletrônico 045/2024",
    organ: "Prefeitura Municipal de São Paulo",
    type: "Edital",
    date: "08 Dez 2024",
    status: "completed",
    errorsFound: 3,
    appealsGenerated: 2,
    value: "R$ 2.450.000,00",
  },
  {
    id: 2,
    title: "Concorrência 012/2024",
    organ: "Governo do Estado do RJ",
    type: "Proposta Vencedora",
    date: "07 Dez 2024",
    status: "completed",
    errorsFound: 5,
    appealsGenerated: 3,
    value: "R$ 15.780.000,00",
  },
  {
    id: 3,
    title: "Tomada de Preços 089/2024",
    organ: "DNIT",
    type: "Edital",
    date: "06 Dez 2024",
    status: "processing",
    errorsFound: 0,
    appealsGenerated: 0,
    value: "R$ 890.000,00",
  },
  {
    id: 4,
    title: "Pregão Eletrônico 044/2024",
    organ: "Banco do Brasil",
    type: "Edital",
    date: "05 Dez 2024",
    status: "completed",
    errorsFound: 2,
    appealsGenerated: 1,
    value: "R$ 3.200.000,00",
  },
  {
    id: 5,
    title: "RDC 007/2024",
    organ: "INFRAERO",
    type: "Edital",
    date: "04 Dez 2024",
    status: "completed",
    errorsFound: 7,
    appealsGenerated: 4,
    value: "R$ 45.000.000,00",
  },
  {
    id: 6,
    title: "Pregão Presencial 023/2024",
    organ: "Prefeitura de Curitiba",
    type: "Proposta Vencedora",
    date: "03 Dez 2024",
    status: "pending",
    errorsFound: 0,
    appealsGenerated: 0,
    value: "R$ 1.150.000,00",
  },
];

export function MeusProcessos() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [openMenuId, setOpenMenuId] = useState(null);

  const filteredProcesses =
    filterStatus === "all"
      ? processes
      : processes.filter((p) => p.status === filterStatus);

  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Concluído
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Processando
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pendente
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Meus Processos</h1>
          <p className="text-slate-500 mt-1">
            Gerencie e acompanhe suas análises de licitações
          </p>
        </div>
        <Button>
          <FileSearch className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-slate-500" />
        <span className="text-sm text-slate-500">Filtrar:</span>
        {["all", "completed", "processing", "pending"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              filterStatus === status
                ? "bg-primary-100 text-primary-700"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {status === "all"
              ? "Todos"
              : status === "completed"
              ? "Concluídos"
              : status === "processing"
              ? "Processando"
              : "Pendentes"}
          </button>
        ))}
      </div>

      {/* Processes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProcesses.map((process) => (
          <Card
            key={process.id}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="p-3 rounded-lg bg-slate-100 flex-shrink-0">
                    <FileSearch className="h-6 w-6 text-slate-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-900 truncate">
                      {process.title}
                    </h3>
                    <p className="text-sm text-slate-500 truncate">
                      {process.organ}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <Badge variant="secondary">{process.type}</Badge>
                      {getStatusBadge(process.status)}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() =>
                      setOpenMenuId(openMenuId === process.id ? null : process.id)
                    }
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="h-5 w-5 text-slate-400" />
                  </button>
                  {openMenuId === process.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-10">
                      <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Ver Detalhes
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Exportar Relatório
                      </button>
                      <button className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                        <Trash2 className="h-4 w-4" />
                        Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500">Data</p>
                  <p className="text-sm font-medium text-slate-900">
                    {process.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Valor</p>
                  <p className="text-sm font-medium text-slate-900">
                    {process.value}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <div className="flex items-center gap-1">
                    {process.errorsFound > 0 ? (
                      <>
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium text-amber-600">
                          {process.errorsFound} erros
                        </span>
                      </>
                    ) : process.status === "completed" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          Sem erros
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">-</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
