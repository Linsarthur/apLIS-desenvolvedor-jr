# apLIS — Teste Desenvolvedor Júnior

Aplicação fullstack com frontend em React, backend em PHP (médicos), backend em Node.js (pacientes) e banco de dados MySQL.

## Tecnologias

- **Frontend:** React 18 + TypeScript + Vite
- **Backend PHP:** PHP 8.3 + PDO
- **Backend Node:** Node.js 20 + Express + mysql2
- **Banco de dados:** MySQL 8.0
- **Infraestrutura:** Docker + Docker Compose

## Como rodar

### Pré-requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop) instalado e rodando

### Subir o projeto

```bash
docker compose up --build
```

Aguarde todos os containers iniciarem. Na primeira execução, o banco de dados é criado automaticamente.

### Acessar

| Serviço | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API Médicos (PHP) | http://localhost:8000/api/v1/medicos |
| API Pacientes (Node) | http://localhost:3000/api/v1/pacientes |

### Parar

```bash
# Manter os dados do banco
docker compose down

# Apagar os dados do banco
docker compose down -v
```

## Endpoints

### Médicos — PHP (`localhost:8000`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/medicos` | Lista todos |
| GET | `/api/v1/medicos/:id` | Busca por ID |
| POST | `/api/v1/medicos` | Cria novo |
| PUT | `/api/v1/medicos/:id` | Atualiza |
| DELETE | `/api/v1/medicos/:id` | Remove |

### Pacientes — Node (`localhost:3000`)

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/v1/pacientes` | Lista todos |
| GET | `/api/v1/pacientes/:id` | Busca por ID |
| POST | `/api/v1/pacientes` | Cria novo |
| PUT | `/api/v1/pacientes/:id` | Atualiza |
| DELETE | `/api/v1/pacientes/:id` | Remove |

## Estrutura do projeto

```
├── docker-compose.yml
├── init.sql
├── backendphp/        # API de médicos em PHP
├── backendjs/         # API de pacientes em Node.js
└── app/               # Frontend React
```