# task-tracker

A simple task tracker built with React, FastAPI, PostgreSQL, and Docker.

- English documentation: `README.md`
- Versão em Português: `README.pt-BR.md`

## Overview

This repository contains a full-stack task tracker app.

- Frontend: React + Vite
- Backend: FastAPI
- Database: PostgreSQL
- Orchestration: Docker Compose

## Quick start

### Option 1: Run with Docker Compose (recommended)

This is the easiest way to run the entire app with one command.

1. From the repository root, run:

   ```bash
   docker compose up --build
   ```

2. Open your browser at:

   ```text
   http://localhost:5173
   ```

3. The app will connect to the backend automatically.

### Option 2: Run locally without Docker

Use this option if you want to run the frontend and backend separately.

#### Backend

1. Open a terminal and navigate to the `backend` folder.
2. Install Python dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the backend API:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

#### Frontend

1. Open a terminal and navigate to the `frontend` folder.
2. Install Node dependencies:

   ```bash
   npm install
   ```

3. Start the frontend dev server:

   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

4. Open your browser at:

   ```text
   http://localhost:5173
   ```

## What to expect

- Create and edit tasks with priority, due date, tags, attachments, and comments.
- View tasks in a dashboard-style layout.
- Upload photos and open image previews directly.
- The backend exposes the API at `http://localhost:8000` when running locally.

## Notes for recruiters

- The app is designed to be easy to run locally or in Docker.
- Use Docker Compose if you want a fast, no-setup experience.
- If you prefer a development workflow, start the backend and frontend individually.
