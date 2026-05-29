# task-tracker

A simple task tracker built with React, FastAPI, PostgreSQL, and Docker.

## Features

- Task creation and editing
- Dashboard-style task cards with priority, due date, attachments, and comments
- Background video selection
- News widget
- Docker Compose support for backend, frontend, and database

## Local development

### Backend

1. Open a terminal in `/backend`
2. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Start the API:

   ```bash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend

1. Open a terminal in `/frontend`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the dev server:

   ```bash
   npm run dev -- --host 0.0.0.0 --port 5173
   ```

## Docker

Run the full stack with Docker Compose:

```bash
docker compose up --build
```

Then open the frontend at `http://localhost:5173`.

The frontend is configured to use the backend service address inside Docker via `VITE_BACKEND_URL=http://backend:8000`.

## Notes

- The frontend now persists the selected background video between sessions.
- The modal close/save flow has been improved for better reliability.
