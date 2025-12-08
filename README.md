# easyLicit

Plataforma SaaS para análise inteligente de documentos de licitações públicas usando IA.

## Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure a chave da API:**
   - Crie o arquivo `.env.local` na raiz do projeto
   - Adicione sua chave da API Cohere:
   ```
   COHERE_API_KEY=sua_chave_aqui
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse a aplicação:**
   - Abra [http://localhost:3000](http://localhost:3000) no navegador

## Tecnologias

- **Next.js 14** - Framework React
- **Cohere AI** - Análise de documentos com IA (modelo command-r7b-12-2024)
- **Tailwind CSS** - Estilização
- **pdf-parse** - Processamento de PDFs
