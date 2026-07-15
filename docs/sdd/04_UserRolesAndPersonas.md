# User Roles & Personas

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

O AtlanticaPadel Club Manager (APCM) foi desenvolvido para suportar diferentes perfis de utilizador, cada um com responsabilidades, necessidades e níveis de acesso distintos.

A definição destes perfis permite compreender melhor os requisitos funcionais da aplicação e constitui a base para a implementação do sistema de autenticação e autorização.

Foram identificados cinco perfis de utilizador que representam os diferentes intervenientes na operação de uma academia de pádel. Nesta primeira versão (**APCM Core**), serão implementados apenas os perfis considerados essenciais ao Produto Mínimo Viável (MVP), mantendo-se a arquitetura preparada para suportar novos perfis em futuras evoluções.

---

# 2. Administrador

## Descrição

O Administrador é responsável pela gestão global da academia.

Possui acesso total à plataforma e é responsável pela configuração inicial do sistema, gestão dos utilizadores e supervisão da operação diária.

## Objetivos

- Gerir toda a academia;
- Configurar o sistema;
- Gerir utilizadores;
- Acompanhar indicadores de desempenho.

## Principais Necessidades

- Acesso rápido à informação;
- Dashboard com indicadores;
- Controlo total da plataforma;
- Elevado nível de segurança.

## Permissões

✅ Gestão de sócios

✅ Gestão de treinadores

✅ Gestão de campos

✅ Gestão de reservas

✅ Gestão de aulas

✅ Gestão de utilizadores

✅ Dashboard administrativo

---

# 3. Rececionista

## Descrição

O Rececionista assegura o funcionamento diário da academia, sendo responsável pelo atendimento aos clientes e pela gestão das reservas.

## Objetivos

- Efetuar reservas;
- Receber clientes;
- Consultar disponibilidade dos campos;
- Atualizar informação dos sócios.

## Principais Necessidades

- Interface simples e intuitiva;
- Rapidez na criação de reservas;
- Consulta imediata da ocupação dos campos.

## Permissões

✅ Gestão de reservas

✅ Gestão de sócios

✅ Consulta de treinadores

✅ Consulta das aulas

❌ Gestão de utilizadores

❌ Configuração do sistema

---

# 4. Treinador

## Descrição

O Treinador utiliza a plataforma para consultar a sua agenda de aulas e acompanhar a informação relativa aos alunos inscritos.

## Objetivos

- Consultar horários;
- Consultar aulas;
- Acompanhar os seus alunos.

## Principais Necessidades

- Agenda organizada;
- Consulta rápida das aulas;
- Informação dos participantes.

## Permissões

✅ Consulta da agenda

✅ Consulta das aulas

✅ Consulta dos alunos inscritos

❌ Gestão de reservas

❌ Gestão administrativa

---

# 5. Sócio

## Descrição

O Sócio representa o cliente da academia.

Na versão APCM Core, o seu acesso será limitado às funcionalidades relacionadas com a sua atividade na academia, estando prevista uma evolução futura através do módulo **APCM Mobile**.

## Objetivos

- Consultar reservas;
- Consultar aulas;
- Atualizar dados pessoais.

## Principais Necessidades

- Interface intuitiva;
- Rapidez de utilização;
- Facilidade de acesso à informação.

## Permissões

✅ Consulta das próprias reservas

✅ Consulta das aulas

✅ Consulta do perfil

❌ Gestão da academia

❌ Dashboard administrativo

---

# 6. Proprietário da Academia (Owner)

## Descrição

O Proprietário representa o responsável máximo pela academia.

Embora possa acumular funções de gestão em academias de pequena dimensão, este perfil destina-se sobretudo a academias de média dimensão, onde o proprietário pretende acompanhar o desempenho do negócio sem participar diretamente na operação diária.

Este perfil **não será implementado na versão APCM Core**, ficando previsto para uma futura evolução da plataforma.

## Objetivos

- Acompanhar o desempenho da academia;
- Consultar indicadores financeiros;
- Analisar taxas de ocupação;
- Apoiar a tomada de decisão.

## Principais Necessidades

- Dashboards intuitivos;
- Indicadores de gestão;
- Relatórios periódicos;
- Informação consolidada.

## Permissões

✅ Consulta de dashboards

✅ Consulta de indicadores

✅ Consulta de relatórios

❌ Gestão operacional

❌ Gestão de reservas

❌ Gestão de sócios

**Estado:** 🟡 Future Release

---

# 7. Matriz de Permissões

| Funcionalidade | Administrador | Proprietário | Rececionista | Treinador | Sócio |
|---------------|:-------------:|:------------:|:------------:|:---------:|:-----:|
| Dashboard | ✅ | ✅ | ✅ | ❌ | ❌ |
| Indicadores | ✅ | ✅ | ❌ | ❌ | ❌ |
| Gestão de Sócios | ✅ | ❌ | ✅ | ❌ | ❌ |
| Gestão de Treinadores | ✅ | ❌ | Consulta | ❌ | ❌ |
| Gestão de Campos | ✅ | ❌ | Consulta | ❌ | ❌ |
| Gestão de Reservas | ✅ | ❌ | ✅ | ❌ | Consulta |
| Gestão de Aulas | ✅ | ❌ | Consulta | Consulta | Consulta |
| Gestão de Utilizadores | ✅ | ❌ | ❌ | ❌ | ❌ |

---

# 8. Considerações Finais

A definição clara dos perfis de utilizador constitui um elemento fundamental para a arquitetura da plataforma, permitindo implementar mecanismos de autenticação e autorização adequados às responsabilidades de cada utilizador.

A separação de permissões contribui igualmente para aumentar a segurança da aplicação, garantindo que cada perfil apenas acede às funcionalidades necessárias ao desempenho das suas funções.

A arquitetura do APCM foi concebida para permitir a introdução de novos perfis de utilizador no futuro, sem necessidade de alterações significativas ao núcleo da aplicação (**APCM Core**), reforçando a sua escalabilidade e capacidade de evolução.