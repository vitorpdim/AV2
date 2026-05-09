import { useEffect } from "react";
import { clsx } from "clsx";

// =======================================

interface ModalProps {
  titulo: string;
  aberto: boolean;
  onFechar: () => void;
  children: React.ReactNode;
  largura?: string;
}

export function Modal({ titulo, aberto, onFechar, children, largura = "w-[400px]" }: ModalProps) {
  useEffect(() => {
    const fecharComEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };
    document.addEventListener("keydown", fecharComEsc);
    return () => document.removeEventListener("keydown", fecharComEsc);
  }, [onFechar]);

  if (!aberto) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onFechar}
    >
      <div
        className={clsx("rounded-xl border-2 border-[#1f2024] bg-white", largura)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-[35px] items-center justify-between rounded-t-[10px] bg-[#1f2024] px-4">
          <span className="font-inter text-[10px] font-normal tracking-[0.25px] text-white">
            {titulo}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onFechar}
              className="h-3 w-3 rounded border border-[#454751] opacity-60 transition-opacity hover:opacity-100"
            />
          </div>
        </div>
        <div className="px-4 pb-4 pt-4">{children}</div>
      </div>
    </div>
  );
}
