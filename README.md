# 🎾 Atlantica Padel Club Manager

::: {align="center"}
### **Simplifying Padel Club Management**

**Plataforma web full-stack para gestão integrada de clubes e academias
de padel**

Projeto Final de Licenciatura · Gestão de Sistemas e Computação ·
Universidade Atlântica · 2026

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![Status](https://img.shields.io/badge/Status-MVP%20Concluído-success)
:::

------------------------------------------------------------------------

## 📌 Sobre o projeto

O **Atlantica Padel Club Manager (APCM)** é uma plataforma web concebida
para centralizar a gestão operacional de clubes e academias de padel.

O projeto procura substituir processos fragmentados por uma solução
única, moderna e escalável para gerir **sócios, treinadores, campos,
reservas e indicadores operacionais**.

O APCM foi desenvolvido como **Produto Mínimo Viável (MVP)** no âmbito
do Projeto Final da Licenciatura em Gestão de Sistemas e Computação da
**Universidade Atlântica**.

> O objetivo do MVP é demonstrar uma arquitetura sólida, regras de
> negócio consistentes e a viabilidade de uma solução integrada para a
> gestão diária de uma academia de padel.

------------------------------------------------------------------------

## ✨ Principais funcionalidades

  Área             Funcionalidade                                       Estado
  ---------------- --------------------------------------------------- --------
  🔐 Segurança     Autenticação com JWT                                   ✅
  🛡️ Autorização   Controlo de acesso baseado em perfis (RBAC)            ✅
  👥 Sócios        Criação, consulta, edição e remoção                    ✅
  🎓 Treinadores   Criação, consulta, edição e remoção                    ✅
  🎾 Campos        Gestão de campos e respetivas características          ✅
  📅 Reservas      CRUD, cancelamento e validação de disponibilidade      ✅
  📊 Dashboard     KPIs e resumo da atividade operacional                 ✅
  ⚙️ Definições    Gestão de dados e preferências do utilizador           ✅
  📑 Relatórios    Estrutura base da interface                          🧩 MVP
  📚 API           API REST documentada com Swagger/OpenAPI               ✅

------------------------------------------------------------------------

## 🖥️ Aplicação

A interface do APCM foi desenvolvida com foco em **simplicidade,
consistência visual e eficiência operacional**.

O dashboard disponibiliza uma visão imediata da atividade da academia
através de indicadores de sócios ativos, treinadores, reservas do dia e
campos disponíveis, complementados por reservas agendadas e atalhos para
operações frequentes.

As principais áreas da aplicação são:

`Login` · `Dashboard` · `Sócios` · `Treinadores` · `Campos` · `Reservas`
· `Definições` · `Relatórios (estrutura MVP)`

------------------------------------------------------------------------

## 🏗️ Arquitetura

O APCM utiliza uma arquitetura **cliente-servidor em camadas**,
separando apresentação, lógica de negócio e persistência.

``` text
┌───────────────────────────────────────┐
│            Cliente / Browser          │
└───────────────────┬───────────────────┘
                    │ HTTPS
┌───────────────────▼───────────────────┐
│       Frontend — Next.js + React      │
│   UI · Forms · Navigation · Session   │
└───────────────────┬───────────────────┘
                    │ REST API / JSON
┌───────────────────▼───────────────────┐
│          Backend — NestJS             │
│ Controllers · Services · Guards · DTO │
│       Regras de negócio · RBAC        │
└───────────────────┬───────────────────┘
                    │ Prisma ORM
┌───────────────────▼───────────────────┐
│          PostgreSQL Database          │
└───────────────────────────────────────┘
```

------------------------------------------------------------------------

## 🧰 Stack tecnológica

### Frontend

**Next.js 16** · **React 19** · **TypeScript** · **Tailwind CSS v4** ·
**shadcn/ui** · **React Hook Form** · **Zod** · **TanStack Table** ·
**Axios** · **Lucide React**

### Backend

**NestJS 11** · **TypeScript** · **Prisma 7** · **PostgreSQL** ·
**Passport.js** · **JWT** · **RBAC** · **Swagger/OpenAPI**

### Desenvolvimento e documentação

**Git** · **GitHub** · **Visual Studio Code** · **Prisma Studio** ·
**pgAdmin** · **Postman** · **Swagger UI** · **Markdown** ·
**diagrams.net** · **Mermaid**

------------------------------------------------------------------------

## 🔐 Segurança

A plataforma implementa autenticação baseada em **JSON Web Tokens
(JWT)** e autorização através de **Role-Based Access Control (RBAC)**.

A lógica crítica é validada no backend através de módulos, controllers,
services, guards, decorators e DTOs, evitando depender exclusivamente do
cliente para garantir as regras de negócio.

------------------------------------------------------------------------

## 📅 Regras de negócio das reservas

O módulo de reservas constitui o núcleo funcional do APCM. Entre as
principais validações implementadas encontram-se:

-   existência e estado das entidades envolvidas;
-   pertença das entidades ao clube;
-   bloqueio de reservas em datas passadas;
-   prevenção de reservas sobrepostas;
-   horário de funcionamento;
-   duração configurada e intervalo mínimo;
-   manutenção do campo;
-   tratamento adequado de reservas canceladas;
-   cálculo automático do valor;
-   registo da data de cancelamento.

------------------------------------------------------------------------

## 🧪 Testes e validação

  Área validada           Resultado
  --------------------- -------------
  Autenticação           ✔️ Validado
  Autorização            ✔️ Validado
  CRUD de Sócios         ✔️ Validado
  CRUD de Campos         ✔️ Validado
  CRUD de Treinadores    ✔️ Validado
  CRUD de Reservas       ✔️ Validado
  Dashboard              ✔️ Validado
  API REST               ✔️ Validada
  Swagger                ✔️ Validado

Os testes funcionais do MVP confirmaram os principais fluxos, a
comunicação frontend/backend, a persistência de dados e os mecanismos de
autenticação e autorização.

------------------------------------------------------------------------

## 📂 Estrutura do repositório

``` text
AtlanticaPadel-Club-Manager/
├── apps/
│   ├── api/                 # Backend NestJS
│   │   ├── prisma/          # Schema e migrations
│   │   └── src/             # Módulos da API
│   └── web/                 # Frontend Next.js
│       ├── app/
│       ├── components/
│       ├── features/
│       ├── contexts/
│       ├── hooks/
│       ├── lib/
│       └── types/
├── docs/                    # Documentação técnica
├── planning/                # Planeamento
├── report/                  # Material do relatório
├── PROJECT_BIBLE.md         # Referência consolidada
└── README.md
```

------------------------------------------------------------------------

## 🚀 Execução local

### Pré-requisitos

-   Node.js 20+
-   npm
-   PostgreSQL

### Clonar

``` bash
git clone https://github.com/formmarco-max/AtlanticaPadel-Club-Manager.git
cd AtlanticaPadel-Club-Manager
```

### Backend

``` bash
cd apps/api
npm install
npx prisma generate
npx prisma migrate dev
npm run start:dev
```

Configurar previamente o `.env` com a ligação PostgreSQL e o segredo
JWT.

``` env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/apcm_db"
JWT_SECRET="change-me"
```

### Frontend

``` bash
cd apps/web
npm install
npm run dev
```

Durante o desenvolvimento, a configuração utilizada prevê o frontend em
`localhost:3000` e o backend em `localhost:3001`.

> Os nomes exatos dos scripts e variáveis devem ser confirmados nos
> respetivos ficheiros de configuração antes de uma instalação nova.

------------------------------------------------------------------------

## 🗺️ Roadmap pós-MVP

### 📱 APCM Mobile

Aplicação móvel orientada sobretudo a sócios e treinadores, com
reservas, disponibilidade, perfil, aulas e notificações.

### 📈 APCM Analytics

Business Intelligence para análise de ocupação, evolução de sócios,
utilização de recursos, receitas e tendências.

### 🤖 APCM AI

Extensão dedicada à análise de jogos de padel através de Inteligência
Artificial e geração de informação de desempenho.

### 💳 Pagamentos e notificações

Integração futura de pagamentos e mecanismos automáticos de comunicação.

### 🏆 Torneios

Gestão de competições, participantes e informação associada.

------------------------------------------------------------------------

## 🎓 Contexto académico

**Atlantica Padel Club Manager --- Plataforma Web para Gestão de Clubes
de Padel**

Projeto Final da **Licenciatura em Gestão de Sistemas e Computação**\
**Universidade Atlântica --- 2026**

**Autor:** Marco Oliveira\
**Aluno:** 202327048\
**Orientador:** Professor Doutor Paulo Pombinho

O projeto demonstra a aplicação integrada de conhecimentos de análise de
requisitos, arquitetura de software, desenvolvimento full-stack, bases
de dados, segurança, UX/UI, testes e gestão ágil.

------------------------------------------------------------------------

## 📄 Licença

Projeto desenvolvido para fins académicos.

**© 2026 Marco Oliveira. Todos os direitos reservados.**

------------------------------------------------------------------------

::: {align="center"}
### 🎾 Atlantica Padel Club Manager

**Simplifying Padel Club Management**

Built with Next.js · NestJS · TypeScript · Prisma · PostgreSQL
:::
