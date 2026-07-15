# Wireframes

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

## 1. Introdução

O presente documento descreve os wireframes do **AtlanticaPadel Club Manager (APCM)**.

Os wireframes constituem representações simplificadas das interfaces da aplicação e têm como principal objetivo validar a organização dos conteúdos, a hierarquia visual, a navegação e a disposição das funcionalidades antes da implementação.

Nesta fase, não são definidas em detalhe as cores, tipografia ou elementos gráficos finais. Esses aspetos serão documentados posteriormente no Design System.

Os wireframes apresentados correspondem aos principais ecrãs do **APCM Core**, dando prioridade às funcionalidades essenciais do Produto Mínimo Viável.

---

## 2. Objetivos dos Wireframes

Os wireframes têm como objetivos:

- validar a estrutura das páginas;
- identificar os principais componentes da interface;
- definir a hierarquia da informação;
- reduzir alterações durante a implementação;
- apoiar o desenvolvimento do frontend;
- garantir consistência entre os diferentes módulos;
- facilitar a recolha de feedback;
- produzir material visual para o relatório final.

---

## 3. Princípios Gerais da Interface

A interface do APCM deverá respeitar os seguintes princípios:

- simplicidade;
- consistência;
- facilidade de navegação;
- rapidez de utilização;
- legibilidade;
- feedback visual claro;
- adaptação a diferentes resoluções;
- redução do número de passos necessários para executar tarefas frequentes.

A aplicação deverá apresentar uma estrutura semelhante a uma plataforma SaaS moderna, com:

- barra lateral de navegação;
- cabeçalho superior;
- área principal de conteúdo;
- cartões de indicadores;
- tabelas de dados;
- formulários;
- modais de confirmação;
- mensagens de sucesso e erro.

---

## 4. Estrutura Geral da Área Autenticada

A área autenticada será composta por três zonas principais:

```text
+---------------------------------------------------------------+
| Cabeçalho: título da página, pesquisa, notificações e perfil  |
+----------------------+----------------------------------------+
|                      |                                        |
| Barra lateral        | Área principal de conteúdo             |
|                      |                                        |
| - Dashboard          |                                        |
| - Reservas           |                                        |
| - Sócios             |                                        |
| - Treinadores        |                                        |
| - Campos             |                                        |
| - Aulas              |                                        |
| - Utilizadores       |                                        |
| - Definições         |                                        |
|                      |                                        |
+----------------------+----------------------------------------+
```

### Barra lateral

A barra lateral deverá incluir:

- logótipo APCM;
- Dashboard;
- Reservas;
- Sócios;
- Treinadores;
- Campos;
- Aulas;
- Utilizadores;
- Definições;
- opção para terminar sessão.

### Cabeçalho

O cabeçalho deverá incluir:

- nome da página atual;
- pesquisa global, numa fase futura;
- notificações, numa fase futura;
- nome e avatar do utilizador autenticado;
- acesso ao perfil.

---

## 5. Wireframe — Login

### Objetivo

Permitir a autenticação dos utilizadores.

### Componentes

- logótipo APCM;
- slogan;
- campo de correio eletrónico;
- campo de palavra-passe;
- opção para mostrar ou ocultar palavra-passe;
- botão “Iniciar sessão”;
- ligação “Recuperar palavra-passe”;
- mensagem de erro de autenticação.

### Estrutura

```text
+---------------------------------------------------------------+
|                                                               |
|                    AtlanticaPadel Club Manager                 |
|                   Simplifying Padel Club Management            |
|                                                               |
|                    +-----------------------+                   |
|                    | Correio eletrónico    |                   |
|                    +-----------------------+                   |
|                    | Palavra-passe         |                   |
|                    +-----------------------+                   |
|                    | [ Iniciar sessão ]    |                   |
|                    +-----------------------+                   |
|                                                               |
|                    Recuperar palavra-passe                     |
|                                                               |
+---------------------------------------------------------------+
```

### Rota

```text
/login
```

### Prioridade

Alta.

---

## 6. Wireframe — Dashboard

### Objetivo

Apresentar uma visão global da atividade da academia.

### Componentes

- cartões de indicadores;
- reservas do dia;
- aulas agendadas;
- ocupação dos campos;
- número total de sócios;
- número total de treinadores;
- agenda resumida;
- ações rápidas;
- gráfico simples de ocupação, opcional.

### Estrutura

```text
+---------------------------------------------------------------+
| Dashboard                                   Utilizador ▼       |
+----------------------+----------------------------------------+
| Barra lateral        | [ Sócios ] [ Reservas ] [ Aulas ]     |
|                      | [ Campos ] [ Treinadores ]              |
| Dashboard            |                                        |
| Reservas             | +------------------------------------+ |
| Sócios               | | Reservas do dia                    | |
| Treinadores          | | 09:00 Campo 1 — João Silva         | |
| Campos               | | 10:30 Campo 2 — Ana Costa          | |
| Aulas                | +------------------------------------+ |
| Utilizadores         |                                        |
| Definições           | +------------------------------------+ |
|                      | | Estado dos Campos                  | |
|                      | | Campo 1: Ocupado                   | |
|                      | | Campo 2: Disponível                | |
|                      | +------------------------------------+ |
+----------------------+----------------------------------------+
```

### Ações rápidas

- Nova reserva;
- Novo sócio;
- Nova aula;
- Consultar calendário.

### Rota

```text
/dashboard
```

### Prioridade

Alta.

---

## 7. Wireframe — Calendário de Reservas

### Objetivo

Permitir consultar rapidamente a ocupação dos campos e criar novas reservas.

### Componentes

- seletor de data;
- navegação entre dias ou semanas;
- filtros por campo;
- grelha horária;
- indicação visual de disponibilidade;
- reservas existentes;
- botão “Nova Reserva”;
- legenda de estados.

### Estrutura

```text
+---------------------------------------------------------------+
| Reservas                        [ Nova Reserva ]               |
+----------------------+----------------------------------------+
| Barra lateral        | Data: [ 15 Julho 2026 ]                |
|                      | Campo: [ Todos ▼ ]                      |
|                      |                                        |
|                      | Hora   Campo 1   Campo 2   Campo 3      |
|                      | 09:00  Ocupado   Livre     Livre        |
|                      | 10:00  Livre     Ocupado   Livre        |
|                      | 11:00  Livre     Livre     Ocupado      |
|                      | 12:00  Ocupado   Livre     Livre        |
|                      |                                        |
+----------------------+----------------------------------------+
```

### Interação principal

Ao selecionar um horário livre, o utilizador deverá ser direcionado para o formulário de criação de reserva com o campo, a data e a hora previamente preenchidos.

### Rota

```text
/reservations/calendar
```

### Prioridade

Alta.

---

## 8. Wireframe — Nova Reserva

### Objetivo

Permitir criar uma nova reserva de campo.

### Componentes

- campo;
- sócio;
- data;
- hora de início;
- hora de fim;
- estado da reserva;
- observações;
- preço estimado, opcional;
- botão “Guardar”;
- botão “Cancelar”.

### Estrutura

```text
+---------------------------------------------------------------+
| Nova Reserva                                                  |
+----------------------+----------------------------------------+
| Barra lateral        | Campo:       [ Campo 1 ▼ ]             |
|                      | Sócio:       [ Pesquisar sócio... ]     |
|                      | Data:        [ 15/07/2026 ]             |
|                      | Hora início: [ 10:00 ]                  |
|                      | Hora fim:    [ 11:30 ]                  |
|                      | Estado:      [ Confirmada ▼ ]           |
|                      | Observações: [                      ]    |
|                      |                                        |
|                      | [ Cancelar ]      [ Guardar Reserva ]   |
+----------------------+----------------------------------------+
```

### Validações

- campo obrigatório;
- sócio obrigatório;
- data obrigatória;
- hora de início inferior à hora de fim;
- ausência de sobreposição com outras reservas;
- campo ativo e disponível.

### Rota

```text
/reservations/new
```

### Prioridade

Alta.

---

## 9. Wireframe — Lista de Sócios

### Objetivo

Permitir consultar, pesquisar e gerir os sócios da academia.

### Componentes

- campo de pesquisa;
- filtros por estado;
- tabela de sócios;
- botão “Novo Sócio”;
- ações de consulta, edição e desativação;
- paginação, numa fase futura.

### Estrutura

```text
+---------------------------------------------------------------+
| Sócios                              [ Novo Sócio ]             |
+----------------------+----------------------------------------+
| Barra lateral        | Pesquisar: [ Nome ou email... ]        |
|                      | Estado:    [ Todos ▼ ]                  |
|                      |                                        |
|                      | Nome       Email       Estado   Ações   |
|                      | João Silva joao@...    Ativo    Ver     |
|                      | Ana Costa  ana@...     Ativo    Ver     |
|                      | Rui Santos rui@...     Inativo  Ver     |
+----------------------+----------------------------------------+
```

### Rota

```text
/members
```

### Prioridade

Alta.

---

## 10. Wireframe — Novo Sócio

### Objetivo

Permitir registar um novo sócio.

### Componentes

- nome;
- correio eletrónico;
- telefone;
- data de nascimento, opcional;
- número de sócio;
- data de adesão;
- estado;
- observações;
- botão “Guardar”;
- botão “Cancelar”.

### Estrutura

```text
+---------------------------------------------------------------+
| Novo Sócio                                                    |
+----------------------+----------------------------------------+
| Barra lateral        | Nome:             [                ]   |
|                      | Email:            [                ]   |
|                      | Telefone:         [                ]   |
|                      | Número de sócio:  [                ]   |
|                      | Data de adesão:   [                ]   |
|                      | Estado:           [ Ativo ▼ ]          |
|                      | Observações:      [                ]   |
|                      |                                        |
|                      | [ Cancelar ]          [ Guardar ]       |
+----------------------+----------------------------------------+
```

### Rota

```text
/members/new
```

### Prioridade

Alta.

---

## 11. Wireframe — Lista de Treinadores

### Objetivo

Permitir consultar e gerir os treinadores da academia.

### Componentes

- pesquisa;
- filtros por estado;
- tabela de treinadores;
- especialidade;
- certificação;
- disponibilidade;
- botão “Novo Treinador”;
- acesso ao perfil e agenda.

### Estrutura

```text
+---------------------------------------------------------------+
| Treinadores                       [ Novo Treinador ]           |
+----------------------+----------------------------------------+
| Barra lateral        | Pesquisar: [ Nome... ]                 |
|                      |                                        |
|                      | Nome      Especialidade Estado Ações    |
|                      | Pedro     Iniciação     Ativo  Agenda   |
|                      | Marta     Competição    Ativo  Agenda   |
|                      | Luís      Formação      Inativo Ver     |
+----------------------+----------------------------------------+
```

### Rota

```text
/coaches
```

### Prioridade

Alta.

---

## 12. Wireframe — Lista de Campos

### Objetivo

Permitir consultar e gerir os campos da academia.

### Componentes

- cartões ou tabela de campos;
- nome do campo;
- tipo;
- localização;
- estado;
- disponibilidade atual;
- botão “Novo Campo”;
- acesso ao detalhe;
- ação para editar estado.

### Estrutura

```text
+---------------------------------------------------------------+
| Campos                              [ Novo Campo ]             |
+----------------------+----------------------------------------+
| Barra lateral        | +-------------+ +-------------+        |
|                      | | Campo 1     | | Campo 2     |        |
|                      | | Indoor      | | Outdoor     |        |
|                      | | Disponível  | | Ocupado     |        |
|                      | | [ Ver ]     | | [ Ver ]     |        |
|                      | +-------------+ +-------------+        |
|                      |                                        |
|                      | +-------------+                         |
|                      | | Campo 3     |                         |
|                      | | Indoor      |                         |
|                      | | Manutenção  |                         |
|                      | | [ Ver ]     |                         |
|                      | +-------------+                         |
+----------------------+----------------------------------------+
```

### Rota

```text
/courts
```

### Prioridade

Alta.

---

## 13. Wireframe — Lista de Aulas

### Objetivo

Permitir consultar e gerir as aulas da academia.

### Componentes

- pesquisa;
- filtro por treinador;
- filtro por data;
- tabela de aulas;
- número de participantes;
- capacidade;
- botão “Nova Aula”;
- acesso ao detalhe.

### Estrutura

```text
+---------------------------------------------------------------+
| Aulas                               [ Nova Aula ]              |
+----------------------+----------------------------------------+
| Barra lateral        | Data: [ Todas ▼ ]                      |
|                      | Treinador: [ Todos ▼ ]                  |
|                      |                                        |
|                      | Aula     Treinador Data  Vagas Ações    |
|                      | Iniciação Pedro  15/07  3/4   Ver       |
|                      | Grupo B   Marta  15/07  4/6   Ver       |
|                      | Individual Luís 16/07  1/1   Ver       |
+----------------------+----------------------------------------+
```

### Rota

```text
/lessons
```

### Prioridade

Alta.

---

## 14. Wireframe — Nova Aula

### Objetivo

Permitir criar uma nova aula.

### Componentes

- designação;
- tipo de aula;
- treinador;
- campo;
- data;
- hora de início;
- hora de fim;
- capacidade máxima;
- estado;
- observações;
- botões de guardar e cancelar.

### Estrutura

```text
+---------------------------------------------------------------+
| Nova Aula                                                     |
+----------------------+----------------------------------------+
| Barra lateral        | Designação:       [               ]    |
|                      | Tipo:             [ Grupo ▼ ]          |
|                      | Treinador:        [ Pedro ▼ ]          |
|                      | Campo:            [ Campo 1 ▼ ]        |
|                      | Data:             [ 15/07/2026 ]       |
|                      | Hora de início:   [ 18:00 ]            |
|                      | Hora de fim:      [ 19:00 ]            |
|                      | Capacidade:       [ 4 ]                |
|                      | Estado:           [ Agendada ▼ ]       |
|                      |                                        |
|                      | [ Cancelar ]          [ Guardar ]       |
+----------------------+----------------------------------------+
```

### Validações

- treinador obrigatório;
- campo obrigatório;
- data e horário válidos;
- ausência de conflito de campo;
- ausência de conflito de treinador;
- capacidade superior a zero.

### Rota

```text
/lessons/new
```

### Prioridade

Média.

---

## 15. Wireframe — Agenda do Treinador

### Objetivo

Permitir ao treinador consultar as aulas que lhe estão atribuídas.

### Componentes

- calendário semanal;
- lista de aulas;
- data e horário;
- campo;
- número de participantes;
- acesso aos detalhes da aula.

### Estrutura

```text
+---------------------------------------------------------------+
| A Minha Agenda                                                |
+----------------------+----------------------------------------+
| Menu do treinador    | Segunda   Terça   Quarta   Quinta      |
|                      |                                        |
| Minha Agenda         | 10:00            Aula Grupo B          |
| Minhas Aulas         | Campo 1           Campo 2              |
| Perfil               |                                        |
|                      | 18:00   Aula      Aula Individual      |
|                      |         Iniciação                       |
+----------------------+----------------------------------------+
```

### Rota

```text
/my-schedule
```

### Prioridade

Média.

---

## 16. Wireframe — Perfil do Utilizador

### Objetivo

Permitir consultar e editar os dados básicos do utilizador autenticado.

### Componentes

- fotografia ou avatar;
- nome;
- correio eletrónico;
- telefone;
- perfil de acesso;
- botão “Editar Perfil”;
- alteração de palavra-passe, numa fase futura.

### Estrutura

```text
+---------------------------------------------------------------+
| Meu Perfil                                                    |
+----------------------+----------------------------------------+
| Barra lateral        | Avatar                                 |
|                      | Nome: Marco Silva                       |
|                      | Email: marco@email.pt                   |
|                      | Perfil: Administrador                   |
|                      | Telefone: 900 000 000                   |
|                      |                                        |
|                      | [ Editar Perfil ]                       |
+----------------------+----------------------------------------+
```

### Rota

```text
/profile
```

### Prioridade

Média.

---

## 17. Componentes Comuns

Os seguintes componentes deverão ser reutilizados em toda a aplicação:

### Navegação

- barra lateral;
- cabeçalho;
- breadcrumb, quando necessário;
- menu de utilizador.

### Formulários

- campos de texto;
- listas de seleção;
- campos de data e hora;
- caixas de texto multilinha;
- botões de guardar e cancelar;
- mensagens de validação.

### Apresentação de dados

- tabelas;
- cartões;
- estados visuais;
- etiquetas;
- filtros;
- pesquisa.

### Feedback

- mensagem de sucesso;
- mensagem de erro;
- confirmação de eliminação;
- confirmação de cancelamento;
- estado de carregamento;
- estado vazio.

---

## 18. Estados da Interface

Cada página deverá prever os seguintes estados:

### Carregamento

Apresentado enquanto os dados estão a ser obtidos.

### Sucesso

Apresentado após uma operação concluída corretamente.

### Erro

Apresentado quando ocorre uma falha.

### Estado vazio

Apresentado quando não existem dados para mostrar.

### Sem permissões

Apresentado quando o utilizador tenta aceder a uma funcionalidade não autorizada.

### Sem resultados

Apresentado quando uma pesquisa não devolve resultados.

---

## 19. Responsividade

A aplicação será prioritariamente desenhada para utilização em computadores, uma vez que os principais utilizadores do APCM Core serão administradores e rececionistas.

Ainda assim, a interface deverá adaptar-se a:

- computadores de secretária;
- computadores portáteis;
- tablets;
- dispositivos móveis, de forma simplificada.

Em resoluções reduzidas, a barra lateral poderá ser substituída por um menu recolhível.

---

## 20. Prioridade dos Wireframes

### Prioridade Alta

- Login;
- Dashboard;
- Calendário de Reservas;
- Nova Reserva;
- Lista de Sócios;
- Novo Sócio;
- Lista de Treinadores;
- Lista de Campos;
- Lista de Aulas.

### Prioridade Média

- Nova Aula;
- Agenda do Treinador;
- Perfil do Utilizador;
- páginas de detalhe e edição.

### Prioridade Baixa

- área completa do Sócio;
- recuperação de palavra-passe;
- gestão avançada de utilizadores;
- definições da academia.

---

## 21. Produção dos Wireframes Visuais

Os wireframes visuais serão produzidos numa ferramenta de prototipagem, preferencialmente:

- Figma; ou
- diagrams.net.

Para o APCM, recomenda-se a utilização do **Figma**, por permitir:

- criação de componentes reutilizáveis;
- organização de múltiplos ecrãs;
- simulação de navegação;
- exportação de imagens;
- evolução dos wireframes para protótipos de alta fidelidade.

Os wireframes finais deverão ser exportados e guardados em:

```text
docs/diagrams/wireframes/
```

Sugestão de nomes:

```text
WF-01_Login.png
WF-02_Dashboard.png
WF-03_ReservationCalendar.png
WF-04_NewReservation.png
WF-05_MembersList.png
WF-06_NewMember.png
WF-07_CoachesList.png
WF-08_CourtsList.png
WF-09_LessonsList.png
```

---

## 22. Relação com os Requisitos

| Wireframe | Requisitos Relacionados |
|---|---|
| Login | RF-001 a RF-004 |
| Dashboard | RF-005 a RF-008 |
| Lista e formulário de Sócios | RF-009 a RF-013 |
| Lista de Treinadores | RF-014 a RF-017 |
| Lista de Campos | RF-018 a RF-021 |
| Calendário e formulário de Reservas | RF-022 a RF-026 |
| Lista e formulário de Aulas | RF-027 a RF-030 |

---

## 23. Considerações Finais

Os wireframes definidos neste documento representam a estrutura visual e funcional prevista para os principais ecrãs do APCM Core.

A sua elaboração antes da implementação permite validar antecipadamente a organização da informação e reduzir alterações durante o desenvolvimento.

O foco inicial será colocado nas interfaces administrativas e operacionais, uma vez que estas representam o núcleo funcional da plataforma. As áreas específicas de Sócio e Treinador poderão ser desenvolvidas de forma simplificada no MVP e aprofundadas em futuras versões.