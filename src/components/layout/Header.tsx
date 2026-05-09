import type { Funcionario } from "../../models/tipos";

// =======================================

interface HeaderProps {
  funcionario?: Funcionario | null;
  onLogout?: () => void;
}

export function Header({ funcionario, onLogout }: HeaderProps) {
  return (
    <header className="flex h-12 items-center justify-between border-b border-[#2f3036] bg-[#1f2024] px-4 flex-shrink-0">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <div className="grid h-4 w-4 grid-cols-2 gap-[2px] rounded border border-[#454751] p-[2px]">
            <span className="rounded bg-white/80" />
            <span className="rounded bg-white/30" />
            <span className="rounded bg-white/30" />
            <span className="rounded bg-white/80" />
          </div>
          <span className="font-inter text-[11px] font-bold tracking-[1.65px] text-white">
            AEROCODE SPA
          </span>
        </div>
        {funcionario && (
          <>
            <div className="h-4 w-px bg-[#454751]" />
            <span className="font-inter text-[10px] font-normal text-[#8f9098]">
              {funcionario.nome}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        <div className="rounded border border-[#454751] px-2 py-0.5">
          <span className="font-inter text-[8px] tracking-[0.40px] text-[#454751]">V1.0.0</span>
        </div>
        <span className="font-inter text-[8px] tracking-[0.40px] text-[#454751]">
          ENGENHARIA AEROESPACIAL
        </span>
        {onLogout && (
          <button
            onClick={onLogout}
            className="rounded border border-[#454751] px-2 py-0.5 font-inter text-[8px] tracking-[0.40px] text-[#8f9098] transition-colors hover:border-[#8f9098] hover:text-white"
          >
            sair
          </button>
        )}
      </div>
    </header>
  );
}
