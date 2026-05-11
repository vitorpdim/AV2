[https://www.figma.com/proto/5FFOgsLXd5UDywIQeZfeMd/ESBO%C3%87O-AEROCODE--Community-?node-id=0-1&p=f&t=1nF4o8OugsBO1tLD-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1](https://www.figma.com/proto/5FFOgsLXd5UDywIQeZfeMd/ESBO%C3%87O-AEROCODE--Community-?node-id=0-1&p=f&t=1nF4o8OugsBO1tLD-0&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1)

orientacao de montagem e configuracao de ambiente para rodar o projeto
======================================================================


pre-requisitos
--------------

- Node.js versao 18 ou superior (recomendado: 20 LTS)
  download: https://nodejs.org/

- npm versao 9 ou superior (ja incluido com o Node.js)

- Editor de codigo recomendado: VS Code
  download: https://code.visualstudio.com/

verificar instalacoes via terminal:

  node -v
  npm -v


estrutura de pastas do projeto
-------------------------------

  /
  README.md                     (este arquivo)
  orientacao-montagem.md        (deletado pois não havia necessidade de existir)
  index.html
  vite.config.ts
  tailwind.config.js
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  package.json

  /src
    App.tsx                     (componente raiz, gerencia telas e autenticacao)
    main.tsx                    (entrypoint react)
    index.css                   (estilos globais + tailwind)
    vite-env.d.ts

    /models
      enums.ts                  (TipoAeronave, StatusPeca, StatusEtapa, NivelPermissao, etc.)
      tipos.ts                  (interfaces: Aeronave, Peca, Etapa, Funcionario, Teste, etc.)

    /mocks
      aeronaves.json            (dados iniciais de aeronaves com pecas, etapas e testes)
      funcionarios.json         (usuarios do sistema com credenciais e nivel de permissao)
      producao-mensal.json      (dados do grafico de barras do dashboard)

    /services
      aeronaveService.ts        (CRUD de aeronaves, pecas, etapas e testes via localStorage)
      autenticacaoService.ts    (login, sessao, easter egg)
      funcionarioService.ts     (listagem e cadastro de funcionarios)
      dashboardService.ts       (metricas agregadas e dados mensais)

    /pages
      Login.tsx                 (tela de acesso ao sistema)
      EasterEgg.tsx
      Dashboard.tsx             (metricas e grafico de producao mensal)
      Aeronaves.tsx             (listagem, cadastro e detalhes de aeronaves)
      Pecas.tsx                 (gerenciamento de pecas por aeronave)
      GestaoEtapas.tsx          (kanban de etapas por aeronave)
      Testes.tsx                (registro e listagem de testes)
      Relatorios.tsx            (visao consolidada por aeronave)

    /components
      /layout
        Header.tsx              (cabecalho global com logo, usuario e versao)
        Sidebar.tsx             (menu lateral de navegacao)
        PainelLayout.tsx        (wrapper do layout autenticado)
      /ui
        Badge.tsx               (indicador visual de status)
        Modal.tsx               (dialogo reutilizavel com header escuro)
        GraficoBarras.tsx       (grafico SVG simples para producao mensal)


instalacao
----------

1. abra um terminal na pasta raiz do projeto (onde esta o package.json)

2. instale as dependencias:

   npm install

3. inicie o servidor de desenvolvimento:

   npm run dev

4. acesse no navegador: http://localhost:5173

credenciais de acesso (mock)
-----------------------------

  usuario: admin        senha: admin        (nivel: administrador)
  usuario: engenheiro   senha: engenheiro   (nivel: engenheiro)
  usuario: operador     senha: operador     (nivel: operador)

niveis de permissao:
- administrador: acesso total, incluindo gestao de funcionarios
- engenheiro: aeronaves, pecas, etapas, testes e relatorios
- operador: apenas aeronaves, pecas e etapas

persistencia de dados
---------------------

na primeira execucao, os dados iniciais sao carregados dos arquivos .json em /src/mocks.
nas execucoes seguintes, o localStorage ja possui os dados e os mocks nao sao lidos novamente.

para resetar os dados aos valores iniciais, abra o devtools do navegador (F12),
va em Application > Local Storage e apague as entradas:
  - aerocode_aeronaves
  - aerocode_funcionarios


build para producao
--------------------

  npm run build

os arquivos gerados ficam em /dist. para visualizar o build:

  npm run preview


tecnologias utilizadas
-----------------------

  React 18         framework de UI
  TypeScript       tipagem estatica
  Vite             bundler e servidor de desenvolvimento
  Tailwind CSS     estilizacao utility-first
  clsx             composicao condicional de classes CSS


compatibilidade
----------------

testado e compativel com:
- Windows 10 / 11
- Ubuntu 24.04 e derivados

requer Node.js 18+ em qualquer sistema operacional.
