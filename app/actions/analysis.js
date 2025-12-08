"use server";

import { CohereClientV2 } from "cohere-ai";
import pdf from "pdf-parse";

const cohere = new CohereClientV2({
  token: process.env.COHERE_API_KEY,
});

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error("Error parsing PDF:", error);
    throw new Error("Falha ao processar o arquivo PDF");
  }
}

const EDITAL_ANALYSIS_PROMPT = `Você é um especialista em licitações públicas brasileiras com profundo conhecimento da Lei 8.666/93, Lei 14.133/21 (Nova Lei de Licitações), Lei do Pregão (10.520/02), e jurisprudência do TCU.

Analise o seguinte edital de licitação e identifique:
1. Cláusulas restritivas à competitividade
2. Especificações direcionadas ou que mencionam marcas sem justificativa
3. Prazos inexequíveis
4. Exigências excessivas de qualificação técnica ou econômico-financeira
5. Irregularidades formais
6. Violações aos princípios da isonomia, competitividade, economicidade e legalidade

Para cada irregularidade encontrada, forneça:
- O item/cláusula específica do edital
- A descrição do problema
- A fundamentação legal (leis, decretos, súmulas, acórdãos do TCU)
- A severidade (alta, média ou baixa)
- Sugestão de argumentação para impugnação ou recurso

Responda APENAS em formato JSON válido com a seguinte estrutura:
{
  "resumo": {
    "tipo": "tipo da licitação (Pregão, Concorrência, etc)",
    "numero": "número do processo",
    "orgao": "órgão licitante",
    "objeto": "descrição resumida do objeto",
    "valorEstimado": "valor estimado se disponível"
  },
  "irregularidades": [
    {
      "id": 1,
      "tipo": "tipo da irregularidade",
      "item": "número do item/cláusula",
      "severidade": "alta|media|baixa",
      "descricao": "descrição detalhada do problema",
      "fundamentacao": "fundamentação legal completa",
      "sugestao": "sugestão para argumentação jurídica"
    }
  ],
  "totalIrregularidades": número total,
  "riscosAltos": número de riscos altos,
  "riscosMedios": número de riscos médios,
  "riscosBaixos": número de riscos baixos
}

EDITAL PARA ANÁLISE:
`;

const PROPOSTA_ANALYSIS_PROMPT = `Você é um especialista em licitações públicas brasileiras com profundo conhecimento da Lei 8.666/93, Lei 14.133/21 (Nova Lei de Licitações), Lei do Pregão (10.520/02), e jurisprudência do TCU.

Compare a proposta vencedora com as exigências do edital e identifique:
1. Descumprimentos das especificações técnicas exigidas
2. Documentação faltante ou irregular
3. Preços inexequíveis ou acima do estimado
4. Falhas na habilitação jurídica, técnica ou econômico-financeira
5. Vícios formais na proposta
6. Qualquer descumprimento que justifique recurso ou impugnação

Para cada irregularidade encontrada, forneça:
- O item/cláusula específica do edital descumprida
- A descrição do problema na proposta
- A fundamentação legal
- A severidade (alta, média ou baixa)
- Sugestão de argumentação para recurso

Responda APENAS em formato JSON válido com a seguinte estrutura:
{
  "resumo": {
    "tipo": "tipo da licitação",
    "numero": "número do processo",
    "orgao": "órgão licitante",
    "objeto": "descrição resumida do objeto",
    "valorEstimado": "valor estimado se disponível",
    "valorProposta": "valor da proposta analisada se disponível"
  },
  "irregularidades": [
    {
      "id": 1,
      "tipo": "tipo da irregularidade",
      "item": "número do item/cláusula do edital",
      "severidade": "alta|media|baixa",
      "descricao": "descrição detalhada do problema encontrado na proposta",
      "fundamentacao": "fundamentação legal completa",
      "sugestao": "sugestão para argumentação jurídica no recurso"
    }
  ],
  "totalIrregularidades": número total,
  "riscosAltos": número de riscos altos,
  "riscosMedios": número de riscos médios,
  "riscosBaixos": número de riscos baixos
}

EDITAL:
{EDITAL}

PROPOSTA VENCEDORA:
{PROPOSTA}
`;

export async function analyzeEdital(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      return { success: false, error: "Nenhum arquivo enviado" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    let text;
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(buffer);
    } else {
      text = buffer.toString("utf-8");
    }

    if (!text || text.trim().length < 100) {
      return { success: false, error: "Não foi possível extrair texto suficiente do documento" };
    }

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      messages: [
        {
          role: "user",
          content: EDITAL_ANALYSIS_PROMPT + text.substring(0, 100000),
        },
      ],
      temperature: 0.3,
    });

    const content = response.message?.content?.[0]?.text;
    if (!content) {
      return { success: false, error: "Não foi possível obter resposta da IA" };
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Resposta da IA em formato inválido" };
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return { 
      success: true, 
      data: analysis,
      analysisType: "edital"
    };
  } catch (error) {
    console.error("Error analyzing edital:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao analisar o documento" 
    };
  }
}

export async function analyzeProposta(formData) {
  try {
    const editalFile = formData.get("edital");
    const propostaFile = formData.get("proposta");

    if (!editalFile || !propostaFile) {
      return { success: false, error: "É necessário enviar o edital e a proposta" };
    }

    // Extract text from both files
    const editalBytes = await editalFile.arrayBuffer();
    const propostaBytes = await propostaFile.arrayBuffer();
    
    let editalText, propostaText;
    
    if (editalFile.type === "application/pdf") {
      editalText = await extractTextFromPDF(Buffer.from(editalBytes));
    } else {
      editalText = Buffer.from(editalBytes).toString("utf-8");
    }

    if (propostaFile.type === "application/pdf") {
      propostaText = await extractTextFromPDF(Buffer.from(propostaBytes));
    } else {
      propostaText = Buffer.from(propostaBytes).toString("utf-8");
    }

    if (!editalText || editalText.trim().length < 100) {
      return { success: false, error: "Não foi possível extrair texto suficiente do edital" };
    }

    if (!propostaText || propostaText.trim().length < 50) {
      return { success: false, error: "Não foi possível extrair texto suficiente da proposta" };
    }

    const prompt = PROPOSTA_ANALYSIS_PROMPT
      .replace("{EDITAL}", editalText.substring(0, 50000))
      .replace("{PROPOSTA}", propostaText.substring(0, 50000));

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const content = response.message?.content?.[0]?.text;
    if (!content) {
      return { success: false, error: "Não foi possível obter resposta da IA" };
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { success: false, error: "Resposta da IA em formato inválido" };
    }

    const analysis = JSON.parse(jsonMatch[0]);
    
    return { 
      success: true, 
      data: analysis,
      analysisType: "proposta"
    };
  } catch (error) {
    console.error("Error analyzing proposta:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao analisar os documentos" 
    };
  }
}

export async function generateAppeal(irregularidade) {
  try {
    const prompt = `Você é um advogado especialista em licitações públicas brasileiras. Gere um recurso administrativo formal e completo para impugnar a seguinte irregularidade encontrada em um processo licitatório:

Tipo de Irregularidade: ${irregularidade.tipo}
Item/Cláusula: ${irregularidade.item}
Descrição: ${irregularidade.descricao}
Fundamentação: ${irregularidade.fundamentacao}

Gere um recurso administrativo completo em português formal jurídico, incluindo:
1. Cabeçalho formal endereçado ao Pregoeiro/Comissão de Licitação
2. Qualificação do recorrente (deixar campos para preenchimento)
3. Dos Fatos
4. Do Direito (com citação de leis, jurisprudência do TCU, doutrinas)
5. Do Pedido
6. Fecho

O recurso deve ser convincente, bem fundamentado e pronto para uso profissional.`;

    const response = await cohere.chat({
      model: "command-r7b-12-2024",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.4,
    });

    const content = response.message?.content?.[0]?.text;
    if (!content) {
      return { success: false, error: "Não foi possível gerar o recurso" };
    }

    return { 
      success: true, 
      appeal: content 
    };
  } catch (error) {
    console.error("Error generating appeal:", error);
    return { 
      success: false, 
      error: error.message || "Erro ao gerar o recurso" 
    };
  }
}
