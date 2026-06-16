# Business Matches

Business Matches is a full-stack acquisition and matching platform for managing buyers, sellers, matches, tasks, documents, and AI-assisted financial summaries.

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind CSS
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT
- File uploads: Multer
- AI: Gemini / Google GenAI

## Features

- User signup, login, and profile management
- Protected dashboard routes
- Buyer and seller listing and request workflows
- Match management with chat, status updates, tasks, and document uploads
- Task CRUD
- Document upload, view, update, and delete
- AI financial summary generation from uploaded documents

## Project Structure

- `backend/` - Express API, MongoDB models, routes, controllers, and upload storage
- `frontend/` - Vite React app for the dashboard UI

## Prerequisites

- Node.js 18 or newer
- npm
- MongoDB instance
- Gemini API key for AI features

## Environment Variables

Create a `.env` file in `backend/` with:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
```

## Setup

Install dependencies for both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Start the backend API:

```bash
cd backend
npm run dev
```

Start the frontend app in a second terminal:

```bash
cd frontend
npm run dev
```

The default local URLs are:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Notes

- The frontend API client is hardcoded to `http://localhost:5000` in `frontend/src/api/axios.js`.
- Uploaded files are served from the backend `uploads/` directory.
- Authenticated requests send a JWT from `localStorage` in the `Authorization` header.

## API Overview

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/profile`
- `PUT /auth/profile/update`
- `GET /buyers`
- `GET /buyers/:id`
- `POST /buyers/:id/accept`
- `POST /buyers/:id/reject`
- `POST /buyers/:id/request`
- `POST /buyers/:id/respond`
- `GET /sellers`
- `GET /sellers/:id`
- `POST /sellers/:id/respond`
- `GET /matches`
- `GET /matches/:id`
- `POST /matches/:id/chat`
- `POST /matches/:id/documents`
- `POST /matches/:id/tasks`
- `PUT /matches/:id/status`
- `GET /tasks`
- `POST /tasks`
- `PUT /tasks/:id`
- `DELETE /tasks/:id`
- `POST /documents`
- `GET /documents/:matchId`
- `PUT /documents/:id`
- `DELETE /documents/:id`
- `POST /ai/financial-summary/:docId`

## Frontend Routes

- `/login`
- `/signup`
- `/dashboard/buyers`
- `/dashboard/sellers`
- `/dashboard/matches`
- `/dashboard/tasks`
- `/dashboard/documents`
- `/dashboard/ai-tools`
- `/dashboard/profile`

## License

No license file is currently provided.
