# goalsMaDr - Bun/Hono Edition

A modern full-stack "goals" tracking application built with Bun, Hono, React, and MongoDB.

## 🚀 Tech Stack

### Backend
- **Runtime**: Bun
- **Framework**: Hono
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT with bcryptjs
- **Architecture**: MVC pattern

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v6

## 📦 Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd goalsMaDr
```

2. Install dependencies
```bash
bun install
cd frontend && bun install
```

3. Set up environment variables
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. Start MongoDB (make sure it's running on your system)

## 🏃‍♂️ Running the Application

### Development Mode
```bash
# Start backend (from root directory)
bun run dev

# Start frontend (in another terminal)
cd frontend
bun run dev
```

### Production Build
```bash
# Build frontend
cd frontend
bun run build

# Start production server
cd ..
bun run start
```

## 📁 Project Structure

```
goalsMaDr/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   └── server.js        # Main server file
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app component
│   └── dist/            # Built frontend files
└── package.json         # Root package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/me` - Get current user (protected)

### Goals
- `GET /api/goals` - Get user goals (protected)
- `POST /api/goals` - Create goal (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)

## 🛠️ Development Features

- Hot reload with `--watch` flag
- Input validation middleware
- Comprehensive error handling
- CORS configuration for development
- Static file serving for SPA
- JWT authentication middleware

## 🚀 Deployment

The app is configured to serve the React build files statically from the Hono server, making it suitable for single-server deployment.

## 📝 Environment Variables

See `.env.example` for required environment variables.
