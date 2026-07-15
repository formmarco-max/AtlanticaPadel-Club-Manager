# Software Architecture

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

A arquitetura do **AtlanticaPadel Club Manager (APCM)** foi concebida com o objetivo de garantir uma solução modular, escalável e de fácil manutenção.

A separação clara entre apresentação, lógica de negócio e persistência de dados permite reduzir o acoplamento entre componentes, facilitando futuras evoluções da plataforma.

A arquitetura proposta suporta integralmente o **APCM Core** e encontra-se preparada para a integração de novos módulos, como aplicações móveis, Business Intelligence e Inteligência Artificial.

---

# 2. Objetivos da Arquitetura

A arquitetura da aplicação deverá garantir:

- Separação de responsabilidades;
- Modularidade;
- Escalabilidade;
- Facilidade de manutenção;
- Reutilização de código;
- Segurança;
- Elevado desempenho;
- Facilidade de integração com novos serviços.

---

# 3. Arquitetura Geral

O APCM segue uma arquitetura cliente-servidor baseada em quatro camadas principais:

```text
+-----------------------------------------------------------+
|                    Cliente (Browser)                      |
+---------------------------▲-------------------------------+
                            │ HTTPS
                            │
+---------------------------┴-------------------------------+
|                 Frontend (Next.js + React)                |
+---------------------------▲-------------------------------+
                            │ REST API
                            │
+---------------------------┴-------------------------------+
|                  Backend (NestJS)                         |
|-----------------------------------------------------------|
| Auth Module                                               |
| Members Module                                            |
| Coaches Module                                            |
| Courts Module                                             |
| Reservations Module                                       |
| Lessons Module                                            |
| Users Module                                              |
+---------------------------▲-------------------------------+
                            │ Prisma ORM
                            │
+---------------------------┴-------------------------------+
|                    PostgreSQL Database                    |
+-----------------------------------------------------------+
```

---

# 4. Camadas da Aplicação

## Frontend

O frontend será desenvolvido com **Next.js** e **React**, proporcionando uma interface moderna, rápida e responsiva.

Principais responsabilidades:

- Interface do utilizador;
- Validação básica de formulários;
- Navegação;
- Comunicação com a API;
- Gestão da sessão do utilizador.

---

## Backend

O backend será desenvolvido em **NestJS**, responsável pela lógica de negócio.

Principais responsabilidades:

- Autenticação;
- Autorização;
- Regras de negócio;
- Validação de dados;
- Comunicação com a base de dados;
- Exposição da API REST.

---

## Persistência de Dados

A persistência será assegurada por **PostgreSQL**, utilizando o **Prisma ORM**.

O Prisma será responsável por:

- mapear entidades para tabelas;
- executar consultas SQL;
- gerir migrações;
- garantir integridade dos dados.

---

# 5. Módulos do Backend

O backend será organizado em módulos independentes.

```text
Backend

├── Auth
├── Users
├── Members
├── Coaches
├── Courts
├── Reservations
├── Lessons
└── Dashboard
```

Cada módulo possuirá:

- Controller;
- Service;
- DTOs;
- Entity/Model;
- Validação.

Esta organização facilita a manutenção e a evolução da aplicação.

---

# 6. Fluxo de Comunicação

A comunicação entre os componentes seguirá o seguinte fluxo:

```text
Utilizador

↓

Frontend (Next.js)

↓

REST API

↓

NestJS

↓

Prisma ORM

↓

PostgreSQL
```

Todas as operações de leitura e escrita serão efetuadas exclusivamente através da API.

O frontend nunca comunicará diretamente com a base de dados.

---

# 7. Segurança

A arquitetura contempla mecanismos básicos de segurança:

- autenticação por utilizador;
- autorização baseada em perfis (Role-Based Access Control);
- armazenamento seguro das palavras-passe através de hash;
- validação dos dados recebidos pela API;
- comunicação através de HTTPS em ambiente de produção.

---

# 8. Escalabilidade

A arquitetura foi concebida para suportar futuras evoluções, incluindo:

- aplicação móvel (APCM Mobile);
- módulo de Business Intelligence (APCM Analytics);
- módulo de Inteligência Artificial (APCM AI);
- pagamentos online;
- notificações.

A introdução destes módulos não exigirá alterações significativas ao núcleo do sistema.

---

# 9. Tecnologias Utilizadas

| Camada | Tecnologia |
|----------|------------|
| Frontend | Next.js |
| Interface | React |
| Estilos | Tailwind CSS |
| Backend | NestJS |
| ORM | Prisma |
| Base de Dados | PostgreSQL |
| Controlo de Versões | Git + GitHub |
| IDE | Visual Studio Code |

---

# 10. Diagrama de Arquitetura

Será elaborado um diagrama representando:

- Cliente Web;
- Frontend;
- Backend;
- Base de Dados;
- Futuros serviços externos.

O diagrama será produzido em **diagrams.net** e incluído posteriormente nesta secção.

---

# 11. Benefícios da Arquitetura

A arquitetura adotada apresenta as seguintes vantagens:

- reduz o acoplamento entre componentes;
- facilita a manutenção;
- melhora a organização do código;
- permite reutilização de funcionalidades;
- simplifica a implementação de novos módulos;
- suporta futuras integrações.

---

# 12. Considerações Finais

A arquitetura definida para o APCM privilegia a simplicidade, a organização e a escalabilidade.

A utilização de tecnologias modernas como Next.js, NestJS, Prisma e PostgreSQL permite desenvolver uma solução robusta e preparada para evoluções futuras, mantendo uma estrutura adequada à dimensão do projeto e aos objetivos do APCM Core.