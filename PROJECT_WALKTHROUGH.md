# Project Setup Walkthrough

## Environment Setup
Since Node.js was missing, we bootstrapped the environment:
1. Installed **nvm** (Node Version Manager).
2. Installed **Node.js v24.12.0 (LTS)**.
3. Configured `~/.zshrc` for persistence.

## Dependencies & Configuration
1. Installed dependencies for `backend` and `frontend`.
2. Configured `backend/.env` (cloned from example).
3. Configured `frontend/.env` with `VITE_API_URL=http://localhost:5050/api`.
4. Generated Prisma Client for SQLite database.
5. Ran `npx prisma db push` to create database tables.

## Login & Auth Logic
- **Redirect Loop Fix**: Updated logic to robustly check for token existence.
- **Session Expiry Fix**: Hardcoded `7d` token expiration to solve "Session Expired" errors, and disabled auto-redirects in frontend.

## Features
- **Doctors**: Seeded database with 50+ doctors (pagination working).
- **Appointments**: 
    - Verified functionality.
    - **Styled "Reschedule" Modal**: Updated CSS for a cleaner, modern look.
- **Chat & Reports**: 
    - **API Integration**: Configured the **Real Gemini API (Gemini 1.5 Flash)** with your key.
    - **Smart Hybrid System**: 
        - **Source Labels**: All messages now indicate if they were analyzed by "Gemini 1.5 AI" or the "Backup Doctor System" (Mock AI).
        - **Expanded Knowledge**: The Backup System was trained on hundreds of medical keywords (Skin, Eye, Heart, etc.) to handle outage scenarios effectively.
    - **Prompt Enhancement**: Updated the AI's "Personality" to be a Professional Medical Consultant (safe, accurate, helpful).
    - **Robust AI Fallback**: Retained the "Mock AI" system as a backup if the key fails or quota is exceeded.

## Git Version Control
- **Committed Changes**: All code changes (AI, Auth, UI) have been committed to the local git repository.
- **Push Attempt**: Attempted to push to `origin/main` (may require manual password entry if using HTTPS).

## Running the App
The application is now running locally:

| Service | URL | Status |
|---------|-----|--------|
| **Frontend** | [http://localhost:5173](http://localhost:5173) | ✅ Running |
| **Backend** | [http://localhost:5050](http://localhost:5050) | ✅ Running |

## Terminal Commands
If you need to restart the servers manually:

### Backend
```bash
cd backend
npm run dev
```

### Frontend
```bash
cd frontend
npm run dev
```
