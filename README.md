<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving\&color=0:1565C0,100:42A5F5\&height=220\&section=header\&text=SkillNest.lk\&fontSize=58\&fontColor=ffffff\&animation=fadeIn)

# 🌟 SkillNest.lk

### Academic & Online Resources Management System

![MERN](https://img.shields.io/badge/MERN-Stack-00ED64?style=for-the-badge\&logo=mongodb\&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge\&logo=react\&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge\&logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge\&logo=express\&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?style=for-the-badge\&logo=mongodb\&logoColor=white)

**MERN Full-Stack CRUD Application | WE_314_2.2**

A centralized platform for academic resource sharing, tutor support, peer collaboration, and AI-powered study assistance.

</div>

---

## 📋 Table of Contents

* [Prerequisites](#-prerequisites)
* [Project Structure](#-project-structure)
* [Setup Instructions](#-setup-instructions)
* [Running the App](#-running-the-app)
* [Demo Accounts](#-demo-accounts)
* [Module Overview](#-module-overview)
* [API Endpoints](#-api-endpoints)
* [Common Issues](#-common-issues)
* [Team](#-team)

---

## 🎯 Project Overview

SkillNest.lk is a comprehensive Academic & Online Resources Management System developed using the MERN Stack. The platform enables students, tutors, and administrators to collaborate efficiently through resource sharing, academic profiling, ticket-based support, and AI-powered learning assistance.

### Key Features

✅ JWT Authentication & Authorization
✅ Academic Profile Management
✅ Tutor & Peer Support Ticketing System
✅ Real-Time Chat using Socket.IO
✅ Resource Upload & Sharing
✅ Bookmark & Rating System
✅ AI Notes Summarizer
✅ Admin Approval Workflow
✅ Responsive Modern UI

---

## ✅ Prerequisites

| Tool    | Version |
| ------- | ------- |
| Node.js | v18+    |
| MongoDB | v6+     |
| npm     | v9+     |

```bash
node -v
npm -v
mongod --version
```

---

## 📁 Project Structure

```text
skillnest/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── seed.js
│
└── frontend/
    ├── src/
    │   ├── context/
    │   ├── pages/
    │   ├── components/
    │   ├── App.js
    │   └── index.css
    └── public/
```

---

## 🚀 Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/skillnest.git
cd skillnest
```

### 2️⃣ Backend Setup

```bash
cd backend

npm install

node seed.js

npm run dev
```

Backend:

```text
http://localhost:5000
```

### 3️⃣ Frontend Setup

Open a new terminal:

```bash
cd frontend

npm install

npm start
```

Frontend:

```text
http://localhost:3000
```

---

## 🎮 Running the Application

| Service  | Command     | URL            |
| -------- | ----------- | -------------- |
| Backend  | npm run dev | localhost:5000 |
| Frontend | npm start   | localhost:3000 |

---

## 👥 Demo Accounts

| Role        | Email                                             | Password    |
| ----------- | ------------------------------------------------- | ----------- |
| 🛡️ Admin   | [admin@skillnest.lk](mailto:admin@skillnest.lk)   | password123 |
| 👨‍🏫 Tutor | [kamal@skillnest.lk](mailto:kamal@skillnest.lk)   | password123 |
| 👨‍🏫 Tutor | [nimali@skillnest.lk](mailto:nimali@skillnest.lk) | password123 |
| 🎓 Student  | [david@skillnest.lk](mailto:david@skillnest.lk)   | password123 |
| 🎓 Student  | [amara@skillnest.lk](mailto:amara@skillnest.lk)   | password123 |

---

## 📦 Module Overview

### 👤 Module 01 — User Management & Academic Profiling

* JWT Authentication
* Role-Based Access Control
* Academic Profile Builder
* GPA Tracking
* Skill Assessment
* User Management Dashboard

### 🎫 Module 02 — Peer Help & Tutor Support

* Ticket Creation Wizard
* Tutor Matching
* Ticket Tracking
* Real-Time Messaging
* Priority Management

### 📚 Module 03 — Study Resources & Notes Sharing

* PDF Uploads
* Resource Categorization
* Search & Filtering
* Bookmark System
* Rating System
* Admin Approval Workflow
* AI Notes Summarizer

---

## 🔌 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/change-password
```

### Users

```http
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

### Tickets

```http
GET    /api/tickets
POST   /api/tickets
GET    /api/tickets/:id
PUT    /api/tickets/:id
DELETE /api/tickets/:id
```

### Messages

```http
GET    /api/messages/:ticketId
POST   /api/messages
DELETE /api/messages/:id
```

### Resources

```http
GET    /api/resources
POST   /api/resources
GET    /api/resources/:id
PUT    /api/resources/:id
DELETE /api/resources/:id
POST   /api/resources/:id/bookmark
POST   /api/resources/:id/rate
POST   /api/resources/:id/approve
POST   /api/resources/:id/ai-summary
```

---

## 🛠️ Common Issues

### MongoDB Connection Error

```bash
mongod
```

Verify your `.env` file:

```env
MONGO_URI=mongodb://localhost:27017/skillnest
```

### Port Already In Use

Change:

```env
PORT=5001
```

Then update the frontend proxy accordingly.

### npm Install Errors

```bash
rm -rf node_modules
rm package-lock.json

npm install
```

---

## 👨‍💻 Development Team

### WE_314_2.2 — SLIIT

| Student ID | Member            | Responsibility                       |
| ---------- | ----------------- | ------------------------------------ |
| IT23617100 | S.S Pathiranage   | User Management & Academic Profiling |
| IT23698918 | Lakshan W.A.K.T.K | Peer Help & Ticketing System         |
| IT23715110 | W.K.M. Yasintha   | Study Resources & AI Features        |

---

<div align="center">

### ⭐ If you found this project useful, consider giving it a star!

Made with ❤️ using MERN Stack

</div>

![footer](https://capsule-render.vercel.app/api?type=waving\&color=0:42A5F5,100:1565C0\&height=120\&section=footer)
