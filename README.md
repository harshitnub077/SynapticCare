📌 SynapticCare+ — AI-Powered Healthcare Assistant

An intelligent healthcare platform that uses AI, Machine Learning, and NLP to help users make better health decisions, track symptoms, manage reports, and get personalized insights.

🚀 Features
🧠 AI Health Assistant

Ask health-related questions

Get personalized insights using LLMs

Recommendation generation using context-aware models

Symptom analysis and summaries

🩺 Patient Health Dashboard

View symptoms, vitals, medical history

Track improvement over time

Upload & process medical reports (PDF, scans)

🔐 JWT Authentication

Secure login/signup using bcrypt

Access tokens & refresh tokens

Role-based routes (Patient / Admin / Doctor)

📁 Reports Manager

Upload medical PDFs

AI-powered extraction

Summary generation

Key metric extraction (WBC, RBC, BP, etc.)

📊 Analytics & Trends

Graphs of health metrics

AI-generated “health score”

Weekly / monthly progress tracking

🏗️ Tech Stack
Frontend

React.js

Tailwind CSS

Axios

Recharts

Context API / Redux (optional)

Backend

Node.js + Express

Prisma ORM

MySQL / PostgreSQL

JWT + Bcrypt

Multer (file upload)

AI / Machine Learning

OpenAI LLMs

Custom text processing pipeline

PDF extraction

Symptom analysis model (optional future)

📁 Project Structure
SynapticCare+/
 ├── backend/
 │   ├── prisma/
 │   ├── src/
 │   │   ├── routes/
 │   │   ├── controllers/
 │   │   ├── middleware/
 │   │   ├── utils/
 │   └── server.js
 │
 ├── frontend/
 │   ├── src/
 │   │   ├── components/
 │   │   ├── pages/
 │   │   ├── context/
 │   │   ├── hooks/
 │   └── main.jsx
 │
 └── README.md

🔐 Authentication Flow (JWT)

User registers → password hashed with bcrypt

User logs in → server verifies credentials

JWT access token generated

Each protected route requires:

Authorization: Bearer <token>


Token expiration → optional refresh token workflow

📦 API Endpoints
Auth Routes
Method	Endpoint	Description
POST	/api/auth/signup	Register new user
POST	/api/auth/login	Login and receive JWT
GET	/api/auth/me	Get logged-in user info
Report Routes
Method	Endpoint	Description
POST	/api/report/upload	Upload medical PDF
GET	/api/report/list	Fetch all reports
GET	/api/report/:id	Fetch single report
AI Routes
Method	Endpoint	Description
POST	/api/ai/ask	AI health assistant
POST	/api/ai/summarize	Summarize reports
🛠️ Installation & Setup
1️⃣ Clone the repo
git clone https://github.com/<your-username>/SynapticCarePlus.git
cd SynapticCarePlus

2️⃣ Backend Setup
cd backend
npm install


Create .env:

DATABASE_URL="mysql://user:password@localhost:3306/synaptic"
JWT_SECRET="your_secret"
CLIENT_ORIGIN="http://localhost:5173"


Run:

npx prisma migrate dev
npm run dev

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev

🤖 AI Model Integration

The backend uses OpenAI API:

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const response = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "user", content: "Summarize this lab report..." }
  ]
});

🔮 Future Enhancements

🫀 AI-powered early disease prediction

🩻 X-ray & MRI image analysis (Vision models)

🏥 Doctor matching system

📱 Mobile app (Flutter / React Native)

🛜 Realtime chat with health experts

🤝 Contributing

Pull requests are welcome!
Please create an issue before making major changes.

📄 License

MIT License — free to use and modify.
