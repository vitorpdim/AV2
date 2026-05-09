import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Badge, resolverVariante } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { listarAeronaves, adicionarTeste } from "../services/aeronaveService";
import type { Aeronave } from "../models/tipos";
import { TipoTeste, ResultadoTeste } from "../models/enums";

// =======================================

export function Testes() {
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
    carregar().catch(() => console.error("falha ao carregar testes."));
  }, []);

  const aeronaveAtiva = aeronaves.find((a) => a.id === aeronaveId) ?? null;

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
            <option key={a.id} value={a.id}>[{a.codigo}] {a.modelo}</option>
          ))}
        </select>
        {aeronaveAtiva && (
          <button
            onClick={() => setModalAberto(true)}
            className="rounded border border-[#1f2024] bg-[#1f2024] px-3 py-1.5 font-inter text-[8px] text-white transition-opacity hover:opacity-90"
          >
            registrar teste
          </button>
        )}
      </div>

      {aeronaveAtiva && (
        <div className="overflow-hidden rounded-lg border-2 border-[#e8e9f1]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e8e9f1] bg-[#f8f9fe]">
                {["tipo", "resultado", "data", "observacoes"].map((col) => (
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
              {aeronaveAtiva.testes.map((teste) => (
                <tr key={teste.id} className="border-b border-[#e8e9f1] hover:bg-[#f8f9fe]">
                  <td className="px-3 py-2">
                    <Badge texto={teste.tipo} variante="default" />
                  </td>
                  <td className="px-3 py-2">
                    <Badge texto={teste.resultado} variante={resolverVariante(teste.resultado)} />
                  </td>
                  <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">{teste.data}</td>
                  <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">
                    {teste.observacoes ?? "-"}
                  </td>
                </tr>
              ))}
              {aeronaveAtiva.testes.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-3 py-6 text-center font-inter text-[8px] text-[#8f9098]">
                    nenhum teste registrado para esta aeronave
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {aeronaveAtiva && (
        <ModalRegistrarTeste
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

interface ModalRegistrarTesteProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
  aeronaveId: string;
}

function ModalRegistrarTeste({ aberto, onFechar, onSalvo, aeronaveId }: ModalRegistrarTesteProps) {
  const [tipo, setTipo] = useState<TipoTeste>(TipoTeste.FUNCIONAL);
  const [resultado, setResultado] = useState<ResultadoTeste>(ResultadoTeste.PENDENTE);
  const [observacoes, setObservacoes] = useState("");
  const [salvando, setSalvando] = useState(false);

  const resetar = () => {
    setTipo(TipoTeste.FUNCIONAL);
    setResultado(ResultadoTeste.PENDENTE);
    setObservacoes("");
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    try {
      await adicionarTeste(aeronaveId, {
        tipo,
        resultado,
        observacoes: observacoes.trim() || undefined,
      });
      resetar();
      onSalvo();
    } catch (err) {
      console.error("falha ao registrar o teste.", err);
    } finally {
      setSalvando(false);
    }
  };

  const handleFechar = () => { resetar(); onFechar(); };

  return (
    <Modal titulo="registrar teste" aberto={aberto} onFechar={handleFechar} largura="w-[360px]">
      <form onSubmit={handleSalvar} className="space-y-4">
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoTeste)}
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {Object.values(TipoTeste).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">resultado</label>
          <select
            value={resultado}
            onChange={(e) => setResultado(e.target.value as ResultadoTeste)}
            className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {Object.values(ResultadoTeste).map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block font-inter text-[8px] text-[#1f2024]">observacoes (opcional)</label>
          <textarea
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className="w-full rounded border-2 border-[#c5c6cc] bg-white px-3 py-2 font-inter text-[8px] text-[#1f2024] outline-none resize-none placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
          />
        </div>
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
