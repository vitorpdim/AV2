// =======================================

export enum TipoAeronave {
  COMERCIAL = "comercial",
  MILITAR = "militar",
  EXECUTIVA = "executiva",
  CARGA = "carga",
  EXPERIMENTAL = "experimental",
}

export enum TipoPeca {
  ESTRUTURAL = "estrutural",
  MOTORISTA = "motorista",
  HIDRAULICA = "hidráulica",
  ELETRICA = "elétrica",
  AVIONICA = "aviônica",
}

export enum StatusPeca {
  PENDENTE = "pendente",
  EM_PRODUCAO = "em produção",
  INSPECAO = "inspeção",
  APROVADA = "aprovada",
  REPROVADA = "reprovada",
}

export enum StatusEtapa {
  PENDENTE = "pendente",
  EM_ANDAMENTO = "em andamento",
  CONCLUIDA = "concluída",
}

export enum NivelPermissao {
  ADMINISTRADOR = "administrador",
  ENGENHEIRO = "engenheiro",
  OPERADOR = "operador",
}

export enum TipoTeste {
  ESTRUTURAL = "estrutural",
  FUNCIONAL = "funcional",
  PRESSAO = "pressão",
  ELETRICO = "elétrico",
  VOO = "voo",
}

export enum ResultadoTeste {
  APROVADO = "aprovado",
  REPROVADO = "reprovado",
  PENDENTE = "pendente",
}
