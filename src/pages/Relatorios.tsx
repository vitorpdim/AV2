import { useEffect, useState } from "react";
import { listarAeronaves } from "../services/aeronaveService";
import type { Aeronave } from "../models/tipos";
import { Badge, resolverVariante } from "../components/ui/Badge";

// =======================================

export function Relatorios() {
  const [aeronaves, setAeronaves] = useState<Aeronave[]>([]);
  const [aeronaveId, setAeronaveId] = useState<string>("");
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const lista = await listarAeronaves();
      setAeronaves(lista);
      if (lista.length > 0) setAeronaveId(lista[0].id);
      setCarregando(false);
    };
    carregar().catch(() => console.error("falha ao carregar relatorios."));
  }, []);

  const aeronave = aeronaves.find((a) => a.id === aeronaveId) ?? null;

  if (carregando) {
    return (
      <div className="flex h-full items-center justify-center">
        <span className="font-inter text-[9px] text-[#8f9098]">carregando...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <select
          value={aeronaveId}
          onChange={(e) => setAeronaveId(e.target.value)}
          className="h-7 rounded border-2 border-[#e8e9f1] bg-white px-2 font-inter text-[8px] text-[#1f2024] outline-none focus:border-[#1f2024]"
        >
          {aeronaves.map((a) => (
            <option key={a.id} value={a.id}>[{a.codigo}] {a.modelo}</option>
          ))}
        </select>
      </div>

      {aeronave && (
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-4">
            <p className="mb-3 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">DADOS DA AERONAVE</p>
            <div className="grid grid-cols-3 gap-3">
              <InfoRelatorio label="codigo" valor={aeronave.codigo} />
              <InfoRelatorio label="modelo" valor={aeronave.modelo} />
              <InfoRelatorio label="tipo" valor={aeronave.tipo} />
              <InfoRelatorio label="capacidade" valor={aeronave.capacidade > 0 ? `${aeronave.capacidade} pax` : "-"} />
              <InfoRelatorio label="alcance" valor={`${aeronave.alcance} km`} />
              <InfoRelatorio label="cadastro" valor={aeronave.dataCadastro} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <CartaoContagem label="PECAS" valor={aeronave.pecas.length} />
            <CartaoContagem label="ETAPAS" valor={aeronave.etapas.length} />
            <CartaoContagem label="TESTES" valor={aeronave.testes.length} />
          </div>

          {aeronave.etapas.length > 0 && (
            <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-4">
              <p className="mb-3 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">PROGRESSO DE ETAPAS</p>
              <div className="space-y-2">
                {aeronave.etapas.map((etapa) => (
                  <div
                    key={etapa.id}
                    className="flex items-center justify-between border-b border-[#f2f2f2] pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-inter text-[8px] text-[#1f2024]">{etapa.nome}</p>
                      <p className="font-inter text-[7px] text-[#8f9098]">prazo: {etapa.prazo}</p>
                    </div>
                    <Badge texto={etapa.status} variante={resolverVariante(etapa.status)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {aeronave.testes.length > 0 && (
            <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-4">
              <p className="mb-3 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">RESULTADOS DE TESTES</p>
              <div className="space-y-2">
                {aeronave.testes.map((teste) => (
                  <div
                    key={teste.id}
                    className="flex items-center justify-between border-b border-[#f2f2f2] pb-2 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-inter text-[8px] text-[#1f2024]">{teste.tipo}</p>
                      <p className="font-inter text-[7px] text-[#8f9098]">{teste.data}</p>
                    </div>
                    <Badge texto={teste.resultado} variante={resolverVariante(teste.resultado)} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// =======================================

function InfoRelatorio({ label, valor }: { label: string; valor: string }) {
  return (
    <div>
      <p className="mb-0.5 font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">{label}</p>
      <p className="font-inter text-[8px] text-[#1f2024]">{valor}</p>
    </div>
  );
}

function CartaoContagem({ label, valor }: { label: string; valor: number }) {
  return (
    <div className="rounded-lg border-2 border-[#e8e9f1] bg-white p-3">
      <p className="font-inter text-[7px] tracking-[0.35px] text-[#8f9098]">{label}</p>
      <p className="mt-1 font-inter text-[20px] font-bold leading-none text-[#1f2024]">{valor}</p>
    </div>
  );
}
