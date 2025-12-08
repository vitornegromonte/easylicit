import "@/styles/globals.css";

export const metadata = {
  title: "easyLicit - Análise Inteligente de Licitações",
  description: "Plataforma de análise de documentos de licitação com inteligência artificial",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
