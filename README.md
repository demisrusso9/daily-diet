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

### Estrutura de módulos

```
src/modules/
├── meal/
│   ├── controllers/   # handlers HTTP
│   ├── factories/     # injeção de dependências
│   ├── repositories/
│   │   ├── contracts/ # interfaces (independentes do ORM)
│   │   └── prisma-meal.repository.ts
│   ├── schemas/       # Zod schemas + DTOs
│   └── services/      # regras de negócio
└── user/
    ├── controllers/
    ├── factories/
    ├── repositories/
    │   ├── contracts/
    │   └── prisma-users.repository.ts
    ├── schemas/
    └── services/
```

### Testes

Os testes unitários utilizam **repositórios in-memory** que implementam os mesmos contratos das implementações Prisma, permitindo testar os Services de forma completamente isolada, sem banco de dados.

```
tests/
├── repositories/
│   ├── in-memory-meals.repository.ts
│   └── in-memory-users.repository.ts
└── modules/
    ├── meal/services/
    └── user/services/
```

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
npm test                 # executa uma vez
npm run test:watch       # modo watch
npm run test:coverage    # com relatório de cobertura
```

### Documentação

Com o servidor rodando, acesse:

```
http://localhost:3333/docs
```

A interface do Swagger permite explorar todos os endpoints, visualizar os schemas de request/response e executar chamadas diretamente pelo navegador. Para testar rotas protegidas, clique em **Authorize** e insira o token JWT obtido no endpoint `/users/login`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/daily_diet"
JWT_SECRET="sua-chave-secreta"
PORT=3333
```

---

## Rotas

### Usuários

| Método | Rota              | Descrição                      |
| ------ | ----------------- | ------------------------------ |
| `POST` | `/users/register` | Cadastrar novo usuário         |
| `POST` | `/users/login`    | Autenticar e receber token JWT |

### Refeições _(requer autenticação)_

| Método   | Rota             | Descrição                       |
| -------- | ---------------- | ------------------------------- |
| `POST`   | `/meals`         | Criar refeição                  |
| `GET`    | `/meals`         | Listar todas as refeições       |
| `GET`    | `/meals/:id`     | Buscar refeição por ID          |
| `PUT`    | `/meals/:id`     | Atualizar refeição              |
| `DELETE` | `/meals/:id`     | Deletar refeição                |
| `DELETE` | `/meals`         | Deletar todas as refeições      |
| `GET`    | `/meals/summary` | Resumo e métricas das refeições |

---

## Regras da aplicação

- [x] Deve ser possível criar um usuário
- [x] Deve ser possível identificar o usuário entre as requisições
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
