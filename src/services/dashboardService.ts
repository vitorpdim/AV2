import { listarAeronaves } from "./aeronaveService";

// =======================================

export interface MetricasDashboard {
  totalAeronaves: number;
  totalPecas: number;
  percentualTestesOk: number;
}

export interface DadoProducaoMensal {
  mes: string;
  concluidas: number;
  emAndamento: number;
  pendentes: number;
}

export const carregarMetricas = async (): Promise<MetricasDashboard> => {
  const aeronaves = await listarAeronaves();

  const totalPecas = aeronaves.reduce((acc, a) => acc + a.pecas.length, 0);

  const todosTestes = aeronaves.flatMap((a) => a.testes);
  const testesAprovados = todosTestes.filter((t) => t.resultado === "aprovado").length;
  const percentualTestesOk =
    todosTestes.length === 0 ? 100 : Math.round((testesAprovados / todosTestes.length) * 100);

  return {
    totalAeronaves: aeronaves.length,
    totalPecas,
    percentualTestesOk,
  };
};

export const carregarProducaoMensal = async (): Promise<DadoProducaoMensal[]> => {
  const { default: dados } = await import("../mocks/producao-mensal.json");
  return dados as DadoProducaoMensal[];
};
