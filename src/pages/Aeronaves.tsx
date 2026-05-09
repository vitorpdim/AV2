import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "../components/ui/Modal";
import { Badge, resolverVariante } from "../components/ui/Badge";
import { listarAeronaves, criarAeronave, removerAeronave } from "../services/aeronaveService";
import type { Aeronave } from "../models/tipos";
import { TipoAeronave } from "../models/enums";

// =======================================

export function Aeronaves() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [modalAberto, setModalAberto] = useState(false);
  const [aeronaveDetalhes, setAeronaveDetalhes] = useState<Aeronave | null>(null);

  const carregar = async () => {
    const lista = await listarAeronaves();
    setAeronaves(lista);
    setCarregando(false);
  };

  useEffect(() => {
    carregar().catch(() => console.error("falha ao carregar as aeronaves do mock JSON."));
  }, []);

  const handleRemover = async (id: string) => {
    await removerAeronave(id);
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
        <p className="font-inter text-[8px] tracking-[0.40px] text-[#8f9098]">
          {aeronaves.length} aeronave{aeronaves.length !== 1 ? "s" : ""} cadastrada{aeronaves.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setModalAberto(true)}
          className="rounded border border-[#1f2024] bg-[#1f2024] px-3 py-1.5 font-inter text-[8px] text-white transition-opacity hover:opacity-90"
        >
          cadastrar
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border-2 border-[#e8e9f1]">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e8e9f1] bg-[#f8f9fe]">
              {["codigo", "modelo", "tipo", "capacidade", "etapas", "testes", ""].map((col) => (
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
            {aeronaves.map((aeronave) => (
              <tr
                key={aeronave.id}
                className="border-b border-[#e8e9f1] transition-colors hover:bg-[#f8f9fe]"
              >
                <td className="px-3 py-2 font-inter text-[8px] font-medium text-[#1f2024]">
                  {aeronave.codigo}
                </td>
                <td className="px-3 py-2 font-inter text-[8px] text-[#1f2024]">
                  {aeronave.modelo}
                </td>
                <td className="px-3 py-2">
                  <Badge texto={aeronave.tipo} variante="default" />
                </td>
                <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">
                  {aeronave.capacidade > 0 ? `${aeronave.capacidade} pax` : "-"}
                </td>
                <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">
                  {aeronave.etapas.length}
                </td>
                <td className="px-3 py-2 font-inter text-[8px] text-[#8f9098]">
                  {aeronave.testes.length}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAeronaveDetalhes(aeronave)}
                      className="font-inter text-[7px] text-[#8f9098] underline transition-colors hover:text-[#1f2024]"
                    >
                      detalhes
                    </button>
                    <button
                      onClick={() => handleRemover(aeronave.id)}
                      className="font-inter text-[7px] text-[#c5c6cc] underline transition-colors hover:text-[#1f2024]"
                    >
                      remover
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {aeronaves.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center font-inter text-[8px] text-[#8f9098]">
                  nenhuma aeronave cadastrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalCadastroAeronave
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvo={() => { setModalAberto(false); carregar(); }}
        aeronavesCodigos={aeronaves.map((a) => a.codigo)}
      />

      {aeronaveDetalhes && (
        <ModalDetalhesAeronave
          aeronave={aeronaveDetalhes}
          onFechar={() => setAeronaveDetalhes(null)}
        />
      )}
    </div>
  );
}

// =======================================

interface ModalCadastroProps {
  aberto: boolean;
  onFechar: () => void;
  onSalvo: () => void;
  aeronavesCodigos: string[];
}

function ModalCadastroAeronave({ aberto, onFechar, onSalvo, aeronavesCodigos }: ModalCadastroProps) {
  const [codigo, setCodigo] = useState("");
  const [modelo, setModelo] = useState("");
  const [tipo, setTipo] = useState<TipoAeronave>(TipoAeronave.COMERCIAL);
  const [capacidade, setCapacidade] = useState("");
  const [alcance, setAlcance] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const resetar = () => {
    setCodigo(""); setModelo(""); setTipo(TipoAeronave.COMERCIAL);
    setCapacidade(""); setAlcance(""); setErro("");
  };

  const handleSalvar = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!codigo.trim() || !modelo.trim()) {
      setErro("codigo e modelo sao obrigatorios.");
      return;
    }

    if (aeronavesCodigos.includes(codigo.trim())) {
      setErro(`o codigo ${codigo} ja esta em uso.`);
      return;
    }

    setSalvando(true);
    try {
      await criarAeronave({
        codigo: codigo.trim(),
        modelo: modelo.trim(),
        tipo,
        capacidade: parseInt(capacidade) || 0,
        alcance: parseInt(alcance) || 0,
      });
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
    <Modal titulo="cadastro de aeronave" aberto={aberto} onFechar={handleFechar} largura="w-[380px]">
      <form onSubmit={handleSalvar} className="space-y-4">
        <CampoForm label="codigo" placeholder="ex: AC-0001" value={codigo} onChange={setCodigo} />
        <CampoForm label="modelo" placeholder="ex: Embraer E175" value={modelo} onChange={setModelo} />

        <div>
          <label className="mb-1.5 block font-inter text-[8px] font-normal text-[#1f2024]">tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoAeronave)}
            className="h-8 w-full appearance-none rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
          >
            {Object.values(TipoAeronave).map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <CampoForm label="capacidade" placeholder="no. de passageiros" value={capacidade} onChange={setCapacidade} type="number" />
        <CampoForm label="alcance (km)" placeholder="ex: 3700" value={alcance} onChange={setAlcance} type="number" />

        {erro && <p className="font-inter text-[7px] text-[#8f9098]">{erro}</p>}

        <div className="border-t border-[#e8e9f1] pt-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-1.5 w-20 rounded bg-[#e8e9f1]" />
              <div className="h-1.5 w-14 rounded bg-[#e8e9f1]" />
            </div>
            <button
              type="submit"
              disabled={salvando}
              className="rounded bg-[#1f2024] px-5 py-[7px] font-inter text-[9px] text-white transition-opacity disabled:opacity-60 hover:opacity-90"
            >
              {salvando ? "salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}

// =======================================

interface ModalDetalhesProps {
  aeronave: Aeronave;
  onFechar: () => void;
}

function ModalDetalhesAeronave({ aeronave, onFechar }: ModalDetalhesProps) {
  return (
    <Modal titulo={`${aeronave.codigo} — ${aeronave.modelo}`} aberto={true} onFechar={onFechar} largura="w-[480px]">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <InfoItem label="tipo" valor={aeronave.tipo} />
          <InfoItem label="capacidade" valor={aeronave.capacidade > 0 ? `${aeronave.capacidade} pax` : "-"} />
          <InfoItem label="alcance" valor={`${aeronave.alcance} km`} />
          <InfoItem label="cadastro" valor={aeronave.dataCadastro} />
        </div>

        {aeronave.etapas.length > 0 && (
          <div>
            <p className="mb-2 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">ETAPAS</p>
            <div className="space-y-1.5">
              {aeronave.etapas.map((etapa) => (
                <div key={etapa.id} className="flex items-center justify-between rounded border border-[#e8e9f1] px-2 py-1.5">
                  <span className="font-inter text-[8px] text-[#1f2024]">{etapa.nome}</span>
                  <Badge texto={etapa.status} variante={resolverVariante(etapa.status)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {aeronave.pecas.length > 0 && (
          <div>
            <p className="mb-2 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">PECAS</p>
            <div className="space-y-1.5">
              {aeronave.pecas.map((peca) => (
                <div key={peca.id} className="flex items-center justify-between rounded border border-[#e8e9f1] px-2 py-1.5">
                  <span className="font-inter text-[8px] text-[#1f2024]">{peca.nome}</span>
                  <Badge texto={peca.status} variante={resolverVariante(peca.status)} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// =======================================

interface CampoFormProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}

function CampoForm({ label, placeholder, value, onChange, type = "text" }: CampoFormProps) {
  return (
    <div>
      <label className="mb-1.5 block font-inter text-[8px] font-normal text-[#1f2024]">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none transition-colors placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
      />
    </div>
  );
}

function InfoItem({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="mb-0.5 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">{label}</p>
      <p className="font-inter text-[8px] text-[#1f2024]">{valor}</p>
    </div>
  );
}
