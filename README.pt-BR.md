# task-tracker

Um rastreador de tarefas simples construído com React, FastAPI, PostgreSQL e Docker.

## Visão geral

Este repositório contém um aplicativo full-stack de controle de tarefas.

- Frontend: React + Vite
- Backend: FastAPI
- Banco de dados: PostgreSQL
- Orquestração: Docker Compose

## Início rápido

### Opção 1: Executar com Docker Compose (recomendado)

Este é o jeito mais fácil de rodar toda a aplicação com um único comando.

1. A partir da raiz do repositório, execute:

   ```bash
   docker compose up --build
   ```

2. Abra o navegador em:

   ```text
   http://localhost:5173
   ```

3. O app irá se conectar automaticamente ao backend.

### Opção 2: Executar localmente sem Docker

Use esta opção se quiser rodar frontend e backend separadamente.

#### Backend

1. Abra um terminal na pasta `backend`.
2. Instale as dependências do Python:

   ```bash
   pip install -r requirements.txt
   ```

3. Inicie a API:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend

1. Abra um terminal na pasta `frontend`.
2. Instale as dependências do Node:

   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

4. Abra o navegador em:

   ```text
   http://localhost:5173
   ```

## O que esperar

- Criar e editar tarefas com prioridade, data de entrega, tags, anexos e comentários.
- Visualizar tarefas em um layout tipo dashboard.
- Fazer upload de fotos e abrir pré-visualizações de imagem.
- O backend fica disponível em `http://localhost:8000` quando executado localmente.

## Observações para recrutadores

- O app foi preparado para ser fácil de executar localmente ou em Docker.
- Docker Compose é a opção mais rápida e sem setup adicional.
- O backend e o frontend também podem ser iniciados separadamente para quem quiser um fluxo de desenvolvimento.
