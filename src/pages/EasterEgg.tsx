import { useEffect, useRef, useState } from "react";
import { Header } from "../components/layout/Header";

// =======================================

// o ascii abaixo e exibido de forma procedural, caracter por caracter
const ASCII_ART = `
                          :
                         :::
                        :::::
         --              : :              --
      --------                          -------
        ----                             ----
        -  -    =====================    -  -
               ==.  .............  .==
             ===.-- ====-...-==== -=.==+
          ===-.:==- ====  -.:==== -==:.-==+
        ===:.---==- =====:.  -=== -====-.:===
        ==.=: -. =- ====     ==== -=  :  =.-=
        ==.=-  .==- ============= -- =====.==
        ==-:==. -=- ============= -=:   --:=+
         == =:-===-:===--..:-====:-====== ==
          =-.==:======-=    =:========-=.-=
          ==:-===--=====.  =:-=-==--:==-:==
           == -====-====-  ======:====- ==
            ==.===- ====:  ====== -===.==
             == -=- ====:   -==== -=- ==
              ==::- =====-   .=== -::==
               ===  =============  -==
                 ==:.===========.:==
                   ==..=======..===
                    +==-.-=-.-===
                       ===:===
`;

interface EasterEggProps {
  onVoltar: () => void;
}

export function EasterEgg({ onVoltar }: EasterEggProps) {
  const [exibido, setExibido] = useState("");
  const indexRef = useRef(0);
  const animandoRef = useRef(true);

  useEffect(() => {
    animandoRef.current = true;
    indexRef.current = 0;
    setExibido("");

    const intervalo = setInterval(() => {
      if (!animandoRef.current) return;

      if (indexRef.current >= ASCII_ART.length) {
        clearInterval(intervalo);
        return;
      }

      const proximo = ASCII_ART[indexRef.current];
      setExibido((prev) => prev + proximo);
      indexRef.current += 1;
    }, 12);

    return () => {
      animandoRef.current = false;
      clearInterval(intervalo);
    };
  }, []);

  return (
    <div className="flex h-screen flex-col bg-white">
      <Header />
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <pre className="font-mono text-xs leading-tight text-[#1f2024] select-none whitespace-pre">
          {exibido}
        </pre>
        <button
          onClick={onVoltar}
          className="mt-8 rounded border border-[#c5c6cc] px-4 py-1.5 font-inter text-[8px] text-[#8f9098] transition-colors hover:border-[#1f2024] hover:text-[#1f2024]"
        >
          voltar ao login
        </button>
      </div>
    </div>
  );
}
