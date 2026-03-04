# Daily Diet API

API REST para controle de dieta diária, permitindo que usuários registrem e acompanhem suas refeições com métricas personalizadas.

---

## Tecnologias

- **[Node.js](https://nodejs.org/)** + **[TypeScript](https://www.typescriptlang.org/)** — runtime e linguagem
- **[Fastify v5](https://fastify.dev/)** — framework HTTP de alta performance
- **[Prisma 7](https://www.prisma.io/)** — ORM com adapter nativo para PostgreSQL (`@prisma/adapter-pg`)
- **[PostgreSQL](https://www.postgresql.org/)** — banco de dados relacional
- **[Zod v4](https://zod.dev/)** — validação de schemas e tipagem de DTOs
- **[JWT](https://jwt.io/)** via `@fastify/jwt` — autenticação stateless
- **[bcrypt](https://github.com/kelektiv/node.bcrypt.js)** — hash de senhas
- **[Swagger / OpenAPI 3.0](https://swagger.io/)** via `@fastify/swagger` + `@fastify/swagger-ui` — documentação interativa da API
- **[Vitest v4](https://vitest.dev/)** — testes unitários com cobertura de código (`@vitest/coverage-v8`)
- **[Husky](https://typicode.github.io/husky/)** — git hooks (pre-commit executa os testes automaticamente)
- **[TSX](https://github.com/privatenumber/tsx)** — execução de TypeScript em desenvolvimento sem build

---

## Arquitetura

O projeto segue os princípios da **Clean Architecture**, separando responsabilidades em camadas bem definidas:

```
Controller  →  Service  →  Repository (Contract)  →  Repository (Implementation)
```

- **Controllers** — recebem a requisição HTTP, validam o body/params com Zod e delegam para o Service
- **Services** — contêm a lógica de negócio, dependem apenas de contratos (interfaces), sem acoplamento ao ORM
- **Repository Contracts** — interfaces que definem o que o repositório deve fazer, usando DTOs de domínio (sem tipos do Prisma)
- **Repository Implementations** — implementações concretas com Prisma, facilmente substituíveis
- **Factories** — funções de composição que instanciam Services injetando as dependências corretas (Factory Method como Composition Root)
- **DTOs** — definidos via `z.infer<>` dos schemas Zod, reutilizados em toda a aplicação

### Testes

Os testes unitários utilizam **repositórios in-memory** que implementam os mesmos contratos das implementações Prisma, permitindo testar os Services de forma completamente isolada, sem banco de dados.

---

## Como executar

### Pré-requisitos

- Node.js 18+
- Docker (para o banco de dados)

### Instalação

```bash
npm install
```

### Banco de dados

```bash
docker-compose up -d
npx prisma migrate deploy
```

### Desenvolvimento

```bash
npm run dev
```

### Testes

```bash
npm test
npm run test:watch
npm run test:coverage
```

### Documentação

Com o servidor rodando, acesse:

```
http://localhost:3333/docs
```

A interface do Swagger permite explorar todos os endpoints, visualizar os schemas de request/response e executar chamadas diretamente pelo navegador. Para testar rotas protegidas, clique em **Authorize** e insira o access token JWT obtido no endpoint `/users/session`.

### Autenticação

O fluxo de autenticação utiliza dois tokens:

- **access token** — retornado no body do `/users/session`, expira em curto prazo, usado no header `Authorization: Bearer <token>`
- **refresh token** — salvo em cookie `HttpOnly`, usado para renovar o access token via `GET /users/refresh` sem necessidade de novo login

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=development
DATABASE_URL="postgresql://user:password@localhost:5432/daily_diet"
JWT_SECRET="sua-chave-secreta"
PORT=3333
HOST=localhost
```

---

## Rotas

### Usuários

| Método | Rota             | Descrição                                         |
| ------ | ---------------- | ------------------------------------------------- |
| `POST` | `/users/create`  | Cadastrar novo usuário                            |
| `POST` | `/users/session` | Autenticar e receber access token + refresh token |
| `GET`  | `/users/refresh` | Renovar access token via cookie refresh token     |

### Refeições _(requer autenticação)_

| Método   | Rota \*\*\*\*       | Descrição                       |
| -------- | ------------------- | ------------------------------- |
| `POST`   | `/meals/create`     | Criar refeição                  |
| `GET`    | `/meals/list`       | Listar todas as refeições       |
| `GET`    | `/meals/list/:id`   | Buscar refeição por ID          |
| `PATCH`  | `/meals/update/:id` | Atualizar refeição              |
| `DELETE` | `/meals/delete/:id` | Deletar refeição                |
| `DELETE` | `/meals/delete-all` | Deletar todas as refeições      |
| `GET`    | `/meals/summary`    | Resumo e métricas das refeições |

### Infraestrutura

| Método | Rota           | Descrição                         |
| ------ | -------------- | --------------------------------- |
| `GET`  | `/healthcheck` | Status da API e do banco de dados |

---

## Regras da aplicação

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
- [x] Deve ser possível renovar o access token via refresh token (cookie HttpOnly)
- [x] Deve ser possível registrar uma refeição feita, com as seguintes informações:
  - As refeições devem ser relacionadas a um usuário
  - Nome
  - Descrição
  - Data e Hora
  - Está dentro ou não da dieta
- [x] Deve ser possível editar uma refeição, podendo alterar todos os dados acima
- [x] Deve ser possível apagar uma refeição
- [x] Deve ser possível listar todas as refeições de um usuário
- [x] Deve ser possível visualizar uma única refeição
- [x] Deve ser possível recuperar as métricas de um usuário:
  - Quantidade total de refeições registradas
  - Quantidade total de refeições dentro da dieta
  - Quantidade total de refeições fora da dieta
  - Melhor sequência de refeições dentro da dieta
- [x] O usuário só pode visualizar, editar e apagar as refeições que ele criou
