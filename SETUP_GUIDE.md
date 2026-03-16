# WatchList Setup Guide

This is a quick local setup for the full app:

- Frontend (Vite + React)
- Backend (Node + Express)
- Recommender (Flask)

## 1) Prerequisites

Install these first:

- Node.js 18+
- npm 9+
- Python 3.10+
- MongoDB (local or cloud)

Optional but recommended:

- Git
- Postman (for API checks)

## 2) Install dependencies

From the project root, install each service:

```bash
cd Backend && npm install
cd ../frontend && npm install
cd ../Recommender && pip install -r requirements.txt
```

If you use a Python virtual environment (recommended):

```bash
cd Recommender
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
# Windows Git Bash
source .venv/Scripts/activate
# macOS/Linux
source .venv/bin/activate
pip install -r requirements.txt
```

## 3) Configure environment variables

Create these files:

- Backend/.env
- frontend/.env
- Recommender/.env

### Backend/.env

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRETE_KEY=your_jwt_secret
TMDB_BEARER_TOKEN=your_tmdb_bearer_token
RECOMMENDATION_URL=http://127.0.0.1:5001/recommend
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_app_password
PROFILE_LINK=http://localhost:5173/profile
```

### frontend/.env

```env
VITE_AUTH_SERVER_URL=http://localhost:5000/auth
VITE_ACCOUNT_SERVER_URL=http://localhost:5000/auth
VITE_MOVIE_BASE_URL=http://localhost:5000/movie
VITE_FAV_BASE_URL=http://localhost:5000/favorite
VITE_PLAYLIST_BASE_URL=http://localhost:5000/playlist
VITE_RECOMMENDATION_BASE_URL=http://localhost:5000/recommendation
VITE_SERVER_BASE_URL=http://localhost:5000
```

### Recommender/.env

```env
TMDB_API_KEY=your_tmdb_bearer_token
```

Note: this project sends the token as a Bearer Authorization value. If you use a TMDB v4 token, set it directly as shown above.

Important: run the recommender on a different port from backend (example: 5001).

## 4) Run all services

Open 3 terminals.

Terminal 1 - Backend:

```bash
cd Backend
npm run server
```

Terminal 2 - Frontend:

```bash
cd frontend
npm run dev
```

Terminal 3 - Recommender:

```bash
cd Recommender
# activate venv if needed
flask --app app run --port 5001
```

## 5) Open the app

Go to:

- http://localhost:5173

## 6) Common issues

- CORS error:
  - Make sure Backend/.env CLIENT_URL matches the frontend URL exactly.
- Mongo connection failure:
  - Verify MONGO_URI and whitelist IP if using MongoDB Atlas.
- Recommender not responding:
  - Confirm RECOMMENDATION_URL points to the Flask service route (/recommend), for example http://127.0.0.1:5001/recommend.
- Auth/session issues:
  - Confirm JWT_SECRETE_KEY is set and backend restarted after .env changes.

## 7) Quick health checks

- Backend: check any backend route, for example http://localhost:5000/movie/all-movies
- Recommender: http://127.0.0.1:5001/
- Frontend: http://localhost:5173
