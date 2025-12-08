import { useState, useCallback } from "react";
import {
  Upload,
  FileText,
  AlertTriangle,
  CheckCircle2,
  FileWarning,
  Sparkles,
  ArrowRight,
  Copy,
  Download,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Progress } from "../components/ui/Progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "../components/ui/Dialog";
import { cn } from "../lib/utils";

const mockErrors = [
  {
    id: 1,
    type: "Cláusula Restritiva",
    item: "4.2",
    severity: "high",
    description:
      "Exigência de certidão negativa de protesto limita a competitividade do certame, contrariando o art. 37, XXI da CF/88.",
    suggestion:
      "A exigência de certidão negativa de protesto como requisito de habilitação econômico-financeira é considerada restritiva pela jurisprudência do TCU (Acórdão 1.521/2003).",
  },
  {
    id: 2,
    type: "Especificação Direcionada",
    item: "6.1.3",
    severity: "high",
    description:
      "Especificação técnica menciona marca específica sem justificativa ou aceite de similar.",
    suggestion:
      "Conforme art. 7º, § 5º da Lei 8.666/93, é vedada a indicação de marcas, exceto quando tecnicamente justificável.",
  },
  {
    id: 3,
    type: "Prazo Insuficiente",
    item: "8.4",
    severity: "medium",
    description:
      "Prazo de entrega de 5 dias corridos pode ser considerado inexequível para o objeto licitado.",
    suggestion:
      "Recomenda-se solicitar dilação do prazo ou justificativa técnica para a exigência.",
  },
  {
    id: 4,
    type: "Qualificação Excessiva",
    item: "5.2.1",
    severity: "medium",
    description:
      "Exigência de capital social mínimo de 10% do valor estimado pode ser considerada excessiva.",
    suggestion:
      "O TCU recomenda que a exigência de capital social não ultrapasse 10% do valor estimado da contratação.",
  },
  {
    id: 5,
    type: "Documentação Irregular",
    item: "5.3",
    severity: "low",
    description:
      "Lista de documentos de habilitação não especifica prazo de validade das certidões.",
    suggestion:
      "Recomenda-se esclarecer se serão aceitas certidões dentro do prazo de validade legal.",
  },
];

const generateAppealText = (error) => {
  return `RECURSO ADMINISTRATIVO

Ref.: ${error.type} - Item ${error.item}

EXCELENTÍSSIMO SENHOR PREGOEIRO,

[NOME DA EMPRESA], pessoa jurídica de direito privado, inscrita no CNPJ sob nº [CNPJ], com sede na [ENDEREÇO], vem, respeitosamente, à presença de Vossa Senhoria, interpor o presente RECURSO ADMINISTRATIVO, com fundamento no art. 109, inciso I, alínea "a" da Lei nº 8.666/93, pelos fatos e fundamentos a seguir expostos:

DOS FATOS

O presente certame apresenta irregularidade em seu instrumento convocatório, especificamente no item ${error.item}, que estabelece:

${error.description}

DO DIREITO

${error.suggestion}

Cumpre destacar que a cláusula impugnada viola os princípios da isonomia, competitividade e economicidade, consagrados no art. 3º da Lei nº 8.666/93.

DO PEDIDO

Ante o exposto, requer-se:

a) O conhecimento e provimento do presente recurso;
b) A modificação do item ${error.item} do edital para adequá-lo à legislação vigente;
c) A republicação do edital com a devida correção.

Nestes termos,
Pede deferimento.

[LOCAL], [DATA]

_______________________________
[NOME DO REPRESENTANTE LEGAL]
[CARGO]`;
};

export function NovaAnalise() {
  const [step, setStep] = useState(1);
  const [analysisType, setAnalysisType] = useState("edital");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedEdital, setUploadedEdital] = useState(null);
  const [uploadedProposta, setUploadedProposta] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isDraggingEdital, setIsDraggingEdital] = useState(false);
  const [isDraggingProposta, setIsDraggingProposta] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  const [appealDialogOpen, setAppealDialogOpen] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
    }
  }, []);

  const handleDragOverEdital = useCallback((e) => {
    e.preventDefault();
    setIsDraggingEdital(true);
  }, []);

  const handleDragLeaveEdital = useCallback((e) => {
    e.preventDefault();
    setIsDraggingEdital(false);
  }, []);

  const handleDropEdital = useCallback((e) => {
    e.preventDefault();
    setIsDraggingEdital(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedEdital(file);
    }
  }, []);

  const handleDragOverProposta = useCallback((e) => {
    e.preventDefault();
    setIsDraggingProposta(true);
  }, []);

  const handleDragLeaveProposta = useCallback((e) => {
    e.preventDefault();
    setIsDraggingProposta(false);
  }, []);

  const handleDropProposta = useCallback((e) => {
    e.preventDefault();
    setIsDraggingProposta(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedProposta(file);
    }
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleEditalSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedEdital(file);
    }
  };

  const handlePropostaSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedProposta(file);
    }
  };

  const canStartAnalysis = () => {
    if (analysisType === "edital") {
      return uploadedFile !== null;
    } else {
      return uploadedEdital !== null && uploadedProposta !== null;
    }
  };

  const startAnalysis = () => {
    setStep(2);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setTimeout(() => setStep(3), 500);
      }
      setProgress(currentProgress);
    }, 500);
  };

  const openAppealDialog = (error) => {
    setSelectedError(error);
    setAppealDialogOpen(true);
  };

  const copyToClipboard = () => {
    if (selectedError) {
      navigator.clipboard.writeText(generateAppealText(selectedError));
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">Alta Severidade</Badge>;
      case "medium":
        return <Badge variant="warning">Média Severidade</Badge>;
      case "low":
        return <Badge variant="secondary">Baixa Severidade</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Nova Análise</h1>
        <p className="text-slate-500 mt-1">
          Analise documentos de licitação com inteligência artificial
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                step >= s
                  ? "bg-primary-600 text-white"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {step > s ? <CheckCircle2 className="h-5 w-5" /> : s}
            </div>
            <span
              className={cn(
                "text-sm font-medium hidden sm:block",
                step >= s ? "text-slate-900" : "text-slate-400"
              )}
            >
              {s === 1 ? "Upload" : s === 2 ? "Processando" : "Resultados"}
            </span>
            {s < 3 && (
              <ArrowRight
                className={cn(
                  "h-4 w-4 mx-2",
                  step > s ? "text-primary-600" : "text-slate-300"
                )}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Analysis Type Toggle */}
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Análise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setAnalysisType("edital")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    analysisType === "edital"
                      ? "border-primary-600 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <FileText
                    className={cn(
                      "h-8 w-8 mb-2",
                      analysisType === "edital"
                        ? "text-primary-600"
                        : "text-slate-400"
                    )}
                  />
                  <h3 className="font-semibold text-slate-900">
                    Analisar Edital
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Encontre irregularidades e cláusulas restritivas no edital
                  </p>
                </button>
                <button
                  onClick={() => setAnalysisType("proposta")}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    analysisType === "proposta"
                      ? "border-primary-600 bg-primary-50"
                      : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  <FileWarning
                    className={cn(
                      "h-8 w-8 mb-2",
                      analysisType === "proposta"
                        ? "text-primary-600"
                        : "text-slate-400"
                    )}
                  />
                  <h3 className="font-semibold text-slate-900">
                    Analisar Proposta
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Compare a proposta vencedora com o edital para verificar conformidade
                  </p>
                </button>
              </div>
            </CardContent>
          </Card>

          {/* File Upload - Single file for Edital */}
          {analysisType === "edital" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload do Documento</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={cn(
                    "border-2 border-dashed rounded-lg p-12 text-center transition-colors",
                    isDragging
                      ? "border-primary-500 bg-primary-50"
                      : uploadedFile
                      ? "border-green-500 bg-green-50"
                      : "border-slate-300 hover:border-slate-400"
                  )}
                >
                  {uploadedFile ? (
                    <div className="space-y-2">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                      <p className="font-medium text-slate-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUploadedFile(null)}
                      >
                        <X className="h-4 w-4 mr-1" /> Remover
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 text-slate-400 mx-auto" />
                      <div>
                        <p className="text-lg font-medium text-slate-900">
                          Arraste e solte seu arquivo aqui
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          ou clique para selecionar
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" asChild>
                          <span>Selecionar Arquivo</span>
                        </Button>
                      </label>
                      <p className="text-xs text-slate-400">
                        Formatos aceitos: PDF, DOC, DOCX (máx. 50MB)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* File Upload - Two files for Proposta analysis */}
          {analysisType === "proposta" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Edital Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-600" />
                    Upload do Edital
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={handleDragOverEdital}
                    onDragLeave={handleDragLeaveEdital}
                    onDrop={handleDropEdital}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      isDraggingEdital
                        ? "border-primary-500 bg-primary-50"
                        : uploadedEdital
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    {uploadedEdital ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                        <p className="font-medium text-slate-900 text-sm">
                          {uploadedEdital.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(uploadedEdital.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedEdital(null)}
                        >
                          <X className="h-4 w-4 mr-1" /> Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium text-slate-900">
                            Arraste o edital aqui
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            ou clique para selecionar
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          id="edital-upload"
                          accept=".pdf,.doc,.docx"
                          onChange={handleEditalSelect}
                        />
                        <label htmlFor="edital-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span>Selecionar Edital</span>
                          </Button>
                        </label>
                        <p className="text-xs text-slate-400">
                          PDF, DOC, DOCX (máx. 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Proposta Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileWarning className="h-5 w-5 text-amber-600" />
                    Upload da Proposta
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={handleDragOverProposta}
                    onDragLeave={handleDragLeaveProposta}
                    onDrop={handleDropProposta}
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      isDraggingProposta
                        ? "border-primary-500 bg-primary-50"
                        : uploadedProposta
                        ? "border-green-500 bg-green-50"
                        : "border-slate-300 hover:border-slate-400"
                    )}
                  >
                    {uploadedProposta ? (
                      <div className="space-y-2">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
                        <p className="font-medium text-slate-900 text-sm">
                          {uploadedProposta.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(uploadedProposta.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setUploadedProposta(null)}
                        >
                          <X className="h-4 w-4 mr-1" /> Remover
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <Upload className="h-10 w-10 text-slate-400 mx-auto" />
                        <div>
                          <p className="text-base font-medium text-slate-900">
                            Arraste a proposta aqui
                          </p>
                          <p className="text-sm text-slate-500 mt-1">
                            ou clique para selecionar
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          id="proposta-upload"
                          accept=".pdf,.doc,.docx"
                          onChange={handlePropostaSelect}
                        />
                        <label htmlFor="proposta-upload">
                          <Button variant="outline" size="sm" asChild>
                            <span>Selecionar Proposta</span>
                          </Button>
                        </label>
                        <p className="text-xs text-slate-400">
                          PDF, DOC, DOCX (máx. 50MB)
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Start Button */}
          <div className="flex justify-end">
            <Button
              size="lg"
              disabled={!canStartAnalysis()}
              onClick={startAnalysis}
              className="gap-2"
            >
              <Sparkles className="h-5 w-5" />
              Iniciar Análise com IA
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Processing */}
      {step === 2 && (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center mx-auto">
                <Sparkles className="h-10 w-10 text-primary-600 animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-slate-900">
                Analisando documento...
              </h2>
              <p className="text-slate-500">
                Nossa IA está revisando as cláusulas legais do seu documento
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-slate-500">
                {progress < 30
                  ? "Extraindo texto do documento..."
                  : progress < 60
                  ? "Identificando cláusulas relevantes..."
                  : progress < 90
                  ? "Analisando conformidade legal..."
                  : "Finalizando análise..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Document Summary */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                Resumo do Documento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Tipo
                  </p>
                  <p className="font-medium text-slate-900">
                    Pregão Eletrônico
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Número
                  </p>
                  <p className="font-medium text-slate-900">045/2024</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Órgão
                  </p>
                  <p className="font-medium text-slate-900">
                    Prefeitura Municipal de São Paulo
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Objeto
                  </p>
                  <p className="text-sm text-slate-700">
                    Contratação de empresa especializada para fornecimento de
                    equipamentos de informática.
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase">
                    Valor Estimado
                  </p>
                  <p className="font-medium text-slate-900">
                    R$ 2.450.000,00
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <p className="text-sm text-amber-800">
                  <span className="font-semibold">{mockErrors.length} irregularidades</span>{" "}
                  detectadas neste documento
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Detected Errors */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Erros e Riscos Detectados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockErrors.map((error) => (
                  <div
                    key={error.id}
                    className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="default">{error.type}</Badge>
                          {getSeverityBadge(error.severity)}
                          <span className="text-sm text-slate-500">
                            Item {error.item}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700">
                          {error.description}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openAppealDialog(error)}
                        className="flex-shrink-0"
                      >
                        Gerar Recurso
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appeal Dialog */}
      <Dialog open={appealDialogOpen} onOpenChange={setAppealDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Recurso Administrativo
            </DialogTitle>
            <DialogDescription>
              {selectedError && (
                <span>
                  Baseado em: {selectedError.type} - Item {selectedError.item}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <textarea
              className="w-full h-96 p-4 border border-slate-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              defaultValue={selectedError ? generateAppealText(selectedError) : ""}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Baixar DOCX
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
