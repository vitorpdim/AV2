import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Badge, resolverVariante } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { listarAeronaves, adicionarPeca, atualizarStatusPeca } from "../services/aeronaveService";
import type { Aeronave, Peca } from "../models/tipos";
import { TipoPeca, StatusPeca } from "../models/enums";

// =======================================

export function Pecas() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [aeronaveId, setAeronaveId] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [pecaEditando, setPecaEditando] = useState<Peca | null>(null);

  const carregar = async () => {
    const lista = await listarAeronaves();
    setAeronaves(lista);
    if (!aeronaveId && lista.length > 0) setAeronaveId(lista[0].id);
    setCarregando(false);
  };

  useEffect(() => {
    carregar().catch(() => console.error("falha ao carregar pecas do mock JSON."));
  }, []);

  const aeronaveAtiva = aeronaves.find((a) => a.id === aeronaveId) ?? null;

  const handleAtualizarStatus = async (pecaId: string, novoStatus: StatusPeca) => {
    if (!aeronaveAtiva) return;
    await atualizarStatusPeca(aeronaveAtiva.id, pecaId, novoStatus);
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
        {aeronaveAtiva && (
          <button
            onClick={() => setModalAberto(true)}
            className="rounded border border-[#1f2024] bg-[#1f2024] px-3 py-1.5 font-inter text-[8px] text-white transition-opacity hover:opacity-90"
          >
            adicionar peca
          </button>
        )}
      </div>

      {aeronaveAtiva && (
        <div className="overflow-hidden rounded-lg border-2 border-[#e8e9f1]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e9f1] bg-[#f8f9fe]">
                {["nome", "tipo", "fornecedor", "status", "cadastro", ""].map((col) => (
                  <th
                    key={col}
                    className="px-3 py-2 text-left font-inter text-[7px] font-normal tracking-[0.35px] text-[#8f9098]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {aeronaveAtiva.pecas.map((peca) => (
                <tr key={peca.id} className="border-b border-[#e8e9f1] hover:bg-[#f8f9fe]">
                  <td className="px-3 py-2 font-inter text-[8px] font-medium text-[#1f2024]">{peca.nome}</td>
                  <td className="px-3 py-2">
                    <Badge texto={peca.tipo} variante="default" />
                  </td>
                  <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">{peca.fornecedor}</td>
                  <td className="px-3 py-2">
                    <Badge texto={peca.status} variante={resolverVariante(peca.status)} />
                  </td>
                  <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">{peca.dataCadastro}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => setPecaEditando(peca)}
                      className="font-inter text-[7px] text-[#8f9098] underline hover:text-[#1f2024]"
                    >
                      status
                    </button>
                  </td>
                </tr>
              ))}
              {aeronaveAtiva.pecas.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center font-inter text-[8px] text-[#8f9098]">
                    nenhuma peca cadastrada para esta aeronave
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {aeronaveAtiva && (
        <ModalAdicionarPeca
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onSalvo={() => { setModalAberto(false); carregar(); }}
          aeronaveId={aeronaveAtiva.id}
        />
      )}

      {pecaEditando && aeronaveAtiva && (
        <ModalEditarStatus
          peca={pecaEditando}
          onFechar={() => setPecaEditando(null)}
          onSalvo={(novoStatus) => {
            handleAtualizarStatus(pecaEditando.id, novoStatus);
            setPecaEditando(null);
          }}
        />
      )}
    </div>
  );
}

// =======================================

interface ModalAdicionarPecaProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
  aeronaveId: string;
}

function ModalAdicionarPeca({ aberto, onFechar, onSalvo, aeronaveId }: ModalAdicionarPecaProps) {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<TipoPeca>(TipoPeca.ESTRUTURAL);
  const [fornecedor, setFornecedor] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const resetar = () => { setNome(""); setTipo(TipoPeca.ESTRUTURAL); setFornecedor(""); setErro(""); };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !fornecedor.trim()) {
      setErro("nome e fornecedor sao obrigatorios.");
      return;
    }
    setSalvando(true);
    try {
      await adicionarPeca(aeronaveId, { nome: nome.trim(), tipo, fornecedor: fornecedor.trim() });
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
    <Modal titulo="adicionar peca" aberto={aberto} onFechar={handleFechar} largura="w-[360px]">
      <form onSubmit={handleSalvar} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="ex: Motor GE CF34"
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoPeca)}
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {Object.values(TipoPeca).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">fornecedor</label>
          <input
            value={fornecedor}
            onChange={(e) => setFornecedor(e.target.value)}
            placeholder="ex: GE Aviation"
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
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

// =======================================

interface ModalEditarStatusProps {
  peca: Peca;
  onFechar: () => void;
  onSalvo: (novoStatus: StatusPeca) => void;
}

function ModalEditarStatus({ peca, onFechar, onSalvo }: ModalEditarStatusProps) {
  const [status, setStatus] = useState<StatusPeca>(peca.status);

  return (
    <Modal titulo={`status — ${peca.nome}`} aberto={true} onFechar={onFechar} largura="w-[320px]">
      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">novo status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusPeca)}
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {Object.values(StatusPeca).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => onSalvo(status)}
            className="rounded bg-[#1f2024] px-5 py-[7px] font-inter text-[9px] text-white transition-opacity hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      </div>
    </Modal>
  );
}
