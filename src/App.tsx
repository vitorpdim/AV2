import { useState, useEffect } from "react";
import { Login } from "./pages/Login";
import { EasterEgg } from "./pages/EasterEgg";
import { Aeronaves } from "./pages/Aeronaves";
import { Pecas } from "./pages/Pecas";
import { GestaoEtapas } from "./pages/GestaoEtapas";
import { Testes } from "./pages/Testes";
import { Relatorios } from "./pages/Relatorios";
import { Dashboard } from "./pages/Dashboard";
import { PainelLayout } from "./components/layout/PainelLayout";
import { recuperarSessao, encerrarSessao } from "./services/autenticacaoService";
import type { Funcionario } from "./models/tipos";

// =======================================

type TelaAtiva = "login" | "easter-egg" | "painel";

type Rota = "dashboard" | "aeronaves" | "pecas" | "etapas" | "testes" | "relatorios";

// =======================================

function App() {
  const [tela, setTela] = useState<TelaAtiva>("login");
  const [funcionario, setFuncionario] = useState<Funcionario | null>(null);
  const [rotaAtiva, setRotaAtiva] = useState<Rota>("dashboard");

  useEffect(() => {
    const sessao = recuperarSessao();
    if (!sessao) return;
    setFuncionario(sessao);
    setTela("painel");
  }, []);

  const handleAutenticado = (f: Funcionario) => {
    setFuncionario(f);
    setTela("painel");
  };

  const handleLogout = () => {
    encerrarSessao();
    setFuncionario(null);
    setRotaAtiva("dashboard");
    setTela("login");
  };

  if (tela === "easter-egg") {
    return <EasterEgg onVoltar={() => setTela("login")} />;
  }

  if (tela === "login" || !funcionario) {
    return <Login onAutenticado={handleAutenticado} onEasterEgg={() => setTela("easter-egg")} />;
  }

  return (
    <PainelLayout
      funcionario={funcionario}
      rotaAtiva={rotaAtiva}
      onNavegar={setRotaAtiva}
      onLogout={handleLogout}
    >
      {rotaAtiva === "dashboard" && <Dashboard />}
      {rotaAtiva === "aeronaves" && <Aeronaves />}
      {rotaAtiva === "pecas" && <Pecas />}
      {rotaAtiva === "etapas" && <GestaoEtapas />}
      {rotaAtiva === "testes" && <Testes />}
      {rotaAtiva === "relatorios" && <Relatorios />}
    </PainelLayout>
  );
}

export default App;
