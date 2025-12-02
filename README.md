# SynapticCare+

A fullstack AI-powered medical health assistant app designed to help users manage their health records and get AI-driven insights.

## Features
- **User Authentication**: Secure signup and login using JWT and bcrypt.
- **Medical Reports**: Upload and store medical reports (PDF/Images).
- **AI Assistant**: Chat with an AI assistant to analyze reports and get health advice.
- **Health Dashboard**: Visualize health trends and extracted data.
- **Responsive Design**: Modern UI with a clean blue/white theme.

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT)
- **AI**: OpenAI API

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Charts**: Recharts

## Setup & Installation

### Prerequisites
- Node.js (v18+)
- npm

### Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file (copy from `.env.example`) and add your secrets:
    ```bash
    cp .env.example .env
    ```
    *Note: Ensure `DATABASE_URL="file:./dev.db"` for local SQLite.*
4.  Run Database Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
5.  Start the Server:
    ```bash
    npm run dev
    ```
    The server will run on `http://localhost:5050`.

### Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
    The app will run on `http://localhost:5173`.

## Docker Setup (Optional)
To run the entire stack using Docker:
```bash
docker-compose up --build
```

## API Endpoints
- `POST /api/v1/auth/signup`: Create a new account.
- `POST /api/v1/auth/login`: Login to an existing account.
- `GET /api/v1/users/me`: Get current user profile.

## License
ISC
