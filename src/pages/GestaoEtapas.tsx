import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { clsx } from "clsx";
import { Badge, resolverVariante } from "../components/ui/Badge";
import { listarAeronaves, adicionarEtapa, atualizarStatusEtapa } from "../services/aeronaveService";
import { Modal } from "../components/ui/Modal";
import type { Aeronave, Etapa } from "../models/tipos";
import { StatusEtapa } from "../models/enums";

// =======================================

const COLUNAS: { status: StatusEtapa; titulo: string }[] = [
  { status: StatusEtapa.PENDENTE, titulo: "pendente" },
  { status: StatusEtapa.EM_ANDAMENTO, titulo: "em andamento" },
  { status: StatusEtapa.CONCLUIDA, titulo: "concluida" },
];

export function GestaoEtapas() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [aeronaveId, setAeronaveId] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);

  const carregar = async () => {
    const lista = await listarAeronaves();
    setAeronaves(lista);
    if (!aeronaveId && lista.length > 0) setAeronaveId(lista[0].id);
    setCarregando(false);
  };

  useEffect(() => {
    carregar().catch(() => console.error("falha ao carregar aeronaves para etapas."));
  }, []);

  const aeronaveAtiva = aeronaves.find((a) => a.id === aeronaveId) ?? null;

  const etapasPorStatus = (status: StatusEtapa): Etapa[] =>
    aeronaveAtiva?.etapas.filter((e) => e.status === status) ?? [];

  const handleAvancar = async (etapa: Etapa) => {
    if (!aeronaveAtiva) return;
    const proximo =
      etapa.status === StatusEtapa.PENDENTE
        ? StatusEtapa.EM_ANDAMENTO
        : StatusEtapa.CONCLUIDA;

    await atualizarStatusEtapa(aeronaveAtiva.id, etapa.id, proximo);
    carregar();
  };

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-inter text-[9px] text-[#8f9098]">carregando...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <select
            value={aeronaveId}
            onChange={(e) => setAeronaveId(e.target.value)}
            className="h-7 rounded border-2 border-[#e8e9f1] bg-white px-2 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {aeronaves.map((a) => (
              <option key={a.id} value={a.id}>
                [{a.codigo}] {a.modelo}
              </option>
            ))}
          </select>
        </div>
        {aeronaveAtiva && (
          <button
            onClick={() => setModalAberto(true)}
            className="rounded border border-[#1f2024] bg-[#1f2024] px-3 py-1.5 font-inter text-[8px] text-white transition-opacity hover:opacity-90"
          >
            nova etapa
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {COLUNAS.map((coluna) => (
          <ColunaKanban
            key={coluna.status}
            titulo={coluna.titulo}
            etapas={etapasPorStatus(coluna.status)}
            status={coluna.status}
            onAvancar={handleAvancar}
          />
        ))}
      </div>

      {aeronaveAtiva && (
        <ModalNovaEtapa
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvo={() => { setModalAberto(false); carregar(); }}
          aeronaveId={aeronaveAtiva.id}
        />
      )}
    </div>
  );
}

// =======================================

interface ColunaKanbanProps {
  titulo: string;
  etapas: Etapa[];
  status: StatusEtapa;
  onAvancar: (etapa: Etapa) => void;
}

function ColunaKanban({ titulo, etapas, status, onAvancar }: ColunaKanbanProps) {
  const podeAvancar = status !== StatusEtapa.CONCLUIDA;

  return (
    <section>
      <div className="mb-2 flex h-6 items-center justify-center rounded border-2 border-[#e8e9f1] bg-[#f8f9fe]">
        <span className="font-inter text-[7px] font-normal text-[#1f2024]">{titulo}</span>
      </div>
      <div className="space-y-2 min-h-[120px]">
        {etapas.map((etapa) => (
          <CartaoEtapa
            key={etapa.id}
            etapa={etapa}
            onAvancar={podeAvancar ? () => onAvancar(etapa) : undefined}
          />
        ))}
        {etapas.length === 0 && (
          <div className="flex h-16 items-center justify-center rounded border-2 border-dashed border-[#e8e9f1]">
            <span className="font-inter text-[7px] text-[#c5c6cc]">vazio</span>
          </div>
        )}
      </div>
    </section>
  );
}

// =======================================

interface CartaoEtapaProps {
  etapa: Etapa;
  onAvancar?: () => void;
}

function CartaoEtapa({ etapa, onAvancar }: CartaoEtapaProps) {
  return (
    <div
      className={clsx(
        "rounded-lg border-2 border-[#e8e9f1] bg-white p-2 transition-colors",
        onAvancar && "hover:border-[#c5c6cc]"
      )}
    >
      <div className="flex items-start gap-2">
        <div className="mt-0.5 h-3 w-3 flex-shrink-0 rounded-full border-2 border-[#c5c6cc] bg-[#f8f9fe]" />
        <div className="flex-1 min-w-0">
          <p className="font-inter text-[8px] font-medium leading-tight text-[#1f2024] truncate">
            {etapa.nome}
          </p>
          <p className="mt-1 font-inter text-[7px] text-[#8f9098]">prazo: {etapa.prazo}</p>
          {etapa.dataInicio && (
            <p className="font-inter text-[7px] text-[#8f9098]">inicio: {etapa.dataInicio}</p>
          )}
          <div className="mt-1.5 flex items-center justify-between">
            <Badge texto={etapa.status} variante={resolverVariante(etapa.status)} />
            {onAvancar && (
              <button
                onClick={onAvancar}
                className="font-inter text-[7px] text-[#8f9098] underline transition-colors hover:text-[#1f2024]"
              >
                avancar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =======================================

interface ModalNovaEtapaProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
  aeronaveId: string;
}

function ModalNovaEtapa({ aberto, onFechar, onSalvo, aeronaveId }: ModalNovaEtapaProps) {
  const [nome, setNome] = useState("");
  const [prazo, setPrazo] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const resetar = () => { setNome(""); setPrazo(""); setErro(""); };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!nome.trim() || !prazo.trim()) {
      setErro("nome e prazo sao obrigatorios.");
      return;
    }

    setSalvando(true);
    try {
      await adicionarEtapa(aeronaveId, { nome: nome.trim(), prazo: prazo.trim() });
      resetar();
      onSalvo();
    } catch (err) {
      setErro((err as Error).message);
    } finally {
      setSalvando(false);
    }
  };

  const handleFechar = () => { resetar(); onFechar(); };

  return (
    <Modal titulo="nova etapa" aberto={aberto} onFechar={handleFechar} largura="w-[340px]">
      <form onSubmit={handleSalvar} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="ex: montagem estrutural"
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none transition-colors placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">prazo</label>
          <input
            type="date"
            value={prazo}
            onChange={(e) => setPrazo(e.target.value)}
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none transition-colors focus:border-[#1f2024]"
          />
        </div>
        {erro && <p className="font-inter text-[7px] text-[#8f9098]">{erro}</p>}
        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={salvando}
            className="rounded bg-[#1f2024] px-5 py-[7px] font-inter text-[9px] text-white transition-opacity disabled:opacity-60 hover:opacity-90"
          >
            {salvando ? "salvando..." : "Salvar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
