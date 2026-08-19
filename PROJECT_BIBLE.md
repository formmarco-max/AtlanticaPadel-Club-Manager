# PROJECT BIBLE --- Atlantica Padel Club Manager

> **Documento de referência consolidado do APCM**\
> *Simplifying Padel Club Management*

------------------------------------------------------------------------

## 1. Identificação

  Campo         Valor
  ------------- ---------------------------------
  Projeto       Atlantica Padel Club Manager
  Sigla         APCM
  Tipo          Plataforma web full-stack
  Contexto      Projeto Final de Licenciatura
  Curso         Gestão de Sistemas e Computação
  Instituição   Universidade Atlântica
  Autor         Marco Oliveira
  Nº de aluno   202327048
  Orientador    Professor Doutor Paulo Pombinho
  Ano           2026
  Estado        MVP concluído

------------------------------------------------------------------------

## 2. Product Vision

O **APCM** centraliza e simplifica a gestão operacional de clubes e
academias de padel, substituindo processos fragmentados por uma
plataforma única para gestão de sócios, treinadores, campos, reservas e
indicadores operacionais.

### Objetivo do MVP

-   autenticação e controlo de acessos;
-   gestão de sócios;
-   gestão de treinadores;
-   gestão de campos;
-   reservas com validação automática de disponibilidade;
-   dashboard administrativo;
-   frontend funcional;
-   API REST documentada.

### Princípios

**Simplicidade · Consistência · Modularidade · Manutenibilidade ·
Escalabilidade · Segurança · UX**

------------------------------------------------------------------------

## 3. Âmbito

### Implementado no MVP

-   autenticação JWT;
-   RBAC;
-   utilizadores e clubes;
-   sócios;
-   treinadores;
-   campos;
-   reservas;
-   dashboard;
-   perfil/definições;
-   API REST;
-   Swagger/OpenAPI;
-   estrutura base da página de relatórios.

### Evolução futura

-   aulas/agenda completas;
-   relatórios avançados;
-   pagamentos;
-   notificações;
-   torneios;
-   aplicação móvel;
-   analytics/BI;
-   IA para análise de jogos.

------------------------------------------------------------------------

## 4. Perfis e casos de utilização

Perfis analisados: **Admin, Rececionista, Treinador e Sócio**.

  ID       Caso de utilização
  -------- ------------------------------
  UC-001   Autenticar utilizador
  UC-002   Consultar dashboard
  UC-003   Gerir sócios
  UC-004   Gerir treinadores
  UC-005   Gerir campos
  UC-006   Gerir reservas
  UC-007   Gerir aulas
  UC-008   Consultar agenda
  UC-009   Consultar e atualizar perfil
  UC-010   Terminar sessão

Aulas e agenda foram consideradas na análise funcional, mas não
constituem módulos completos da versão atual do MVP.

------------------------------------------------------------------------

## 5. Arquitetura

``` text
Browser
   │ HTTPS
   ▼
Next.js 16 + React 19
   │ REST API / JSON
   ▼
NestJS 11
   │ Prisma ORM
   ▼
PostgreSQL
```

### Frontend

Interface, navegação, formulários, validação no cliente, sessão,
comunicação HTTP e feedback visual.

### Backend

Autenticação, autorização, DTOs, regras de negócio, coordenação dos
módulos, API REST e Swagger.

### Persistência

PostgreSQL, Prisma ORM, migrations e integridade relacional.

------------------------------------------------------------------------

## 6. Decisões técnicas

-   arquitetura modular;
-   separação de responsabilidades;
-   Service Layer;
-   DTO Pattern;
-   Guards e Decorators;
-   Dependency Injection;
-   REST;
-   RBAC;
-   ORM;
-   validação frontend + backend.

A lógica crítica permanece no backend.

------------------------------------------------------------------------

## 7. Stack

### Frontend

Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · React
Hook Form · Zod · TanStack Table · Axios · Lucide React

### Backend

NestJS 11 · TypeScript · Prisma 7 · PostgreSQL · Passport.js · JWT ·
Swagger/OpenAPI

### Ferramentas

Git · GitHub · VS Code · pgAdmin · Prisma Studio · Postman · Swagger UI
· Markdown · diagrams.net · Mermaid

------------------------------------------------------------------------

## 8. Estrutura

``` text
AtlanticaPadel-Club-Manager/
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   └── src/
│   │       ├── auth/
│   │       ├── users/
│   │       ├── roles/
│   │       ├── clubs/
│   │       ├── members/
│   │       ├── coaches/
│   │       ├── courts/
│   │       ├── reservations/
│   │       ├── dashboard/
│   │       └── common/
│   └── web/
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       └── types/
├── docs/
├── planning/
├── report/
├── PROJECT_BIBLE.md
└── README.md
```

------------------------------------------------------------------------

## 9. Módulos

### Autenticação e autorização

Login, JWT, proteção de endpoints, RBAC, guards/decorators e gestão de
sessão.

### Sócios

CRUD funcional, identificação, contactos, número de sócio e estado.

### Treinadores

CRUD funcional, especialidade, certificações e estado.

### Campos

Gestão de campos e respetivas características operacionais.

### Reservas

Criação, consulta, alteração, cancelamento, disponibilidade, prevenção
de conflitos e cálculo de valor.

### Dashboard

KPIs de sócios ativos, treinadores, reservas do dia e campos
disponíveis, além de reservas agendadas e ações rápidas.

### Definições

Consulta e atualização de dados do utilizador, incluindo nome, telefone,
avatar e outras informações de perfil.

### Relatórios

Estrutura base de interface no MVP. Relatórios avançados e analytics
permanecem trabalho futuro.

------------------------------------------------------------------------

## 10. Regras de negócio --- Reservas

1.  Validar existência das entidades.
2.  Validar pertença ao clube.
3.  Validar estado do sócio.
4.  Validar estado/disponibilidade do campo.
5.  Considerar manutenção.
6.  Validar data e hora.
7.  Impedir reservas no passado.
8.  Impedir sobreposição.
9.  Respeitar horário de funcionamento.
10. Respeitar duração.
11. Respeitar intervalo mínimo.
12. Tratar corretamente reservas canceladas.
13. Calcular automaticamente o preço.
14. Registar a data de cancelamento.

------------------------------------------------------------------------

## 11. UI / UX

Padrões principais:

-   sidebar e header;
-   cards KPI;
-   tabelas;
-   pesquisa;
-   badges;
-   ações por registo;
-   componentes reutilizáveis;
-   feedback contextual.

### Formulários

-   secções lógicas;
-   labels claros;
-   indicação de obrigatoriedade;
-   validação;
-   ações Cancelar/Guardar;
-   feedback após submissão.

------------------------------------------------------------------------

## 12. Testes

  Área                Resultado
  ------------------ -----------
  Autenticação            ✔
  Autorização             ✔
  CRUD Sócios             ✔
  CRUD Campos             ✔
  CRUD Treinadores        ✔
  CRUD Reservas           ✔
  Dashboard               ✔
  API REST                ✔
  Swagger                 ✔

Foram validados os fluxos críticos do MVP, comunicação frontend/backend,
persistência, JWT e autorização.

------------------------------------------------------------------------

## 13. Metodologia

Desenvolvimento incremental segundo princípios Agile/Scrum, estruturado
em oito sprints de duas semanas.

  Sprint   Objetivo principal
  -------- ---------------------------------------------------
  1        Setup, monorepo, modelo de dados e migrations
  2        JWT, RBAC e utilizadores
  3        Clubes e sócios
  4        Campos e reservas
  5        Treinadores, dashboard e Swagger
  6        Frontend, layout, autenticação e dashboard
  7        Módulos frontend, tabelas e formulários
  8        Testes, correções, documentação e relatório final

------------------------------------------------------------------------

## 14. Estado consolidado

### MVP

-   [x] Arquitetura full-stack
-   [x] PostgreSQL + Prisma
-   [x] API REST
-   [x] JWT + RBAC
-   [x] Sócios
-   [x] Treinadores
-   [x] Campos
-   [x] Reservas
-   [x] Dashboard
-   [x] Definições
-   [x] Swagger
-   [x] Frontend funcional
-   [x] Validação funcional dos fluxos críticos
-   [x] Estrutura base de relatórios

### Pós-MVP

-   [ ] APCM Mobile
-   [ ] APCM Analytics
-   [ ] APCM AI
-   [ ] Pagamentos
-   [ ] Notificações
-   [ ] Torneios
-   [ ] Relatórios avançados
-   [ ] Aulas/agenda completas

------------------------------------------------------------------------

## 15. Roadmap

### APCM Mobile

Reservas, disponibilidade, aulas, perfil e notificações para sócios e
treinadores.

### APCM Analytics

Ocupação, evolução de sócios, utilização de recursos, receitas,
tendências e reporting.

### APCM AI

Análise de jogos e geração de informação de desempenho com Inteligência
Artificial.

### Pagamentos e notificações

Automatização financeira e comunicação.

### Torneios

Gestão de competições e participantes.

------------------------------------------------------------------------

## 16. Limitações

O desenvolvimento foi realizado individualmente e condicionado pelo
prazo académico. A prioridade foi a conclusão e estabilidade das
funcionalidades essenciais do MVP, deixando funcionalidades
complementares para evolução futura.

------------------------------------------------------------------------

## 17. Fontes de verdade

Para evitar divergências:

1.  **Relatório Final** --- referência académica oficial do estado
    entregue;
2.  **Código-fonte** --- implementação técnica real;
3.  **PROJECT_BIBLE.md** --- referência consolidada;
4.  **README.md** --- apresentação pública;
5.  documentação histórica --- contexto.

------------------------------------------------------------------------

## 18. Convenções

-   Idioma: Português
-   Produto: **Atlantica Padel Club Manager**
-   Sigla: **APCM**
-   Slogan: **Simplifying Padel Club Management**
-   Frontend: **Next.js 16 + React 19**
-   Backend: **NestJS 11**
-   ORM: **Prisma 7**
-   BD: **PostgreSQL**
-   Autenticação: **JWT**
-   Autorização: **RBAC**

------------------------------------------------------------------------

## 19. Identidade académica

**Atlantica Padel Club Manager --- Plataforma Web para Gestão de Clubes
de Padel**

**Autor:** Marco Oliveira --- 202327048\
**Curso:** Licenciatura em Gestão de Sistemas e Computação\
**Instituição:** Universidade Atlântica\
**Orientador:** Professor Doutor Paulo Pombinho\
**Ano:** 2026
