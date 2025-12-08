"use client";

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
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/Dialog";
import { cn } from "@/lib/utils";
import { analyzeEdital, analyzeProposta, generateAppeal } from "@/app/actions/analysis";

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
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [appealText, setAppealText] = useState("");
  const [isGeneratingAppeal, setIsGeneratingAppeal] = useState(false);

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

  const startAnalysis = async () => {
    setStep(2);
    setProgress(0);
    setError(null);

    // Simulate progress while waiting for AI
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 10;
      });
    }, 500);

    try {
      let result;
      
      if (analysisType === "edital") {
        const formData = new FormData();
        formData.append("file", uploadedFile);
        result = await analyzeEdital(formData);
      } else {
        const formData = new FormData();
        formData.append("edital", uploadedEdital);
        formData.append("proposta", uploadedProposta);
        result = await analyzeProposta(formData);
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setAnalysisResult(result.data);
        setTimeout(() => setStep(3), 500);
      } else {
        setError(result.error);
        setTimeout(() => setStep(1), 2000);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "Erro ao analisar o documento");
      setTimeout(() => setStep(1), 2000);
    }
  };

  const openAppealDialog = async (irregularidade) => {
    setSelectedError(irregularidade);
    setAppealDialogOpen(true);
    setIsGeneratingAppeal(true);
    setAppealText("");

    try {
      const result = await generateAppeal(irregularidade);
      if (result.success) {
        setAppealText(result.appeal);
      } else {
        setAppealText(`Erro ao gerar recurso: ${result.error}`);
      }
    } catch (err) {
      setAppealText(`Erro ao gerar recurso: ${err.message}`);
    } finally {
      setIsGeneratingAppeal(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appealText);
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case "alta":
      case "high":
        return <Badge variant="destructive">Alta Severidade</Badge>;
      case "media":
      case "medium":
        return <Badge variant="warning">Média Severidade</Badge>;
      case "baixa":
      case "low":
        return <Badge variant="secondary">Baixa Severidade</Badge>;
      default:
        return null;
    }
  };

  const resetAnalysis = () => {
    setStep(1);
    setUploadedFile(null);
    setUploadedEdital(null);
    setUploadedProposta(null);
    setAnalysisResult(null);
    setError(null);
    setProgress(0);
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
                {error ? "Erro na análise" : "Analisando documento..."}
              </h2>
              <p className="text-slate-500">
                {error || "Nossa IA está revisando as cláusulas legais do seu documento"}
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <Progress value={progress} />
              <p className="text-sm text-slate-500">
                {error
                  ? "Retornando..."
                  : progress < 30
                  ? "Extraindo texto do documento..."
                  : progress < 60
                  ? "Identificando cláusulas relevantes..."
                  : progress < 90
                  ? "Analisando conformidade legal com IA..."
                  : "Finalizando análise..."}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Results */}
      {step === 3 && analysisResult && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button variant="outline" onClick={resetAnalysis}>
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Nova Análise
            </Button>
          </div>

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
                  {analysisResult.resumo?.tipo && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Tipo
                      </p>
                      <p className="font-medium text-slate-900">
                        {analysisResult.resumo.tipo}
                      </p>
                    </div>
                  )}
                  {analysisResult.resumo?.numero && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Número
                      </p>
                      <p className="font-medium text-slate-900">
                        {analysisResult.resumo.numero}
                      </p>
                    </div>
                  )}
                  {analysisResult.resumo?.orgao && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Órgão
                      </p>
                      <p className="font-medium text-slate-900">
                        {analysisResult.resumo.orgao}
                      </p>
                    </div>
                  )}
                  {analysisResult.resumo?.objeto && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Objeto
                      </p>
                      <p className="text-sm text-slate-700">
                        {analysisResult.resumo.objeto}
                      </p>
                    </div>
                  )}
                  {analysisResult.resumo?.valorEstimado && (
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase">
                        Valor Estimado
                      </p>
                      <p className="font-medium text-slate-900">
                        {analysisResult.resumo.valorEstimado}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                  <p className="text-sm text-amber-800">
                    <span className="font-semibold">
                      {analysisResult.totalIrregularidades || analysisResult.irregularidades?.length || 0} irregularidades
                    </span>{" "}
                    detectadas neste documento
                  </p>
                </div>
                {(analysisResult.riscosAltos > 0 || analysisResult.riscosMedios > 0 || analysisResult.riscosBaixos > 0) && (
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-red-50 rounded-lg">
                      <p className="text-lg font-bold text-red-600">{analysisResult.riscosAltos || 0}</p>
                      <p className="text-xs text-red-600">Altos</p>
                    </div>
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <p className="text-lg font-bold text-amber-600">{analysisResult.riscosMedios || 0}</p>
                      <p className="text-xs text-amber-600">Médios</p>
                    </div>
                    <div className="p-2 bg-slate-100 rounded-lg">
                      <p className="text-lg font-bold text-slate-600">{analysisResult.riscosBaixos || 0}</p>
                      <p className="text-xs text-slate-600">Baixos</p>
                    </div>
                  </div>
                )}
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
                  {analysisResult.irregularidades?.map((irregularidade, index) => (
                    <div
                      key={irregularidade.id || index}
                      className="p-4 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="default">{irregularidade.tipo}</Badge>
                            {getSeverityBadge(irregularidade.severidade)}
                            <span className="text-sm text-slate-500">
                              Item {irregularidade.item}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700">
                            {irregularidade.descricao}
                          </p>
                          {irregularidade.fundamentacao && (
                            <p className="text-xs text-slate-500 italic">
                              {irregularidade.fundamentacao}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openAppealDialog(irregularidade)}
                          className="flex-shrink-0"
                        >
                          Gerar Recurso
                        </Button>
                      </div>
                    </div>
                  ))}
                  {(!analysisResult.irregularidades || analysisResult.irregularidades.length === 0) && (
                    <div className="text-center py-8">
                      <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-slate-600">Nenhuma irregularidade encontrada!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
                  Baseado em: {selectedError.tipo} - Item {selectedError.item}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {isGeneratingAppeal ? (
              <div className="flex items-center justify-center h-96">
                <div className="text-center space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-600 mx-auto" />
                  <p className="text-slate-500">Gerando recurso com IA...</p>
                </div>
              </div>
            ) : (
              <textarea
                className="w-full h-96 p-4 border border-slate-200 rounded-lg text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={appealText}
                onChange={(e) => setAppealText(e.target.value)}
              />
            )}
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={copyToClipboard} disabled={isGeneratingAppeal}>
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button disabled={isGeneratingAppeal}>
              <Download className="h-4 w-4 mr-2" />
              Baixar DOCX
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
