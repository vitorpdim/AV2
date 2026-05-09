import {
  TipoAeronave,
  TipoPeca,
  StatusPeca,
  StatusEtapa,
  NivelPermissao,
  TipoTeste,
  ResultadoTeste,
} from "./enums";

// =======================================

export interface Funcionario {
  id: string;
  nome: string;
  telefone: string;
  endereco: string;
  usuario: string;
  senha: string;
  nivelPermissao: NivelPermissao;
}

export interface Peca {
  id: string;
  nome: string;
  tipo: TipoPeca;
  fornecedor: string;
  status: StatusPeca;
  dataCadastro: string;
}

export interface Etapa {
  id: string;
  nome: string;
  prazo: string;
  status: StatusEtapa;
  funcionariosIds: string[];
  dataInicio?: string;
  dataConclusao?: string;
}

export interface Teste {
  id: string;
  tipo: TipoTeste;
  resultado: ResultadoTeste;
  data: string;
  observacoes?: string;
}

export interface Aeronave {
  id: string;
  codigo: string;
  modelo: string;
  tipo: TipoAeronave;
  capacidade: number;
  alcance: number;
  pecas: Peca[];
  etapas: Etapa[];
  testes: Teste[];
  dataCadastro: string;
}

export interface Relatorio {
  id: string;
  aeronaveId: string;
  nomeCliente: string;
  dataEntrega: string;
  dataCriacao: string;
}

// =======================================

export type Rota = "aeronaves" | "pecas" | "etapas" | "testes" | "relatorios";

export interface CredenciaisLogin {
  usuario: string;
  senha: string;
}

export interface EstadoAutenticacao {
  logado: boolean;
  funcionario: Funcionario | null;
}
