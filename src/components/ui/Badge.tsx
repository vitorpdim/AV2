import { clsx } from "clsx";

// =======================================

type VarianteBadge =
  | "pendente"
  | "em andamento"
  | "concluida"
  | "aprovada"
  | "reprovada"
  | "inspecao"
  | "em producao"
  | "default";

const variantesClasses: Record<VarianteBadge, string> = {
  "pendente":      "border-[#c5c6cc] text-[#8f9098]",
  "em andamento":  "border-[#1f2024] text-[#1f2024]",
  "concluida":     "border-[#1f2024] bg-[#1f2024] text-white",
  "aprovada":      "border-[#1f2024] bg-[#1f2024] text-white",
  "reprovada":     "border-[#c5c6cc] text-[#8f9098] line-through",
  "inspecao":      "border-[#454751] text-[#454751]",
  "em producao":   "border-[#454751] text-[#454751]",
  "default":       "border-[#c5c6cc] text-[#8f9098]",
};

interface BadgeProps {
  texto: string;
  variante?: VarianteBadge;
  className?: string;
}

export function Badge({ texto, variante = "default", className }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-block rounded border px-1.5 py-0.5 font-inter text-[7px] font-normal tracking-[0.35px]",
        variantesClasses[variante],
        className
      )}
    >
      {texto}
    </span>
  );
}

export const resolverVariante = (status: string): VarianteBadge => {
  const mapa: Record<string, VarianteBadge> = {
    "pendente":     "pendente",
    "em andamento": "em andamento",
    "concluída":    "concluida",
    "aprovada":     "aprovada",
    "aprovado":     "aprovada",
    "reprovada":    "reprovada",
    "reprovado":    "reprovada",
    "inspeção":     "inspecao",
    "em produção":  "em producao",
  };
  return mapa[status] ?? "default";
};
