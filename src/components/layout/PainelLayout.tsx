import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import type { Funcionario } from "../../models/tipos";

// =======================================

type Rota = "dashboard" | "aeronaves" | "pecas" | "etapas" | "testes" | "relatorios";

interface PainelLayoutProps {
  funcionario: Funcionario;
  rotaAtiva: Rota;
  onNavegar: (rota: Rota) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export function PainelLayout({
  funcionario,
  rotaAtiva,
  onNavegar,
  onLogout,
  children,
}: PainelLayoutProps) {
  return (
    <div className="flex h-screen flex-col bg-[#f2f2f2]">
      <Header funcionario={funcionario} onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden rounded-t-xl border-2 border-[#1f2024] mx-4 mt-4 mb-0 bg-white">
        <Sidebar
          rotaAtiva={rotaAtiva}
          nivelPermissao={funcionario.nivelPermissao}
          onNavegar={onNavegar}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
