import type { Aeronave, Peca, Etapa, Teste } from "../models/tipos";
import {
  StatusEtapa,
  StatusPeca,
  type TipoAeronave,
  type TipoPeca,
  type TipoTeste,
  type ResultadoTeste,
} from "../models/enums";

// =======================================

const STORAGE_KEY = "aerocode_aeronaves";

const carregarDoStorage = async (): Promise<Aeronave[]> => {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) return JSON.parse(salvo) as Aeronave[];

  const { default: dados } = await import("../mocks/aeronaves.json");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  return dados as Aeronave[];
};

const salvarNoStorage = (aeronaves: Aeronave[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(aeronaves));
};

// =======================================

export const listarAeronaves = async (): Promise<Aeronave[]> => {
  return carregarDoStorage();
};

export const buscarAeronave = async (id: string): Promise<Aeronave | null> => {
  const lista = await carregarDoStorage();
  return lista.find((a) => a.id === id) ?? null;
};

interface DadosCriarAeronave {
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
}

export const criarAeronave = async (dados: DadosCriarAeronave): Promise<Aeronave> => {
  const lista = await carregarDoStorage();

  if (lista.find((a) => a.codigo === dados.codigo)) {
    throw new Error(`já existe uma aeronave com o código ${dados.codigo}.`);
  }

  const nova: Aeronave = {
    ...dados,
    id: `aero-${Date.now()}`,
    pecas: [],
    etapas: [],
    testes: [],
    dataCadastro: new Date().toISOString().split("T")[0],
  };

  lista.push(nova);
  salvarNoStorage(lista);
  return nova;
};

export const removerAeronave = async (id: string): Promise<void> => {
  const lista = await carregarDoStorage();
  const atualizada = lista.filter((a) => a.id !== id);
  salvarNoStorage(atualizada);
};

// =======================================

interface DadosCriarPeca {
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
}

export const adicionarPeca = async (aeronaveId: string, dados: DadosCriarPeca): Promise<Peca> => {
  const lista = await carregarDoStorage();
  const aeronave = lista.find((a) => a.id === aeronaveId);

  if (!aeronave) throw new Error("aeronave não encontrada.");

  const peca: Peca = {
    ...dados,
    id: `peca-${Date.now()}`,
    status: StatusPeca.PENDENTE,
    dataCadastro: new Date().toISOString().split("T")[0],
  };

  aeronave.pecas.push(peca);
  salvarNoStorage(lista);
  return peca;
};

export const atualizarStatusPeca = async (
  aeronaveId: string,
  pecaId: string,
  novoStatus: StatusPeca
): Promise<void> => {
  const lista = await carregarDoStorage();
  const aeronave = lista.find((a) => a.id === aeronaveId);
  if (!aeronave) throw new Error("aeronave não encontrada.");

  const peca = aeronave.pecas.find((p) => p.id === pecaId);
  if (!peca) throw new Error("peça não encontrada.");

  peca.status = novoStatus;
  salvarNoStorage(lista);
};

// =======================================

interface DadosCriarEtapa {
  nome: string;
  prazo: string;
}

export const adicionarEtapa = async (aeronaveId: string, dados: DadosCriarEtapa): Promise<Etapa> => {
  const lista = await carregarDoStorage();
  const aeronave = lista.find((a) => a.id === aeronaveId);
  if (!aeronave) throw new Error("aeronave não encontrada.");

  const etapa: Etapa = {
    ...dados,
    id: `etapa-${Date.now()}`,
    status: StatusEtapa.PENDENTE,
    funcionariosIds: [],
  };

  aeronave.etapas.push(etapa);
  salvarNoStorage(lista);
  return etapa;
};

export const atualizarStatusEtapa = async (
  aeronaveId: string,
  etapaId: string,
  novoStatus: StatusEtapa
): Promise<void> => {
  const lista = await carregarDoStorage();
  const aeronave = lista.find((a) => a.id === aeronaveId);
  if (!aeronave) throw new Error("aeronave não encontrada.");

  const etapa = aeronave.etapas.find((e) => e.id === etapaId);
  if (!etapa) throw new Error("etapa não encontrada.");

  etapa.status = novoStatus;

  if (novoStatus === StatusEtapa.EM_ANDAMENTO && !etapa.dataInicio) {
    etapa.dataInicio = new Date().toISOString().split("T")[0];
  }

  if (novoStatus === StatusEtapa.CONCLUIDA) {
    etapa.dataConclusao = new Date().toISOString().split("T")[0];
  }

  salvarNoStorage(lista);
};

// =======================================

interface DadosCriarTeste {
  tipo: TipoTeste;
  resultado: ResultadoTeste;
  observacoes?: string;
}

export const adicionarTeste = async (aeronaveId: string, dados: DadosCriarTeste): Promise<Teste> => {
  const lista = await carregarDoStorage();
  const aeronave = lista.find((a) => a.id === aeronaveId);
  if (!aeronave) throw new Error("aeronave não encontrada.");

  const teste: Teste = {
    ...dados,
    id: `teste-${Date.now()}`,
    data: new Date().toISOString().split("T")[0],
  };

  aeronave.testes.push(teste);
  salvarNoStorage(lista);
  return teste;
};
