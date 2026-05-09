import { useState } from "react";
import type { FormEvent } from "react";
import { Header } from "../components/layout/Header";
import {
  autenticar,
  verificarEasterEgg,
  salvarSessao,
} from "../services/autenticacaoService";
import type { Funcionario } from "../models/tipos";

// =======================================

interface LoginProps {
  onAutenticado: (funcionario: Funcionario) => void;
  onEasterEgg: () => void;
}

export function Login({ onAutenticado, onEasterEgg }: LoginProps) {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro("");
    setCarregando(true);

    if (verificarEasterEgg(usuario, senha)) {
      setCarregando(false);
      onEasterEgg();
      return;
    }

    const funcionario = await autenticar(usuario, senha);
    setCarregando(false);

    if (!funcionario) {
      setErro("credenciais inválidas. tente novamente.");
      return;
    }

    salvarSessao(funcionario);
    onAutenticado(funcionario);
  };

  return (
    <div className="flex h-screen flex-col bg-[#f2f2f2]">
      <Header />
      <div className="flex flex-1 items-center justify-center">
        <div className="w-60 rounded-xl border-2 border-[#1f2024] bg-white overflow-hidden">
          <div className="h-[26px] rounded-t-[10px] bg-[#1f2024] px-3">
            <div className="flex h-full items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#454751]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#454751]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#454751]" />
              <span className="ml-4 h-2.5 w-[100px] rounded bg-[#2f3036] opacity-50" />
            </div>
          </div>

          <div className="px-6 pb-6 pt-5">
            <div className="mx-auto mb-4 grid h-9 w-9 grid-cols-2 gap-[2px] rounded border-2 border-[#1f2024] p-[7px]">
              <span className="rounded bg-[#1f2024] opacity-80" />
              <span className="rounded bg-[#1f2024] opacity-30" />
              <span className="rounded bg-[#1f2024] opacity-30" />
              <span className="rounded bg-[#1f2024] opacity-80" />
            </div>

            <div className="text-center">
              <h1 className="font-inter text-[9px] font-bold tracking-[0.90px] text-[#1f2024]">
                AEROCODE SPA
              </h1>
              <p className="mt-1 font-inter text-[7px] font-normal text-[#8f9098]">
                acesso ao sistema
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div>
                <label className="mb-1.5 block font-inter text-[8px] font-normal text-[#1f2024]">
                  usuario
                </label>
                <input
                  type="text"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  placeholder="matricula ou e-mail"
                  autoComplete="username"
                  className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none transition-colors placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
                />
              </div>
              <div>
                <label className="mb-1.5 block font-inter text-[8px] font-normal text-[#1f2024]">
                  senha
                </label>
                <input
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-8 w-full rounded border-2 border-[#c5c6cc] bg-white px-3 font-inter text-[8px] text-[#1f2024] outline-none transition-colors placeholder:text-[#c5c6cc] focus:border-[#1f2024]"
                />
              </div>

              {erro && (
                <p className="font-inter text-[7px] text-[#8f9098]">{erro}</p>
              )}

              <button
                type="submit"
                disabled={carregando}
                className="h-8 w-full rounded bg-[#1f2024] font-inter text-[9px] font-normal tracking-[0.22px] text-white transition-opacity disabled:opacity-60 hover:opacity-90"
              >
                {carregando ? "verificando..." : "Acessar"}
              </button>
            </form>

            <div className="mt-4">
              <div className="relative flex items-center justify-center gap-3">
                <span className="h-px flex-1 bg-[#e8e9f1]" />
                <span className="font-inter text-[7px] font-normal text-[#8f9098]">ou</span>
                <span className="h-px flex-1 bg-[#e8e9f1]" />
              </div>
              <div className="mt-4 mx-auto h-1.5 w-[100px] rounded bg-[#e8e9f1]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
