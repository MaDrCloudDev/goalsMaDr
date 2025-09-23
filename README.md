# goalsMaDr

Full‑stack goals tracker built with Bun + Hono (API), MongoDB (Mongoose), and React + Vite (frontend).

## Stack
- Backend: Bun, Hono, Mongoose, JWT
- Frontend: React 18, Vite, Tailwind CSS v4, React Router
- Database: MongoDB

## Prerequisites
- Bun >= 1.0
- MongoDB running locally or a connection string

## Setup
```bash
# install root deps
bun install

# install frontend deps
cd frontend && bun install
```

Copy env file and fill in values:
```bash
cp .env.example .env
```

Required variables:
- MONGO_URI
- JWT_SECRET
- NODE_ENV (development|production)
- FRONTEND_URL (used in production for CORS)
- PORT (default 5000)

## Development
Run backend and frontend in separate terminals.
```bash
# terminal 1 (root)
bun run dev

# terminal 2 (frontend)
cd frontend
bun run dev   # Vite on http://localhost:5173
```

## Production
Build the frontend and start the API server. The API serves the built frontend from `frontend/dist`.
```bash
# build frontend
cd frontend && bun run build

# start api (from repo root)
cd ..
bun run start
```

## Project structure
```
goalsMaDr/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── frontend/
│   ├── src/
│   ├── index.html
│   └── vite.config.js
└── package.json
```

## API
Base URL: `/api`

Auth
- POST `/api/users` — register
- POST `/api/users/login` — login
- GET `/api/users/me` — current user (Bearer token)

Goals (Bearer token)
- GET `/api/goals` — list goals
- POST `/api/goals` — create goal `{ text }`
- PUT `/api/goals/:id` — update goal
- DELETE `/api/goals/:id` — delete goal

## Notes
- In development CORS allows `http://localhost:5173`.
- In production set `FRONTEND_URL` for CORS.
