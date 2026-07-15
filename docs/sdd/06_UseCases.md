# Use Cases

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

Os casos de uso representam as principais interações entre os diferentes perfis de utilizador e o sistema APCM.

A sua identificação permite compreender os fluxos funcionais da aplicação, servindo de base para o desenho da arquitetura, desenvolvimento da interface e implementação das funcionalidades do APCM Core.

---

# 2. Atores

Foram identificados os seguintes atores do sistema:

- Administrador
- Rececionista
- Treinador
- Sócio

Cada ator possui diferentes níveis de acesso e permissões, de acordo com as responsabilidades definidas no documento **User Roles & Personas**.

---

# 3. Diagrama de Casos de Uso

A Figura 1 apresenta o Diagrama UML de Casos de Uso do **APCM Core**, representando as principais interações entre os diferentes perfis de utilizador e a plataforma.

> **Nota:** O diagrama será elaborado na ferramenta **draw.io (diagrams.net)** e incluído posteriormente nesta secção.

---

# 4. Casos de Uso

| ID | Caso de Uso | Administrador | Rececionista | Treinador | Sócio |
|----|-------------|:-------------:|:------------:|:---------:|:-----:|
| UC-001 | Autenticar Utilizador | ✅ | ✅ | ✅ | ✅ |
| UC-002 | Consultar Dashboard | ✅ | ✅ | ❌ | ❌ |
| UC-003 | Gerir Sócios | ✅ | ✅ | ❌ | ❌ |
| UC-004 | Gerir Treinadores | ✅ | Consulta | ❌ | ❌ |
| UC-005 | Gerir Campos | ✅ | Consulta | ❌ | ❌ |
| UC-006 | Gerir Reservas | ✅ | ✅ | ❌ | Consulta |
| UC-007 | Gerir Aulas | ✅ | Consulta | Consulta | Consulta |
| UC-008 | Consultar Agenda | ❌ | ❌ | ✅ | ❌ |
| UC-009 | Consultar Perfil | ✅ | ✅ | ✅ | ✅ |
| UC-010 | Terminar Sessão | ✅ | ✅ | ✅ | ✅ |

---

# 5. Descrição dos Casos de Uso

## UC-001 — Autenticar Utilizador

### Objetivo

Permitir que um utilizador autenticado aceda ao sistema.

### Atores

- Administrador
- Rececionista
- Treinador
- Sócio

### Pré-condições

- O utilizador encontra-se registado na plataforma.

### Fluxo Principal

1. O utilizador introduz as credenciais.
2. O sistema valida a autenticação.
3. O sistema identifica o perfil do utilizador.
4. O sistema apresenta a página inicial correspondente ao perfil.

### Pós-condições

- O utilizador inicia sessão na plataforma.

---

## UC-002 — Consultar Dashboard

### Objetivo

Permitir consultar os principais indicadores operacionais da academia.

### Atores

- Administrador
- Rececionista

### Fluxo Principal

1. O utilizador inicia sessão.
2. O sistema apresenta o dashboard.
3. São apresentados os principais indicadores da academia.

---

## UC-003 — Gerir Sócios

### Objetivo

Permitir criar, editar, consultar e remover sócios.

### Atores

- Administrador
- Rececionista

### Fluxo Principal

1. Consultar lista de sócios.
2. Criar novo sócio.
3. Editar informação.
4. Remover sócio.

---

## UC-004 — Gerir Treinadores

### Objetivo

Permitir gerir a informação relativa aos treinadores.

### Atores

- Administrador

---

## UC-005 — Gerir Campos

### Objetivo

Permitir gerir os campos existentes na academia.

### Atores

- Administrador

---

## UC-006 — Gerir Reservas

### Objetivo

Permitir criar, editar e cancelar reservas.

### Atores

- Administrador
- Rececionista

### Fluxo Principal

1. Consultar disponibilidade dos campos.
2. Selecionar campo.
3. Selecionar data e horário.
4. Confirmar reserva.
5. Atualizar calendário.

---

## UC-007 — Gerir Aulas

### Objetivo

Permitir criar e gerir aulas da academia.

### Atores

- Administrador

---

## UC-008 — Consultar Agenda

### Objetivo

Permitir ao treinador consultar a sua agenda de aulas.

### Atores

- Treinador

---

## UC-009 — Consultar Perfil

### Objetivo

Permitir consultar a informação do perfil do utilizador autenticado.

### Atores

- Todos os utilizadores

---

## UC-010 — Terminar Sessão

### Objetivo

Permitir terminar a sessão do utilizador.

### Atores

- Todos os utilizadores

---

# 6. Relação entre Casos de Uso e Requisitos

| Caso de Uso | Requisitos Relacionados |
|--------------|------------------------|
| UC-001 | RF-001 a RF-004 |
| UC-002 | RF-005 a RF-008 |
| UC-003 | RF-009 a RF-013 |
| UC-004 | RF-014 a RF-017 |
| UC-005 | RF-018 a RF-021 |
| UC-006 | RF-022 a RF-026 |
| UC-007 | RF-027 a RF-030 |

---

# 7. Considerações Finais

Os casos de uso apresentados representam as principais funcionalidades do **APCM Core**, descrevendo as interações fundamentais entre os diferentes perfis de utilizador e a plataforma.

A definição destes casos de uso servirá de base para a elaboração do Diagrama UML de Casos de Uso, para o desenho dos wireframes e para a implementação das funcionalidades previstas no Produto Mínimo Viável (MVP).