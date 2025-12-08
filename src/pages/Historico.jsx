import { useState } from "react";
import {
  History as HistoryIcon,
  FileSearch,
  CheckCircle2,
  Clock,
  Calendar,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";

const historyItems = [
  {
    id: 1,
    date: "08 Dez 2024",
    items: [
      {
        id: 101,
        time: "14:32",
        action: "Análise concluída",
        document: "Pregão Eletrônico 045/2024",
        result: "3 irregularidades encontradas",
        type: "analysis",
      },
      {
        id: 102,
        time: "14:15",
        action: "Upload de documento",
        document: "Pregão Eletrônico 045/2024",
        result: "Arquivo processado com sucesso",
        type: "upload",
      },
    ],
  },
  {
    id: 2,
    date: "07 Dez 2024",
    items: [
      {
        id: 201,
        time: "16:45",
        action: "Recurso gerado",
        document: "Concorrência 012/2024",
        result: "Documento exportado em DOCX",
        type: "appeal",
      },
      {
        id: 202,
        time: "16:30",
        action: "Análise concluída",
        document: "Concorrência 012/2024",
        result: "5 irregularidades encontradas",
        type: "analysis",
      },
      {
        id: 203,
        time: "15:20",
        action: "Upload de documento",
        document: "Concorrência 012/2024",
        result: "Arquivo processado com sucesso",
        type: "upload",
      },
    ],
  },
  {
    id: 3,
    date: "06 Dez 2024",
    items: [
      {
        id: 301,
        time: "11:10",
        action: "Upload de documento",
        document: "Tomada de Preços 089/2024",
        result: "Aguardando processamento",
        type: "upload",
      },
    ],
  },
  {
    id: 4,
    date: "05 Dez 2024",
    items: [
      {
        id: 401,
        time: "09:45",
        action: "Recurso gerado",
        document: "Pregão Eletrônico 044/2024",
        result: "Documento exportado em DOCX",
        type: "appeal",
      },
      {
        id: 402,
        time: "09:30",
        action: "Análise concluída",
        document: "Pregão Eletrônico 044/2024",
        result: "2 irregularidades encontradas",
        type: "analysis",
      },
    ],
  },
  {
    id: 5,
    date: "04 Dez 2024",
    items: [
      {
        id: 501,
        time: "17:22",
        action: "Relatório exportado",
        document: "RDC 007/2024",
        result: "PDF gerado com sucesso",
        type: "export",
      },
      {
        id: 502,
        time: "16:50",
        action: "Análise concluída",
        document: "RDC 007/2024",
        result: "7 irregularidades encontradas",
        type: "analysis",
      },
    ],
  },
];

export function Historico() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedDays, setExpandedDays] = useState([1, 2]);

  const toggleDay = (dayId) => {
    setExpandedDays((prev) =>
      prev.includes(dayId) ? prev.filter((id) => id !== dayId) : [...prev, dayId]
    );
  };

  const getActionIcon = (type) => {
    switch (type) {
      case "analysis":
        return <FileSearch className="h-4 w-4 text-primary-600" />;
      case "upload":
        return <Clock className="h-4 w-4 text-slate-500" />;
      case "appeal":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "export":
        return <Download className="h-4 w-4 text-purple-500" />;
      default:
        return <HistoryIcon className="h-4 w-4 text-slate-400" />;
    }
  };

  const getActionBadge = (type) => {
    switch (type) {
      case "analysis":
        return <Badge variant="default">Análise</Badge>;
      case "upload":
        return <Badge variant="secondary">Upload</Badge>;
      case "appeal":
        return <Badge variant="success">Recurso</Badge>;
      case "export":
        return <Badge variant="warning">Exportação</Badge>;
      default:
        return <Badge variant="secondary">Outro</Badge>;
    }
  };

  const filteredHistory = historyItems
    .map((day) => ({
      ...day,
      items: day.items.filter(
        (item) =>
          item.document.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.action.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((day) => day.items.length > 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Histórico</h1>
          <p className="text-slate-500 mt-1">
            Acompanhe todas as ações realizadas na plataforma
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar Histórico
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar no histórico..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {filteredHistory.map((day) => (
          <Card key={day.id}>
            <CardHeader
              className="cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleDay(day.id)}
            >
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  {day.date}
                  <span className="text-sm font-normal text-slate-500">
                    ({day.items.length} {day.items.length === 1 ? "ação" : "ações"})
                  </span>
                </CardTitle>
                {expandedDays.includes(day.id) ? (
                  <ChevronUp className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                )}
              </div>
            </CardHeader>
            {expandedDays.includes(day.id) && (
              <CardContent>
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                  {day.items.map((item, index) => (
                    <div key={item.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-[25px] w-4 h-4 rounded-full bg-white border-2 border-slate-300 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary-500" />
                      </div>
                      {/* Content */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-slate-200">
                              {getActionIcon(item.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-medium text-slate-900">
                                  {item.action}
                                </p>
                                {getActionBadge(item.type)}
                              </div>
                              <p className="text-sm text-slate-500 mt-0.5">
                                {item.document}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-slate-400">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-3 ml-11">
                          {item.result}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <HistoryIcon className="h-12 w-12 text-slate-300 mx-auto" />
            <p className="text-slate-500 mt-4">
              Nenhum resultado encontrado para "{searchQuery}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
