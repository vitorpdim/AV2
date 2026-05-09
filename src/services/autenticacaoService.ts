import type { Funcionario } from "../models/tipos";

// =======================================

// easter egg: paysandu / paysandu -> tela oculta
const STORAGE_KEY_SESSAO = "aerocode_sessao";

const carregarFuncionarios = async (): Promise<Funcionario[]> => {
  const { default: dados } = await import("../mocks/funcionarios.json");
  return dados as Funcionario[];
};

export const autenticar = async (usuario: string, senha: string): Promise<Funcionario | null> => {
  const lista = await carregarFuncionarios();
  return lista.find((f) => f.usuario === usuario && f.senha === senha) ?? null;
};

export const verificarEasterEgg = (usuario: string, senha: string): boolean => {
  return usuario === "paysandu" && senha === "paysandu";
};

export const salvarSessao = (funcionario: Funcionario): void => {
  sessionStorage.setItem(STORAGE_KEY_SESSAO, JSON.stringify(funcionario));
};

export const recuperarSessao = (): Funcionario | null => {
  const salvo = sessionStorage.getItem(STORAGE_KEY_SESSAO);
  return salvo ? (JSON.parse(salvo) as Funcionario) : null;
};

export const encerrarSessao = (): void => {
  sessionStorage.removeItem(STORAGE_KEY_SESSAO);
};
