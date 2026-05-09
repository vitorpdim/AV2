import { clsx } from "clsx";
import type { NivelPermissao } from "../../models/enums";

// =======================================

type Rota = "dashboard" | "aeronaves" | "pecas" | "etapas" | "testes" | "relatorios";

interface ItemMenu {
  rota: Rota;
  label: string;
  nivelMinimo?: NivelPermissao[];
}

const itensMenu: ItemMenu[] = [
  { label: "aeronaves", rota: "aeronaves" },
  { label: "pecas", rota: "pecas" },
  { label: "etapas", rota: "etapas" },
  { label: "testes", rota: "testes", nivelMinimo: ["engenheiro", "administrador"] as NivelPermissao[] },
  { label: "relatorios", rota: "relatorios", nivelMinimo: ["engenheiro", "administrador"] as NivelPermissao[] },
];

interface SidebarProps {
  rotaAtiva: Rota;
  nivelPermissao: NivelPermissao;
  onNavegar: (rota: Rota) => void;
}

export function Sidebar({ rotaAtiva, nivelPermissao, onNavegar }: SidebarProps) {
  const itensVisiveis = itensMenu.filter(
    (item) => !item.nivelMinimo || item.nivelMinimo.includes(nivelPermissao)
  );

  return (
    <aside className="w-[104px] flex-shrink-0 border-r border-[#e8e9f1] bg-[#f8f9fe] pt-3">
      <button
        onClick={() => onNavegar("dashboard")}
        className="mb-3 ml-3 block"
        title="dashboard"
      >
        <div
          className={clsx(
            "h-2 w-16 rounded transition-colors",
            rotaAtiva === "dashboard" ? "bg-[#454751]" : "bg-[#e8e9f1] opacity-60 hover:opacity-100"
          )}
        />
      </button>
      <nav>
        <ul className="space-y-[6px] px-2">
          {itensVisiveis.map((item) => {
            const ativo = rotaAtiva === item.rota;
            return (
              <li key={item.rota}>
                <button
                  type="button"
                  onClick={() => onNavegar(item.rota)}
                  className={clsx(
                    "flex h-[22px] w-full items-center rounded px-2 text-left transition-colors",
                    ativo ? "bg-[#1f2024]" : "hover:bg-[#e8e9f1]"
                  )}
                >
                  <span
                    className={clsx(
                      "font-inter text-[8px] font-medium",
                      ativo ? "text-white" : "text-[#1f2024]"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
