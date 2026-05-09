import { useEffect, useState } from "react";
import { GraficoBarras } from "../components/ui/GraficoBarras";
import {
  carregarMetricas,
  carregarProducaoMensal,
  type MetricasDashboard,
  type DadoProducaoMensal,
} from "../services/dashboardService";

// =======================================

export function Dashboard() {
  const [metricas, setMetricas] = useState<MetricasDashboard | null>(null);
  const [producao, setProducao] = useState<DadoProducaoMensal[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const [m, p] = await Promise.all([carregarMetricas(), carregarProducaoMensal()]);
      setMetricas(m);
      setProducao(p);
      setCarregando(false);
    };
    carregar().catch(() => console.error("falha ao carregar dados do dashboard."));
  }, []);

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-inter text-[9px] text-[#8f9098]">carregando...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-3 gap-3">
        <CartaoMetrica label="AERONAVES" valor={String(metricas?.totalAeronaves ?? 0)} />
        <CartaoMetrica
          label="PECAS"
          valor={metricas?.totalPecas.toLocaleString("pt-BR") ?? "0"}
        />
        <CartaoMetrica
          label="TESTES OK"
          valor={`${metricas?.percentualTestesOk ?? 0}%`}
        />
      </div>

      <div>
        <p className="mb-1.5 ml-1 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">
          PRODUCAO MENSAL
        </p>
        <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-3">
          <GraficoBarras dados={producao} />
          <div className="mt-3 flex items-center gap-4">
            {[
              { cor: "#1f2024", label: "concluidas" },
              { cor: "#8f9098", label: "em andamento" },
              { cor: "#e8e9f1", label: "pendentes" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-sm flex-shrink-0"
                  style={{ backgroundColor: item.cor, border: "1px solid #c5c6cc" }}
                />
                <span className="font-inter text-[7px] text-[#8f9098]">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================================

interface CartaoMetricaProps {
  label: string;
  valor: string;
}

function CartaoMetrica({ label, valor }: CartaoMetricaProps) {
  return (
    <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-3">
      <p className="font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">{label}</p>
      <p className="mt-1 font-inter text-[22px] font-bold leading-none text-[#1f2024]">{valor}</p>
      <div className="mt-2 h-1 w-16 rounded bg-[#e8e9f1]" />
    </div>
  );
}
