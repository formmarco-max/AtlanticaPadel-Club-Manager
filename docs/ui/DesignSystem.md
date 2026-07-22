# 🎾 Atlantica Padel Club Manager

# Design System

> **Versão:** 1.0  
> **Última atualização:** Julho 2026

---

# Índice

1. Introdução
2. Princípios
3. Design Tokens
4. Sistema de Grid
5. Breakpoints
6. Tipografia
7. Espaçamentos
8. Border Radius
9. Sombras
10. Bordas
11. Cores
12. Layout
13. Cards
14. Botões
15. Inputs
16. Tabelas
17. Badges
18. Ícones
19. Feedback Visual
20. Estados
21. Animações
22. Responsividade
23. Convenções de Desenvolvimento

---

# 1. Introdução

O Design System do APCM define as regras técnicas utilizadas para construir toda a interface da aplicação.

O objetivo consiste em garantir consistência, reutilização de componentes e facilidade de manutenção.

Todas as páginas da aplicação deverão seguir estas orientações.

---

# 2. Princípios

O desenvolvimento da interface deverá respeitar os seguintes princípios:

- Consistência
- Simplicidade
- Reutilização
- Legibilidade
- Hierarquia Visual
- Acessibilidade

Sempre que possível deverá ser reutilizado um componente existente em vez de criar um novo.

---

# 3. Design Tokens

## Fonte

Inter

## Biblioteca de Ícones

Lucide React

## Framework CSS

Tailwind CSS v4

## Componentes Base

shadcn/ui

---

# 4. Sistema de Grid

Container máximo

```text
1440px
```

Conteúdo principal

```text
max-w-7xl
```

Espaçamento horizontal

```text
24px
```

Espaçamento vertical

```text
32px
```

---

# 5. Breakpoints

| Nome | Valor |
|------|-------|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

---

# 6. Tipografia

## H1

- 36px
- Bold

## H2

- 30px
- Bold

## H3

- 24px
- SemiBold

## H4

- 20px
- SemiBold

## Body

16px

## Small

14px

---

# 7. Espaçamentos

| Token | Valor |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

---

# 8. Border Radius

| Token | Valor |
|------|-------|
| sm | 6px |
| md | 10px |
| lg | 14px |
| xl | 18px |

---

# 9. Sombras

## Small

Utilizada em:

- Inputs
- Botões

---

## Medium

Utilizada em:

- Cards
- Dropdowns

---

## Large

Utilizada em:

- Dialogs
- Modals

Evitar sombras exageradas.

---

# 10. Bordas

Espessura

```text
1px
```

Cor

Border

Radius

Conforme definido anteriormente.

---

# 11. Cores

As cores oficiais encontram-se documentadas em:

ColorPalette.md

Nenhuma cor deverá ser utilizada fora da paleta oficial.

---

# 12. Layout

## Sidebar

- largura fixa
- menu vertical
- scroll independente

---

## Header

Altura

```text
64px
```

Inclui:

- Pesquisa
- Notificações
- Perfil

---

## Conteúdo

Cada página deverá conter:

- Título
- Descrição
- Toolbar
- Conteúdo

---

# 13. Cards

Padding

```text
24px
```

Border Radius

```text
14px
```

Background

Branco

Shadow

Medium

---

# 14. Botões

Variantes suportadas

- Primary
- Secondary
- Outline
- Ghost
- Danger
- Success

Altura

```text
40px
```

Ícones

16 ou 20px

---

# 15. Inputs

Altura

```text
40px
```

Estados

- Default
- Focus
- Error
- Disabled

Todos os inputs deverão possuir label.

---

# 16. Tabelas

Características obrigatórias

- Pesquisa
- Ordenação
- Paginação
- Hover
- Estados através de badges

Ações

- Editar
- Eliminar
- Mais opções

---

# 17. Badges

Estados

- Ativo
- Inativo
- Reservado
- Cancelado
- Manutenção

Os badges deverão utilizar apenas as cores oficiais.

---

# 18. Ícones

Biblioteca

Lucide React

Tamanhos

16

20

24

Não utilizar emojis na interface.

---

# 19. Feedback Visual

Loading

- Skeleton
- Spinner

Sucesso

Toast verde

Erro

Toast vermelho

Aviso

Toast amarelo

Informação

Toast azul

---

# 20. Estados

Todos os componentes deverão suportar:

- Loading
- Disabled
- Hover
- Focus
- Active

Sempre que aplicável.

---

# 21. Animações

As animações deverão ser discretas.

Duração recomendada

```text
150ms - 250ms
```

Evitar animações excessivas.

---

# 22. Responsividade

A aplicação deverá funcionar corretamente em:

- Desktop
- Tablet
- Mobile

A Sidebar poderá ser recolhida em ecrãs pequenos.

---

# 23. Convenções de Desenvolvimento

Todos os componentes deverão:

- Ser reutilizáveis.
- Ser escritos em TypeScript.
- Utilizar Tailwind CSS.
- Utilizar componentes do shadcn/ui sempre que possível.
- Seguir a arquitetura Feature First.

Novos componentes deverão ser documentados em Components.md antes de serem reutilizados noutros módulos.

---

# Conclusão

O Design System do APCM constitui a base técnica para o desenvolvimento da interface.

A adoção consistente destas regras permitirá construir uma aplicação moderna, coerente e facilmente evolutiva, assegurando uma experiência uniforme para todos os utilizadores.
