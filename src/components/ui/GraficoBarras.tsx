import type { DadoProducaoMensal } from "../../services/dashboardService";

// =======================================

interface GraficoBarrasProps {
  dados: DadoProducaoMensal[];
}

export function GraficoBarras({ dados }: GraficoBarrasProps) {
  const largura = 340;
  const altura = 180;
  const paddingH = 32;
  const paddingV = 20;
  const areaLargura = largura - paddingH * 2;
  const areaAltura = altura - paddingV * 2;

  const maxValor = Math.max(...dados.flatMap((d) => [d.concluidas, d.emAndamento, d.pendentes]));
  const barLargura = areaLargura / (dados.length * 3 + dados.length - 1);

  const barraAltura = (valor: number) => (valor / maxValor) * areaAltura;

  const coresBarras = ["#1f2024", "#8f9098", "#e8e9f1"];

  return (
    <svg viewBox={`0 0 ${largura} ${altura}`} className="w-full" style={{ height: "180px" }}>
      {dados.map((dado, i) => {
        const grupoX = paddingH + i * (barLargura * 3 + barLargura);
        const valores = [dado.concluidas, dado.emAndamento, dado.pendentes];

        return (
          <g key={dado.mes}>
            {valores.map((val, j) => {
              const bH = barraAltura(val);
              const x = grupoX + j * barLargura;
              const y = paddingV + areaAltura - bH;
              return (
                <rect
                  key={j}
                  x={x}
                  y={y}
                  width={barLargura * 0.8}
                  height={bH}
                  fill={coresBarras[j]}
                  rx={1}
                />
              );
            })}
            <text
              x={grupoX + barLargura * 1.5}
              y={altura - 4}
              textAnchor="middle"
              fill="#8f9098"
              fontSize="7"
              fontFamily="Inter, sans-serif"
            >
              {dado.mes}
            </text>
          </g>
        );
      })}
      <line x1={paddingH} y1={paddingV} x2={paddingH} y2={paddingV + areaAltura} stroke="#e8e9f1" strokeWidth="1" />
      <line x1={paddingH} y1={paddingV + areaAltura} x2={largura - paddingH} y2={paddingV + areaAltura} stroke="#e8e9f1" strokeWidth="1" />
    </svg>
  );
}
