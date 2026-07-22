# 🎾 Atlantica Padel Club Manager

# Brand Guidelines

> **Versão:** 1.0  
> **Última atualização:** Julho 2026

---

# Índice

1. Introdução
2. Filosofia da Marca
3. Identidade da Marca
4. Personalidade
5. Público-Alvo
6. Logótipo
7. Paleta de Cores
8. Tipografia
9. Sistema de Espaçamentos
10. Border Radius
11. Sombras
12. Iconografia
13. Layout da Aplicação
14. Componentes
15. Dashboard
16. Tabelas
17. Formulários
18. Acessibilidade
19. Princípios de UX
20. Inspiração

---

# 1. Introdução

O presente documento define a identidade visual e os princípios de design do **Atlantica Padel Club Manager (APCM)**.

O seu objetivo é garantir consistência visual, facilidade de utilização e uniformidade em toda a plataforma, servindo como referência durante todo o desenvolvimento do projeto.

Todas as novas funcionalidades deverão respeitar as orientações definidas neste documento.

---

# 2. Filosofia da Marca

O APCM pretende oferecer uma experiência moderna e intuitiva na gestão de clubes de padel.

A plataforma deverá transmitir profissionalismo, simplicidade e confiança, reduzindo a complexidade das tarefas administrativas e permitindo que os gestores dediquem mais tempo ao funcionamento do clube.

## Missão

Simplificar a gestão diária de clubes de padel através de uma plataforma moderna, eficiente e intuitiva.

## Visão

Ser uma referência na digitalização da gestão de clubes de padel, oferecendo uma experiência simples, rápida e agradável.

## Valores

- Simplicidade
- Clareza
- Eficiência
- Fiabilidade
- Inovação
- Consistência

---

# 3. Identidade da Marca

A identidade visual do APCM inspira-se em dois conceitos principais:

- O Oceano Atlântico, representando o nome "Atlantica".
- O Padel, representando a atividade principal da plataforma.

A combinação destes elementos resulta numa imagem moderna, tecnológica e desportiva.

---

# 4. Personalidade

A aplicação deverá transmitir uma imagem:

- Moderna
- Elegante
- Tecnológica
- Organizada
- Acessível
- Profissional

Evitar um aspeto semelhante a aplicações ERP antigas.

A experiência deverá aproximar-se de aplicações SaaS modernas.

---

# 5. Público-Alvo

O APCM destina-se principalmente a:

- Gestores de clubes de padel
- Rececionistas
- Administradores
- Treinadores
- Funcionários administrativos

A interface deverá ser simples o suficiente para utilizadores sem conhecimentos técnicos.

---

# 6. Logótipo

O logótipo representa três elementos:

- AP (Atlantica Padel)
- Onda (Atlântico)
- Bola de padel

## Versões suportadas

- Principal
- Horizontal
- Vertical
- Monocromática
- Ícone
- Favicon

O logótipo deverá manter sempre uma área mínima de proteção e nunca deverá ser deformado ou alterado.

---

# 7. Paleta de Cores

## Cores Primárias

| Nome | Hex |
|------|------|
| Atlantic Blue | #0F4C81 |
| Ocean Blue | #163A5F |
| Padel Green | #2CBF5B |

## Cores de Estado

| Estado | Cor |
|---------|------|
| Success | #2CBF5B |
| Warning | #F59E0B |
| Danger | #EF4444 |
| Info | #3B82F6 |

## Neutros

| Nome | Hex |
|------|------|
| Background | #F7F9FC |
| Surface | #FFFFFF |
| Border | #E5E7EB |
| Text | #1F2937 |
| Muted | #6B7280 |

---

# 8. Tipografia

## Fonte Oficial

Inter

### Escala Tipográfica

| Elemento | Peso | Tamanho |
|-----------|------|----------|
| H1 | Bold | 36px |
| H2 | Bold | 30px |
| H3 | SemiBold | 24px |
| H4 | SemiBold | 20px |
| Body | Regular | 16px |
| Small | Regular | 14px |

---

# 9. Sistema de Espaçamentos

| Nome | Valor |
|------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |

---

# 10. Border Radius

| Nome | Valor |
|------|-------|
| Small | 6px |
| Medium | 10px |
| Large | 14px |
| Extra Large | 18px |

---

# 11. Sombras

Utilizar apenas sombras suaves.

Evitar efeitos exagerados.

As sombras deverão ser utilizadas apenas para criar hierarquia visual.

---

# 12. Iconografia

Biblioteca oficial:

- Lucide React

Tamanhos recomendados:

- 16px
- 20px
- 24px

Nunca misturar diferentes bibliotecas de ícones.

---

# 13. Layout da Aplicação

## Sidebar

- Fundo azul escuro
- Menu vertical
- Ícones Lucide
- Destaque verde para item ativo

## Header

- Fundo branco
- Pesquisa
- Notificações
- Perfil do utilizador

---

# 14. Componentes

Todos os componentes deverão ser reutilizáveis.

Componentes principais:

- Button
- Card
- DataTable
- Toolbar
- Input
- Select
- Badge
- Modal
- Dialog
- Avatar
- PageHeader
- StatCard
- StatusBadge

---

# 15. Dashboard

O Dashboard deverá privilegiar informação útil em vez de excesso de indicadores.

Estrutura recomendada:

1. Saudação ao utilizador
2. KPIs principais
3. Gráficos
4. Próximas reservas
5. Atividade recente

---

# 16. Tabelas

As tabelas deverão privilegiar a legibilidade.

Boas práticas:

- Cabeçalhos destacados
- Hover nas linhas
- Paginação
- Pesquisa
- Ordenação
- Estados através de badges

---

# 17. Formulários

Todos os formulários deverão utilizar:

- React Hook Form
- Zod
- Componentes reutilizáveis

As mensagens de erro deverão ser claras e consistentes.

---

# 18. Acessibilidade

A interface deverá respeitar princípios básicos de acessibilidade.

- Contraste adequado
- Estados de foco
- Navegação por teclado
- Mensagens de erro claras

---

# 19. Princípios de UX

Durante o desenvolvimento deverão ser respeitados os seguintes princípios:

- Simplicidade acima de complexidade.
- Consistência entre módulos.
- Redução do número de cliques.
- Utilização de componentes reutilizáveis.
- Hierarquia visual clara.
- Espaço em branco suficiente.
- Informação organizada por prioridade.

Sempre que existirem várias soluções possíveis, deverá ser escolhida aquela que proporcione uma experiência mais simples ao utilizador.

---

# 20. Inspiração

O design do APCM inspira-se em aplicações SaaS modernas reconhecidas pela qualidade da sua experiência de utilização.

Referências:

- Stripe
- Linear
- Vercel
- Notion
- GitHub
- Atlassian

O objetivo não é copiar estas plataformas, mas adotar os princípios de simplicidade, consistência e clareza que as caracterizam.

---

# Conclusão

Este documento constitui a referência oficial para todas as decisões de design do Atlantica Padel Club Manager.

Qualquer nova funcionalidade desenvolvida deverá respeitar estas orientações, garantindo uma identidade visual consistente e uma experiência de utilização uniforme ao longo de toda a plataforma.