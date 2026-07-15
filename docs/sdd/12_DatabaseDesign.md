# Database Design

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

O presente documento descreve o modelo de dados do **AtlanticaPadel Club Manager (APCM)**.

A base de dados foi concebida para suportar todas as funcionalidades previstas no **APCM Core**, garantindo consistência, integridade e facilidade de evolução.

O modelo apresentado será posteriormente implementado utilizando **PostgreSQL** e **Prisma ORM**.

---

# 2. Objetivos

A base de dados deverá:

- garantir integridade dos dados;
- evitar redundância;
- facilitar consultas;
- suportar futuras evoluções;
- permitir manutenção simples;
- cumprir as regras de negócio definidas anteriormente.

---

# 3. Modelo Relacional

O APCM Core será constituído pelas seguintes entidades.

| Entidade | Descrição |
|----------|-----------|
| Academy | Academia |
| User | Conta de acesso |
| Role | Perfil de acesso |
| Member | Sócio |
| Coach | Treinador |
| Court | Campo |
| Reservation | Reserva |
| Lesson | Aula |
| LessonEnrollment | Inscrição numa aula |

---

# 4. Descrição das Entidades

## Academy

Representa uma academia de pádel.

Principais atributos:

- academy_id
- name
- address
- phone
- email
- created_at

---

## Role

Representa um perfil de acesso.

Principais atributos:

- role_id
- name

Exemplos:

- Administrator
- Receptionist
- Coach
- Member

---

## User

Representa uma conta autenticada.

Principais atributos:

- user_id
- academy_id
- role_id
- name
- email
- password_hash
- active
- created_at

---

## Member

Representa um sócio da academia.

Principais atributos:

- member_id
- academy_id
- user_id (opcional)
- membership_number
- phone
- birth_date
- join_date
- active

---

## Coach

Representa um treinador.

Principais atributos:

- coach_id
- academy_id
- user_id (opcional)
- speciality
- certification
- phone
- active

---

## Court

Representa um campo.

Principais atributos:

- court_id
- academy_id
- name
- type
- status

---

## Reservation

Representa uma reserva.

Principais atributos:

- reservation_id
- member_id
- court_id
- reservation_date
- start_time
- end_time
- status

---

## Lesson

Representa uma aula.

Principais atributos:

- lesson_id
- coach_id
- court_id
- title
- lesson_date
- start_time
- end_time
- max_players
- status

---

## LessonEnrollment

Relaciona sócios com aulas.

Principais atributos:

- enrollment_id
- lesson_id
- member_id
- enrollment_date
- attendance

---

# 5. Relações

## Academy

Possui:

- vários Users
- vários Members
- vários Coaches
- vários Courts

---

## Role

Possui vários Users.

---

## User

Pode estar associado a:

- um Member

ou

- um Coach

---

## Member

Pode possuir:

- várias Reservations
- várias LessonEnrollments

---

## Coach

Pode orientar:

- várias Lessons

---

## Court

Pode possuir:

- várias Reservations
- várias Lessons

---

## Lesson

Possui:

- um Coach
- um Court
- várias inscrições

---

# 6. Regras de Integridade

A base de dados deverá garantir:

- email único para utilizadores;
- ausência de reservas sobrepostas para o mesmo campo;
- aulas sem conflitos de horário;
- eliminação controlada através de estados ativos/inativos;
- utilização de chaves estrangeiras em todas as relações.

---

# 7. Normalização

O modelo foi concebido respeitando os princípios da Terceira Forma Normal (3FN), reduzindo redundâncias e facilitando a manutenção dos dados.

---

# 8. Índices

Serão criados índices para:

- email
- reservation_date
- lesson_date
- membership_number

de forma a melhorar o desempenho das pesquisas.

---

# 9. Diagrama Entidade-Relacionamento (ERD)

Será desenvolvido um diagrama ERD representando todas as entidades e respetivas relações.

A versão final será produzida em diagrams.net e incluída nesta secção.

---

# 10. Evolução Futura

O modelo encontra-se preparado para integrar novas entidades, nomeadamente:

- Payment
- Tournament
- Notification
- MatchAnalysis
- MembershipPlan

Estas entidades não fazem parte do APCM Core.

---

# 11. Considerações Finais

O modelo relacional apresentado constitui a base da persistência de dados do APCM.

A sua estrutura modular facilita a implementação utilizando PostgreSQL e Prisma ORM, garantindo simultaneamente consistência, desempenho e capacidade de evolução futura.