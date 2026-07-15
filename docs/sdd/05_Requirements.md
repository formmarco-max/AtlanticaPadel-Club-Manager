# Software Requirements Specification

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

O presente documento define os requisitos funcionais e não funcionais do **AtlanticaPadel Club Manager (APCM)**.

Os requisitos aqui apresentados correspondem ao âmbito funcional do **APCM Core**, representando o Produto Mínimo Viável (MVP) da plataforma.

A definição destes requisitos constitui a base para o desenho da arquitetura, desenvolvimento da aplicação e elaboração dos casos de uso.

---

# 2. Requisitos Funcionais

## 2.1 Autenticação

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-001 | O sistema deve permitir o login de utilizadores autenticados. | Alta |
| RF-002 | O sistema deve permitir terminar sessão (logout). | Alta |
| RF-003 | O sistema deve distinguir os diferentes perfis de utilizador. | Alta |
| RF-004 | O sistema deve controlar o acesso às funcionalidades de acordo com o perfil do utilizador. | Alta |

---

## 2.2 Dashboard

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-005 | O sistema deve apresentar um dashboard após autenticação. | Alta |
| RF-006 | O dashboard deve apresentar indicadores principais da academia. | Média |
| RF-007 | O dashboard deve apresentar o número de reservas do dia. | Média |
| RF-008 | O dashboard deve apresentar o número de aulas agendadas. | Média |

---

## 2.3 Gestão de Sócios

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-009 | O sistema deve permitir criar sócios. | Alta |
| RF-010 | O sistema deve permitir editar informação dos sócios. | Alta |
| RF-011 | O sistema deve permitir eliminar sócios. | Média |
| RF-012 | O sistema deve permitir consultar a lista de sócios. | Alta |
| RF-013 | O sistema deve permitir pesquisar sócios. | Média |

---

## 2.4 Gestão de Treinadores

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-014 | O sistema deve permitir criar treinadores. | Alta |
| RF-015 | O sistema deve permitir editar treinadores. | Alta |
| RF-016 | O sistema deve permitir eliminar treinadores. | Média |
| RF-017 | O sistema deve permitir consultar treinadores. | Alta |

---

## 2.5 Gestão de Campos

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-018 | O sistema deve permitir registar campos. | Alta |
| RF-019 | O sistema deve permitir editar campos. | Média |
| RF-020 | O sistema deve indicar a disponibilidade dos campos. | Alta |
| RF-021 | O sistema deve apresentar o estado de ocupação dos campos. | Alta |

---

## 2.6 Gestão de Reservas

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-022 | O sistema deve permitir criar reservas. | Alta |
| RF-023 | O sistema deve permitir editar reservas. | Alta |
| RF-024 | O sistema deve permitir cancelar reservas. | Alta |
| RF-025 | O sistema deve impedir reservas sobrepostas para o mesmo campo e horário. | Alta |
| RF-026 | O sistema deve permitir consultar todas as reservas. | Alta |

---

## 2.7 Gestão de Aulas

| ID | Requisito | Prioridade |
|----|-----------|------------|
| RF-027 | O sistema deve permitir criar aulas. | Alta |
| RF-028 | O sistema deve permitir associar um treinador à aula. | Alta |
| RF-029 | O sistema deve permitir inscrever sócios nas aulas. | Média |
| RF-030 | O sistema deve permitir consultar o calendário das aulas. | Alta |

---

# 3. Requisitos Não Funcionais

## Segurança

| ID | Requisito |
|----|-----------|
| RNF-001 | O acesso ao sistema deve ser realizado através de autenticação. |
| RNF-002 | Cada utilizador apenas poderá aceder às funcionalidades permitidas pelo seu perfil. |

---

## Usabilidade

| ID | Requisito |
|----|-----------|
| RNF-003 | A interface deverá ser intuitiva e consistente. |
| RNF-004 | A navegação deverá permitir o acesso rápido às funcionalidades principais. |

---

## Desempenho

| ID | Requisito |
|----|-----------|
| RNF-005 | O tempo médio de carregamento das páginas deverá ser inferior a 3 segundos. |
| RNF-006 | As pesquisas deverão apresentar resultados de forma imediata para volumes de dados compatíveis com o âmbito do projeto. |

---

## Escalabilidade

| ID | Requisito |
|----|-----------|
| RNF-007 | A arquitetura deverá permitir a adição de novos módulos sem impacto significativo na estrutura existente. |

---

## Manutenibilidade

| ID | Requisito |
|----|-----------|
| RNF-008 | O código deverá seguir uma arquitetura modular e organizada. |
| RNF-009 | O sistema deverá ser desenvolvido utilizando boas práticas de programação. |

---

## Compatibilidade

| ID | Requisito |
|----|-----------|
| RNF-010 | A aplicação deverá ser compatível com os principais navegadores modernos (Google Chrome, Microsoft Edge e Mozilla Firefox). |
| RNF-011 | A interface deverá adaptar-se a diferentes resoluções de ecrã (Responsive Design). |

---

# 4. Funcionalidades Fora do Âmbito (APCM Core)

As seguintes funcionalidades fazem parte da visão futura da plataforma, não sendo implementadas nesta versão:

- Aplicação móvel (APCM Mobile);
- Pagamentos online;
- Notificações Push;
- Integração com sistemas de faturação;
- Gestão de torneios;
- Business Intelligence avançado (APCM Analytics);
- Inteligência Artificial para análise automática de jogos (APCM AI).

---

# 5. Critérios de Aceitação do MVP

O APCM Core será considerado concluído quando permitir:

- Autenticação de utilizadores;
- Gestão completa de sócios;
- Gestão completa de treinadores;
- Gestão completa de campos;
- Gestão completa de reservas;
- Gestão completa de aulas;
- Visualização de um dashboard administrativo.

---

# 6. Considerações Finais

Os requisitos definidos neste documento representam o conjunto mínimo de funcionalidades necessárias para a implementação do APCM Core.

A identificação e organização destes requisitos permitirá garantir uma implementação estruturada, facilitando simultaneamente o planeamento das sprints, a definição dos casos de uso e a validação final do sistema.