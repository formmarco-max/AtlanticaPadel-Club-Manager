# 🎾 Atlantica Padel Club Manager

# Components

> **Versão:** 1.0  
> **Última atualização:** Julho 2026

---

# Índice

1. Introdução
2. Princípios
3. Estrutura
4. Layout
5. Navegação
6. Botões
7. Cards
8. Tabelas
9. Formulários
10. Feedback
11. Estados Vazios
12. Componentes Específicos do APCM
13. Convenções

---

# 1. Introdução

Este documento descreve todos os componentes reutilizáveis utilizados na interface do APCM.

Todos os novos módulos deverão reutilizar estes componentes sempre que possível.

Evitar a criação de componentes duplicados.

---

# 2. Princípios

Todos os componentes deverão ser:

- Reutilizáveis
- Independentes
- Fortemente tipados
- Responsivos
- Consistentes

Tecnologias:

- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

# 3. Estrutura

Os componentes encontram-se organizados da seguinte forma:

```text
components/
    common/
    layout/
    ui/

features/
    members/
    coaches/
    courts/
    reservations/
```

---

# 4. Componentes de Layout

## AppLayout

Responsável pela estrutura geral da aplicação.

Inclui:

- Sidebar
- Header
- Área de Conteúdo

---

## Sidebar

Responsável pela navegação principal.

Características:

- Menu lateral
- Ícones Lucide
- Item ativo destacado
- Responsiva

---

## Header

Responsável pela barra superior.

Inclui:

- Pesquisa
- Notificações
- Perfil

---

## PageHeader

Apresenta:

- Título
- Descrição
- Ações principais

Exemplo:

```
Sócios

Gerir todos os sócios do clube.

[Novo Sócio]
```

---

# 5. Navegação

## Breadcrumb (Futuro)

Permite indicar a localização atual.

Exemplo:

Dashboard

>

Sócios

>

Editar

---

# 6. Botões

Variantes

- Primary
- Secondary
- Outline
- Ghost
- Danger

Todos os botões deverão utilizar o componente Button do shadcn/ui.

---

# 7. Cards

## Card

Container base.

Utilizado em:

- Dashboard
- Formulários

---

## StatCard

Apresenta KPIs.

Exemplo:

127

Sócios

↑ 12 este mês

---

## InfoCard

Apresenta informação resumida.

---

# 8. Tabelas

## DataTable

Tabela reutilizável baseada em TanStack Table.

Funcionalidades:

- Pesquisa
- Ordenação
- Paginação
- Ações
- Loading
- Estado vazio

Será utilizada em:

- Sócios
- Treinadores
- Campos
- Reservas

---

## SearchInput

Campo de pesquisa reutilizável.

---

## Toolbar

Agrupa:

- Pesquisa
- Refresh
- Novo

---

## StatusBadge

Representa estados.

Exemplos:

Ativo

Inativo

Reservado

Cancelado

---

# 9. Formulários

Todos os formulários deverão utilizar:

React Hook Form

+

Zod

Componentes:

Input

Textarea

Select

DatePicker

Switch

Checkbox

Dialog

---

# 10. Feedback

## Toast

Tipos

Success

Warning

Error

Info

Biblioteca

Sonner

---

## LoadingSkeleton

Apresentado durante carregamentos.

---

## Spinner

Utilizado apenas quando necessário.

---

# 11. Estados Vazios

## EmptyState

Utilizado quando não existem dados.

Exemplo

Nenhum sócio encontrado.

[Adicionar Sócio]

---

# 12. Componentes Específicos do APCM

## CourtStatus

Estado do campo.

Livre

Reservado

Manutenção

---

## ReservationCard

Resumo de uma reserva.

---

## CoachCard

Resumo de treinador.

---

## MemberAvatar

Avatar com iniciais.

---

## Dashboard KPI

Componente específico para indicadores.

---

# 13. Convenções

Todos os componentes deverão:

- possuir uma única responsabilidade;
- aceitar propriedades bem definidas;
- evitar lógica de negócio;
- reutilizar componentes existentes;
- ser documentados neste ficheiro.

Sempre que um novo componente reutilizável for criado, este documento deverá ser atualizado.