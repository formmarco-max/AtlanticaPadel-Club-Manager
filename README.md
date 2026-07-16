# 🎾 Atlantica Padel Club Manager (APCM)

> Plataforma web para gestão integrada de academias de padel.

---

## 📖 Sobre o Projeto

O **Atlantica Padel Club Manager (APCM)** é uma plataforma web desenvolvida para centralizar e simplificar a gestão operacional de academias de padel.

O objetivo é disponibilizar uma solução moderna, intuitiva e escalável que permita gerir toda a atividade diária da academia através de uma única aplicação.

Este projeto está a ser desenvolvido no âmbito do **Projeto Final de Licenciatura da Universidade Atlântica**.

---

# 🎯 Objetivos

O APCM pretende responder às necessidades de academias de padel com **2 a 20 campos**, permitindo:

- Gestão de sócios
- Gestão de treinadores
- Gestão de funcionários
- Gestão de campos
- Gestão de reservas
- Gestão de aulas
- Dashboard com indicadores
- Relatórios
- Automatização de processos
- Integração futura com Inteligência Artificial

---

# 🚀 Estado do Projeto

**Versão atual:** `v0.1.0`

## ✅ Concluído

- Documentação inicial
- Product Vision
- Product Scope
- User Roles & Personas
- Requirements
- Use Cases
- Arquitetura
- Database Design
- API Design
- Technology Stack
- Estrutura do projeto
- Frontend Next.js
- Backend NestJS
- PostgreSQL
- Prisma ORM
- Primeira Migração
- Seed da Base de Dados
- REST API
- Endpoint Health
- Endpoint Roles
- Swagger
- Validation Pipe

---

## 🚧 Em Desenvolvimento

- Autenticação JWT
- Gestão de Utilizadores

---

## ⏳ Planeado

- Gestão de Sócios
- Gestão de Treinadores
- Gestão de Campos
- Gestão de Reservas
- Gestão de Aulas
- Dashboard
- Relatórios
- Notificações
- Inteligência Artificial

---

# 🛠 Stack Tecnológica

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- NestJS
- TypeScript
- Prisma ORM

## Base de Dados

- PostgreSQL

## Documentação

- Markdown
- Draw.io
- Figma

---

# 🏗 Arquitetura

```text
                +----------------------+
                |     Frontend         |
                |      Next.js         |
                +----------+-----------+
                           |
                           |
                    REST API (HTTPS)
                           |
                           |
                +----------v-----------+
                |      Backend         |
                |      NestJS          |
                +----------+-----------+
                           |
                           |
                     Prisma ORM
                           |
                           |
                +----------v-----------+
                |     PostgreSQL       |
                +----------------------+
```

---

# 📂 Estrutura do Projeto

```text
AtlanticaPadel-Club-Manager/

│
├── apps/
│   ├── api/
│   └── web/
│
├── docs/
│   ├── requirements/
│   ├── architecture/
│   ├── design/
│   ├── uml/
│   └── wireframes/
│
└── README.md
```

---

# 📚 Funcionalidades Implementadas

## Backend

- API REST
- Swagger
- Validação Global
- Prisma ORM
- PostgreSQL
- Migrations
- Seeds

---

# 📋 Funcionalidades Planeadas

## Gestão

- Gestão de Sócios
- Gestão de Treinadores
- Gestão de Funcionários
- Gestão de Campos
- Gestão de Reservas
- Gestão de Aulas

## Dashboards

- Estatísticas
- KPIs
- Ocupação
- Receita
- Utilização dos Campos

## Inteligência Artificial

O APCM irá integrar um módulo de Inteligência Artificial capaz de analisar vídeos de jogos de padel.

Entre as funcionalidades previstas encontram-se:

- Identificação automática de Winners
- Identificação de Erros Não Forçados
- Identificação de Erros Forçados
- Estatísticas da partida
- Apoio à análise técnica por parte dos treinadores

Esta funcionalidade constitui um dos principais fatores diferenciadores do projeto.

---

# 📈 Roadmap

| Módulo | Estado |
|---------|:------:|
| Documentação | ✅ |
| Arquitetura | ✅ |
| Backend | 🚧 |
| Frontend | 🚧 |
| Base de Dados | ✅ |
| Swagger | ✅ |
| JWT | ⏳ |
| Utilizadores | ⏳ |
| Sócios | ⏳ |
| Treinadores | ⏳ |
| Campos | ⏳ |
| Reservas | ⏳ |
| Aulas | ⏳ |
| Dashboard | ⏳ |
| IA | ⏳ |

---

# 🚀 Como executar o projeto

## Backend

```bash
cd apps/api

npm install

npm run start:dev
```

Swagger:

```
http://localhost:3001/api
```

---

## Frontend

```bash
cd apps/web

npm install

npm run dev
```

---

# 📄 Documentação

Toda a documentação técnica encontra-se na pasta:

```text
docs/
```

Incluindo:

- Product Vision
- Product Scope
- User Roles
- Requirements
- Use Cases
- UML
- Arquitetura
- Base de Dados
- API Design

---

# 👨‍💻 Autor

**Marco Oliveira**

Projeto Final de Licenciatura

Universidade Atlântica

2026

---

# 📌 Estado Atual

> O projeto encontra-se em desenvolvimento ativo, seguindo uma abordagem incremental baseada em sprints, com documentação atualizada continuamente e controlo de versões através de Git/GitHub.