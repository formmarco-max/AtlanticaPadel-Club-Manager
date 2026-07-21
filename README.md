# 🎾 Atlantica Padel Club Manager (APCM)

> **Simplifying Padel Club Management**

Uma plataforma web moderna para gestão integrada de clubes e academias de padel.

---

# 📖 Sobre o Projeto

O **Atlantica Padel Club Manager (APCM)** é uma plataforma web desenvolvida para centralizar, simplificar e otimizar toda a gestão operacional de clubes e academias de padel.

A aplicação pretende disponibilizar uma solução moderna, intuitiva e escalável, permitindo gerir as operações diárias de um clube através de uma única plataforma.

O sistema foi concebido para responder às necessidades de clubes de pequena e média dimensão, disponibilizando ferramentas para gestão administrativa, operacional e desportiva.

Este projeto está a ser desenvolvido no âmbito do **Projeto Final de Licenciatura da Universidade Atlântica**.

---

# 🎯 Objetivos

O APCM tem como objetivo disponibilizar uma solução completa para clubes de padel, permitindo:

- Gestão de Utilizadores
- Gestão de Clubes
- Gestão de Sócios
- Gestão de Treinadores
- Gestão de Funcionários
- Gestão de Campos
- Gestão de Reservas
- Gestão de Aulas
- Dashboard de indicadores
- Relatórios de gestão
- Automatização de processos
- Integração futura com Inteligência Artificial

---

# 🚀 Estado do Projeto

**Versão atual:** `v0.7.0`

O backend encontra-se funcional e já implementa todo o núcleo da aplicação.

Atualmente encontram-se concluídos os módulos de:

- Autenticação
- Autorização
- Utilizadores
- Clubes
- Sócios
- Campos
- Reservas

Os próximos desenvolvimentos estarão focados nas funcionalidades avançadas, incluindo gestão de aulas, dashboards, estatísticas, disponibilidade dos campos, pagamentos e frontend.

---

# ✨ Funcionalidades

## ✅ Implementadas

### Segurança

- Autenticação JWT
- Autorização baseada em perfis (Roles)
- Proteção de endpoints
- Gestão de utilizadores autenticados

### Gestão de Utilizadores

- CRUD completo
- Associação de perfis
- Associação a clubes

### Gestão de Clubes

- CRUD completo
- Configuração de dados do clube

### Gestão de Sócios

- CRUD completo
- Associação opcional a utilizadores
- Número de sócio único
- Gestão de estado do sócio

### Gestão de Campos

- CRUD completo
- Tipos de campo
- Tipos de superfície
- Campos Indoor / Outdoor
- Estado ativo/inativo
- Horário de funcionamento
- Duração padrão das reservas
- Intervalo entre reservas
- Gestão de manutenção
- Preço por hora
- Configuração de iluminação

### Gestão de Reservas

- CRUD completo
- Associação a clube
- Associação a campo
- Associação a sócio
- Validação automática de disponibilidade
- Impede reservas sobrepostas
- Respeita horários de funcionamento
- Respeita duração configurada do campo
- Respeita intervalo mínimo entre reservas
- Validação de manutenção do campo
- Validação de entidades associadas
- Cálculo automático do preço
- Cancelamento de reservas

---

## 🚧 Em Desenvolvimento

- Gestão de Treinadores
- Gestão de Funcionários
- Gestão de Aulas
- Disponibilidade dos Campos
- Dashboard
- Estatísticas
- Relatórios

---

## ⏳ Planeado

- Pagamentos
- Notificações
- Calendário
- Reservas recorrentes
- Gestão de Torneios
- Integração com Inteligência Artificial

---

# 🛠 Stack Tecnológica

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS

## Backend

- NestJS 11
- TypeScript
- Prisma ORM 7
- PostgreSQL
- Passport.js
- JWT
- Swagger (OpenAPI)
- Class Validator
- Class Transformer

## Base de Dados

- PostgreSQL

## Ferramentas

- Git
- GitHub
- Prisma Studio
- Postman
- Swagger UI

## Documentação

- Markdown
- Draw.io
- Figma

---

# 🏗 Arquitetura

```text
                 +---------------------------+
                 |        Frontend           |
                 |         Next.js           |
                 +------------+--------------+
                              |
                        REST API (HTTPS)
                              |
                 +------------v--------------+
                 |        Backend            |
                 |         NestJS            |
                 +------------+--------------+
                              |
                         Prisma ORM
                              |
                 +------------v--------------+
                 |       PostgreSQL          |
                 +---------------------------+
```

O backend segue uma arquitetura modular baseada em **NestJS**, onde cada domínio funcional é implementado como um módulo independente, promovendo elevada coesão e baixo acoplamento.

---

# 📂 Estrutura do Projeto

```text
AtlanticaPadel-Club-Manager/

│
├── apps/
│   ├── api/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   ├── schema.prisma
│   │   │   └── seed.ts
│   │   │
│   │   └── src/
│   │       ├── auth/
│   │       ├── clubs/
│   │       ├── courts/
│   │       ├── members/
│   │       ├── reservations/
│   │       ├── roles/
│   │       ├── users/
│   │       ├── prisma/
│   │       ├── app.module.ts
│   │       └── main.ts
│   │
│   └── web/
│
├── docs/
│
└── README.md
```

A arquitetura foi desenhada para permitir a evolução do sistema através de módulos independentes, facilitando a manutenção e futura expansão da plataforma.

---

# ✅ Funcionalidades Implementadas

## Infraestrutura

- REST API
- Arquitetura Modular
- Prisma ORM
- PostgreSQL
- Migrations
- Seed Database
- ConfigModule
- Validation Pipe Global
- Swagger (OpenAPI)

---

## Autenticação

- JWT Authentication
- Login
- Passport JWT Strategy
- JwtAuthGuard
- Endpoint `/auth/login`
- Endpoint `/auth/me`

---

## Autorização

- Roles Decorator
- Roles Guard
- CurrentUser Decorator
- Proteção de endpoints por perfil

---

## Gestão de Utilizadores

- CRUD completo
- Associação de utilizadores a clubes
- Associação de perfis

---

## Gestão de Clubes

- CRUD completo
- Gestão dos dados do clube

---

## Gestão de Sócios

- CRUD completo
- Associação opcional a utilizadores
- Número de sócio único
- Gestão de estado do sócio

---

## Gestão de Campos

- CRUD completo
- Configuração do horário de funcionamento
- Configuração da duração das reservas
- Configuração do intervalo entre reservas
- Gestão de manutenção
- Configuração do preço por hora
- Gestão de iluminação

---

## Gestão de Reservas

- CRUD completo
- Validação de disponibilidade
- Impede reservas sobrepostas
- Validação do horário do campo
- Validação do estado do campo
- Validação da manutenção
- Cálculo automático do preço
- Cancelamento de reservas

---

# 📈 Roadmap

| Módulo | Estado |
|---------|:------:|
| Setup do Projeto | ✅ |
| Base de Dados | ✅ |
| Autenticação JWT | ✅ |
| Autorização | ✅ |
| Gestão de Utilizadores | ✅ |
| Gestão de Clubes | ✅ |
| Gestão de Sócios | ✅ |
| Gestão de Campos | ✅ |
| Gestão de Reservas | ✅ |
| Gestão de Treinadores | ⏳ |
| Gestão de Funcionários | ⏳ |
| Gestão de Aulas | ⏳ |
| Dashboard | ⏳ |
| Frontend | ⏳ |
| Inteligência Artificial | ⏳ |

---

# 🚀 Como executar o projeto

## Backend

```bash
cd apps/api

npm install

npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3001
```

Swagger:

```text
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

# 📚 Documentação

Toda a documentação técnica encontra-se na pasta:

```text
docs/
```

Incluindo documentação de apoio ao desenvolvimento do projeto:

- Product Vision
- Product Scope
- User Roles
- Requisitos Funcionais
- Requisitos Não Funcionais
- Casos de Utilização (Use Cases)
- Diagramas UML
- Arquitetura do Sistema
- Modelo da Base de Dados
- API Design
- Planeamento do Projeto

---

# 🗄️ Modelo de Dados

O modelo de dados encontra-se implementado em **PostgreSQL**, utilizando **Prisma ORM**.

Atualmente o sistema suporta as seguintes entidades principais:

- Roles
- Users
- Clubs
- Members
- Courts
- Reservations

O modelo foi desenhado para permitir a futura evolução da plataforma, incluindo módulos como:

- Coaches
- Employees
- Lessons
- Payments
- Tournaments
- Notifications

A arquitetura também contempla a possibilidade de evolução para um cenário multi-clube, mantendo atualmente uma implementação otimizada para gestão de um único clube.

---

# 🔐 Regras de Negócio Implementadas

O módulo de reservas implementa um conjunto de regras de negócio que garantem a consistência da informação e impedem situações inválidas.

Entre as principais validações encontram-se:

- Validação da existência do clube
- Validação da existência do campo
- Validação da existência do sócio
- Verificação de pertença ao mesmo clube
- Verificação do estado ativo do campo
- Verificação do estado ativo do sócio
- Verificação de manutenção do campo
- Validação da data e hora da reserva
- Impede reservas em datas passadas
- Impede reservas sobrepostas
- Respeita o horário de funcionamento do campo
- Respeita a duração configurada para o campo
- Respeita o intervalo mínimo entre reservas
- Ignora reservas canceladas na validação de disponibilidade
- Cálculo automático do valor da reserva
- Gestão automática da data de cancelamento

Estas regras encontram-se implementadas ao nível da camada de serviços (Service Layer), garantindo que são aplicadas independentemente do cliente que consuma a API.

---

# 📌 Estado Atual

Atualmente o **Atlantica Padel Club Manager** dispõe de um backend funcional com o núcleo da aplicação concluído.

Encontra-se implementado:

- Arquitetura modular em NestJS
- Base de Dados PostgreSQL
- Prisma ORM
- Autenticação JWT
- Autorização baseada em perfis
- Documentação Swagger
- CRUD completo de Utilizadores
- CRUD completo de Clubes
- CRUD completo de Sócios
- CRUD completo de Campos
- CRUD completo de Reservas
- Regras de negócio para gestão de reservas
- Seed inicial da base de dados

O projeto encontra-se preparado para a implementação das restantes funcionalidades de gestão e para o desenvolvimento da aplicação frontend.

---

# 🚀 Próximos Desenvolvimentos

Os próximos módulos previstos incluem:

- Gestão de Treinadores
- Gestão de Funcionários
- Gestão de Aulas
- Disponibilidade dos Campos
- Calendário de Reservas
- Dashboard Operacional
- Estatísticas
- Relatórios
- Pagamentos
- Notificações
- Gestão de Torneios

Posteriormente será iniciado o desenvolvimento da aplicação **Frontend** em **Next.js**, responsável pela interface de utilização da plataforma.

---

# 🤖 Inteligência Artificial

Um dos objetivos futuros do APCM consiste na integração de funcionalidades de Inteligência Artificial aplicadas ao padel.

Entre as funcionalidades previstas encontram-se:

- Análise automática de vídeos de jogos
- Identificação de Winners
- Identificação de Erros Forçados
- Identificação de Erros Não Forçados
- Estatísticas automáticas da partida
- Apoio à análise técnica por parte dos treinadores

Este módulo constitui um dos principais fatores diferenciadores do projeto e representa uma evolução futura da plataforma.

---

# 🧪 Testes

O desenvolvimento do backend tem sido acompanhado por testes funcionais realizados através da documentação Swagger.

Foram validados, entre outros, os seguintes cenários:

- Autenticação
- Autorização
- CRUD de Utilizadores
- CRUD de Clubes
- CRUD de Sócios
- CRUD de Campos
- CRUD de Reservas
- Validação de conflitos de reservas
- Cancelamento de reservas
- Cálculo automático do preço
- Validação das regras de negócio

---

# 📦 Versionamento

O projeto segue uma estratégia de versionamento incremental, acompanhando a evolução dos módulos implementados.

| Versão | Principais funcionalidades |
|---------|----------------------------|
| v0.1.x | Estrutura inicial do projeto |
| v0.2.x | Autenticação e Autorização |
| v0.3.x | Gestão de Utilizadores |
| v0.4.x | Gestão de Clubes |
| v0.5.x | Gestão de Sócios |
| v0.6.x | Gestão de Campos |
| v0.7.x | Gestão de Reservas |

As próximas versões serão dedicadas aos restantes módulos da plataforma e ao desenvolvimento do frontend.

---

# 👨‍💻 Autor

**Marco Oliveira**

Projeto Final de Licenciatura

**Universidade Atlântica**

2026

---

# 📄 Licença

Este projeto foi desenvolvido exclusivamente para fins académicos, no âmbito do Projeto Final de Licenciatura da Universidade Atlântica.

Todos os direitos reservados © 2026 Marco Oliveira.

---