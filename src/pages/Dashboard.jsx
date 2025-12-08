import {
  FileSearch,
  AlertTriangle,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const stats = [
  {
    title: "Processos Ativos",
    value: "12",
    change: "+2 esta semana",
    icon: FileSearch,
    iconBg: "bg-primary-100",
    iconColor: "text-primary-600",
  },
  {
    title: "Erros Encontrados",
    value: "28",
    change: "Em 5 processos",
    icon: AlertTriangle,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
  {
    title: "Recursos Gerados",
    value: "8",
    change: "3 pendentes",
    icon: FileText,
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    title: "Taxa de Sucesso",
    value: "87%",
    change: "+5% este mês",
    icon: TrendingUp,
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const recentAnalyses = [
  {
    id: 1,
    title: "Pregão Eletrônico 045/2024",
    type: "Edital",
    date: "08 Dez 2024",
    status: "completed",
    errorsFound: 3,
  },
  {
    id: 2,
    title: "Concorrência 012/2024",
    type: "Proposta Vencedora",
    date: "07 Dez 2024",
    status: "completed",
    errorsFound: 5,
  },
  {
    id: 3,
    title: "Tomada de Preços 089/2024",
    type: "Edital",
    date: "06 Dez 2024",
    status: "processing",
    errorsFound: 0,
  },
  {
    id: 4,
    title: "Pregão Eletrônico 044/2024",
    type: "Edital",
    date: "05 Dez 2024",
    status: "completed",
    errorsFound: 2,
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Visão geral das suas análises e processos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-lg ${stat.iconBg}`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{stat.change}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Analyses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-slate-400" />
            Análises Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-primary-200 hover:bg-primary-50/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <FileSearch className="h-5 w-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {analysis.title}
                    </p>
                    <p className="text-sm text-slate-500">
                      {analysis.type} • {analysis.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {analysis.status === "completed" ? (
                    <>
                      {analysis.errorsFound > 0 && (
                        <Badge variant="warning">
                          {analysis.errorsFound} erros
                        </Badge>
                      )}
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </>
                  ) : (
                    <Badge variant="secondary">Processando...</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
