# 🌟 SkillNest.lk — Academic & Online Resources Management System
### MERN Full-Stack CRUD Application | WE_314_2.2

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [Running the App](#running-the-app)
5. [Demo Accounts](#demo-accounts)
6. [Module Overview](#module-overview)
7. [API Endpoints](#api-endpoints)

---

## ✅ Prerequisites

Install these on your laptop before starting:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | v18+ | https://nodejs.org |
| MongoDB | v6+ | https://www.mongodb.com/try/download/community |
| npm | v9+ (comes with Node) | — |

> **Check versions:**
> ```bash
> node -v
> npm -v
> mongod --version
> ```

---

## 📁 Project Structure

```
skillnest/
├── backend/                  ← Express + MongoDB API
│   ├── models/               ← Mongoose schemas (User, Ticket, Message, Resource)
│   ├── routes/               ← REST API routes
│   ├── middleware/           ← JWT auth middleware
│   ├── uploads/              ← Uploaded files (auto-created)
│   ├── .env                  ← Environment variables
│   ├── server.js             ← Entry point
│   └── seed.js               ← Demo data seeder
│
└── frontend/                 ← React application
    ├── src/
    │   ├── context/          ← Auth context
    │   ├── pages/            ← All page components
    │   ├── components/       ← Shared components
    │   ├── App.js            ← Routing
    │   └── index.css         ← Global styles (blue gradient theme)
    └── public/
```

---

## 🚀 Setup Instructions

### Step 1 — Start MongoDB

**Windows:**
```bash
# Open MongoDB Compass OR run:
mongod --dbpath C:\data\db
```

**Mac/Linux:**
```bash
mongod
# or
brew services start mongodb-community
```

---

### Step 2 — Setup Backend

```bash
# Navigate to backend
cd skillnest/backend

# Install dependencies
npm install

# The .env file is already created with defaults:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/skillnest
# JWT_SECRET=skillnest_super_secret_key_2024

# Seed demo data (optional but recommended)
node seed.js

# Start backend server
npm run dev
```

✅ Backend running at: **http://localhost:5000**

---

### Step 3 — Setup Frontend

Open a **new terminal window**:

```bash
# Navigate to frontend
cd skillnest/frontend

# Install dependencies
npm install

# Start React app
npm start
```

✅ Frontend running at: **http://localhost:3000**

---

## 🎮 Running the App

You need **2 terminal windows** open:

| Terminal | Command | URL |
|----------|---------|-----|
| Terminal 1 | `cd backend && npm run dev` | http://localhost:5000 |
| Terminal 2 | `cd frontend && npm start` | http://localhost:3000 |

Open your browser and go to: **http://localhost:3000**

---

## 👥 Demo Accounts

After running `node seed.js`:

| Role | Email | Password |
|------|-------|----------|
| 🛡️ Admin | admin@skillnest.lk | password123 |
| 👨‍🏫 Tutor | kamal@skillnest.lk | password123 |
| 👨‍🏫 Tutor | nimali@skillnest.lk | password123 |
| 🎓 Student | david@skillnest.lk | password123 |
| 🎓 Student | amara@skillnest.lk | password123 |

---

## 📦 Module Overview

### Module 1 — User Management & Academic Profiling
- Role-based login (Student / Tutor / Admin) with modal popup
- JWT authentication with bcrypt password hashing
- Multi-step academic profile form (4 steps)
- Degree program, semester, subjects, GPA tracking
- Skills assessment with star ratings & strength/weakness tagging
- Profile completion progress bar + circular chart
- Change password, recent activity, account settings
- Admin: full user management CRUD table

### Module 2 — Peer Help, Tutor Support, Quiz & Assignment Help
- Ticketing system: 4-step ticket creation wizard
- Help types: Peer Help, Tutor Support, Quiz Help, Assignment Help
- Auto-match with available tutors by module
- Ticket management: Open → In Progress → Resolved → Closed
- Real-time chat per ticket using Socket.IO
- Ticket status filtering and priority levels (Low/Medium/High)
- Student & tutor dashboard views

### Module 3 — Study Resources & Notes Sharing
- Upload PDFs and external links
- Subject + semester categorization with tags
- Search & filter by subject, semester, type, keyword
- Bookmark system (per user)
- 5-star rating system
- Admin approval workflow (Pending → Approved/Rejected)
- 🤖 AI Notes Summarizer — generates summary + key points from any resource
- Download counter tracking

---

## 🔌 API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| PUT | /api/auth/change-password | Change password |

### Users
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/users | Get all users (admin) |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update profile |
| DELETE | /api/users/:id | Delete user (admin) |

### Tickets
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tickets | Get my tickets |
| POST | /api/tickets | Create ticket |
| GET | /api/tickets/:id | Get ticket detail |
| PUT | /api/tickets/:id | Update status |
| DELETE | /api/tickets/:id | Delete ticket |

### Messages
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/messages/:ticketId | Get chat messages |
| POST | /api/messages | Send message |
| DELETE | /api/messages/:id | Delete message |

### Resources
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/resources | List with filters |
| POST | /api/resources | Upload resource |
| GET | /api/resources/:id | Get resource |
| PUT | /api/resources/:id | Update resource |
| DELETE | /api/resources/:id | Delete resource |
| POST | /api/resources/:id/bookmark | Toggle bookmark |
| POST | /api/resources/:id/rate | Rate resource |
| POST | /api/resources/:id/approve | Admin approve/reject |
| POST | /api/resources/:id/ai-summary | Generate AI summary |

### Tutors
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/tutors?module=xxx | Get tutors by module |

---

## 🛠️ Common Issues

**MongoDB not connecting?**
- Make sure MongoDB service is running
- Check MONGO_URI in `.env` file

**Port already in use?**
- Change PORT in `.env` (e.g., 5001)
- Update the `proxy` in `frontend/package.json` to match

**npm install fails?**
- Delete `node_modules` folder and `package-lock.json`, then retry
- Make sure Node.js v18+ is installed

**CORS error?**
- Make sure backend is running on port 5000
- Check `frontend/package.json` proxy setting

---

## 👨‍💻 Team
**WE_314_2.2 — SLIIT**
- IT23617100 — S.S Pathiranage (Module 1: User Management)
- IT23698918 — Lakshan W.A.K.T.K (Module 2: Peer Help & Ticketing)
- IT23715110 — Yasintha W.K.M (Module 3: Study Resources)
