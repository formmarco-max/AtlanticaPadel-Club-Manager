# API Design

# AtlanticaPadel Club Manager (APCM)

> **Simplifying Padel Club Management**

---

# 1. Introdução

O presente documento descreve a API REST do **AtlanticaPadel Club Manager (APCM)**.

A API constitui a camada de comunicação entre o frontend desenvolvido em Next.js e o backend desenvolvido em NestJS.

Todos os dados da aplicação serão obtidos através desta API, não existindo qualquer acesso direto do frontend à base de dados.

A API foi concebida segundo os princípios REST, utilizando métodos HTTP normalizados e recursos claramente identificados.

---

# 2. Convenções Gerais

## Base URL

```text
/api/v1
```

---

## Formato de Dados

Todos os pedidos e respostas utilizarão JSON.

---

## Autenticação

Os endpoints protegidos exigirão autenticação.

No APCM Core será utilizada autenticação baseada em JWT (JSON Web Token).

---

## Códigos HTTP

| Código | Significado |
|---------|-------------|
| 200 | Pedido executado com sucesso |
| 201 | Recurso criado |
| 400 | Pedido inválido |
| 401 | Não autenticado |
| 403 | Sem permissões |
| 404 | Recurso inexistente |
| 500 | Erro interno |

---

# 3. Estrutura da API

```text
/api/v1

├── auth
├── users
├── members
├── coaches
├── courts
├── reservations
├── lessons
└── dashboard
```

---

# 4. Auth API

## Login

```http
POST /api/v1/auth/login
```

Descrição

Autenticar utilizador.

Body

```json
{
  "email": "admin@apcm.pt",
  "password": "********"
}
```

Resposta

```json
{
  "success": true,
  "token": "...",
  "user": {}
}
```

---

## Logout

```http
POST /api/v1/auth/logout
```

---

## Perfil

```http
GET /api/v1/auth/me
```

---

# 5. Members API

## Listar Sócios

```http
GET /api/v1/members
```

---

## Consultar Sócio

```http
GET /api/v1/members/{id}
```

---

## Criar Sócio

```http
POST /api/v1/members
```

---

## Atualizar Sócio

```http
PUT /api/v1/members/{id}
```

---

## Eliminar Sócio

```http
DELETE /api/v1/members/{id}
```

---

# 6. Coaches API

## Listar Treinadores

```http
GET /api/v1/coaches
```

---

## Consultar Treinador

```http
GET /api/v1/coaches/{id}
```

---

## Criar Treinador

```http
POST /api/v1/coaches
```

---

## Atualizar Treinador

```http
PUT /api/v1/coaches/{id}
```

---

## Eliminar Treinador

```http
DELETE /api/v1/coaches/{id}
```

---

# 7. Courts API

## Listar Campos

```http
GET /api/v1/courts
```

---

## Consultar Campo

```http
GET /api/v1/courts/{id}
```

---

## Criar Campo

```http
POST /api/v1/courts
```

---

## Atualizar Campo

```http
PUT /api/v1/courts/{id}
```

---

## Eliminar Campo

```http
DELETE /api/v1/courts/{id}
```

---

# 8. Reservations API

## Listar Reservas

```http
GET /api/v1/reservations
```

---

## Consultar Reserva

```http
GET /api/v1/reservations/{id}
```

---

## Criar Reserva

```http
POST /api/v1/reservations
```

---

## Atualizar Reserva

```http
PUT /api/v1/reservations/{id}
```

---

## Cancelar Reserva

```http
DELETE /api/v1/reservations/{id}
```

---

## Calendário

```http
GET /api/v1/reservations/calendar
```

---

# 9. Lessons API

## Listar Aulas

```http
GET /api/v1/lessons
```

---

## Consultar Aula

```http
GET /api/v1/lessons/{id}
```

---

## Criar Aula

```http
POST /api/v1/lessons
```

---

## Atualizar Aula

```http
PUT /api/v1/lessons/{id}
```

---

## Eliminar Aula

```http
DELETE /api/v1/lessons/{id}
```

---

## Inscrever Sócio

```http
POST /api/v1/lessons/{id}/enrollments
```

---

## Remover Inscrição

```http
DELETE /api/v1/lessons/{id}/enrollments/{memberId}
```

---

# 10. Dashboard API

## Dashboard

```http
GET /api/v1/dashboard
```

Resposta

```json
{
  "members": 120,
  "reservationsToday": 18,
  "lessonsToday": 6,
  "availableCourts": 3
}
```

---

# 11. Controlo de Acessos

| Endpoint | Admin | Rececionista | Treinador | Sócio |
|-----------|:----:|:------------:|:---------:|:-----:|
| Auth | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ❌ | ❌ |
| Members | ✅ | ✅ | ❌ | ❌ |
| Coaches | ✅ | Consulta | ❌ | ❌ |
| Courts | ✅ | Consulta | ❌ | ❌ |
| Reservations | ✅ | ✅ | ❌ | Consulta |
| Lessons | ✅ | Consulta | Consulta | Consulta |

---

# 12. Fluxo Geral

```text
Frontend

↓

HTTP Request

↓

REST API

↓

Controller

↓

Service

↓

Prisma

↓

PostgreSQL
```

---

# 13. Evolução Futura

A arquitetura da API foi preparada para suportar novos módulos, incluindo:

- `/api/v1/payments`
- `/api/v1/tournaments`
- `/api/v1/analytics`
- `/api/v1/notifications`
- `/api/v1/match-analysis`

Estes endpoints não fazem parte do APCM Core.

---

# 14. Considerações Finais

A API REST definida neste documento estabelece a interface de comunicação entre o frontend e o backend do APCM.

A utilização de recursos bem definidos, métodos HTTP normalizados e uma estrutura modular facilita a manutenção da aplicação, promove a reutilização de código e prepara a plataforma para futuras evoluções.