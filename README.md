# SynapticCare+ — AI-Powered Healthcare Assistant

SynapticCare+ is an intelligent healthcare platform that uses **AI**, **NLP**, and **Machine Learning** to help users analyze symptoms, upload medical reports, chat with an AI health assistant, and track their overall health trends.

## 🚀 Features

### 🧠 AI Health Assistant
- Ask health questions in natural language  
- AI-generated summaries & recommendations  
- Symptom analysis  

### 🩺 Medical Report Analyzer
- Upload PDFs/images  
- Automatic text extraction  
- AI-powered structured health summary  
- Detect abnormalities (e.g., low hemoglobin, high WBC)

### 🔐 Authentication (JWT)
- User login/signup  
- Password hashing with bcrypt  
- JWT-based protected routes  

### 📊 Health Dashboard
- View past reports  
- Track health insights  
- Graphs using Recharts  

### ⚡ Modern UI
- React + Tailwind  
- Responsive UI  
- Clean blue/white theme

---

## 🏗️ Tech Stack

### Frontend
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **HTTP Client**: Axios
- **Charts**: Recharts

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT)
- **AI**: OpenAI API
- **File Upload**: Multer

---

## 🌐 Live Deployments

- **Frontend**: https://synaptic-care.vercel.app/
- **Backend**: https://synapticcare.onrender.com

---

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
- `POST /api/v1/auth/signup`: Create a new account
- `POST /api/v1/auth/login`: Login to an existing account
- `GET /api/v1/users/me`: Get current user profile

## License
ISC
