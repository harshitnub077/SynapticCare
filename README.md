# SynapticCare+ — AI-Powered Healthcare Assistant

SynapticCare+ is an intelligent healthcare platform that uses **AI**, **NLP**, and **Machine Learning** to help users analyze symptoms, upload medical reports, chat with an AI health assistant, and track their overall health trends.

## 🚀 Features

### 🧠 AI Health Assistant
- Ask health questions in natural language  
- AI-generated summaries & recommendations (powered by OpenAI GPT-3.5)
- Symptom analysis  
- **Demo Mode**: Works with basic rule-based responses without API key

### 🩺 Medical Report Analyzer
- Upload PDFs/images  
- Automatic text extraction (OCR)
- AI-powered structured health summary  
- Detect abnormalities (e.g., low hemoglobin, high WBC)
- Flag values outside normal ranges

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

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **ORM**: Prisma
- **Auth**: JSON Web Tokens (JWT)

---

## 🌐 Live Deployments

- **Frontend**: https://synaptic-care.vercel.app/
- **Backend**: https://synapticcare.onrender.com

---

    **Important:** 
    - Without `gemini_api_key`, the chat assistant runs in **Demo Mode** with rule-based responses
    - Add your OpenAI API key for full AI-powered medical analysis

5.  Run Database Migrations:
    ```bash
    npx prisma migrate dev --name init
    ```
6.  Start the Server:
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


## API Endpoints
- `POST /api/v1/auth/signup`: Create a new account
- `POST /api/v1/auth/login`: Login to an existing account
- `GET /api/v1/users/me`: Get current user profile


