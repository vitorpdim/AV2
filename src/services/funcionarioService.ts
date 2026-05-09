import type { Funcionario } from "../models/tipos";
import type { NivelPermissao } from "../models/enums";

// =======================================

const STORAGE_KEY = "aerocode_funcionarios";

const carregarDoStorage = async (): Promise<Funcionario[]> => {
  const salvo = localStorage.getItem(STORAGE_KEY);
  if (salvo) return JSON.parse(salvo) as Funcionario[];

  const { default: dados } = await import("../mocks/funcionarios.json");
  localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
  return dados as Funcionario[];
};

const salvarNoStorage = (lista: Funcionario[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
};

export const listarFuncionarios = async (): Promise<Funcionario[]> => {
  return carregarDoStorage();
};

interface DadosCriarFuncionario {
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;
}

export const criarFuncionario = async (dados: DadosCriarFuncionario): Promise<Funcionario> => {
  const lista = await carregarDoStorage();

  if (lista.find((f) => f.usuario === dados.usuario)) {
    throw new Error(`o usuário "${dados.usuario}" já está em uso.`);
  }

  const novo: Funcionario = {
    ...dados,
    id: `F${String(lista.length + 1).padStart(3, "0")}`,
  };

  lista.push(novo);
  salvarNoStorage(lista);
  return novo;
};
