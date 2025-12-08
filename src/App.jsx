import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { Dashboard } from "./pages/Dashboard";
import { NovaAnalise } from "./pages/NovaAnalise";
import { MeusProcessos } from "./pages/MeusProcessos";
import { Historico } from "./pages/Historico";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="nova-analise" element={<NovaAnalise />} />
          <Route path="processos" element={<MeusProcessos />} />
          <Route path="historico" element={<Historico />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
