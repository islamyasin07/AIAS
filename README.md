# 🏛️ AIAS Portal – An-Najah Chapter

A full-stack web platform built for the **AIAS – An-Najah Chapter (Architecture Student Association)**.  
The system provides a modern environment for managing members, events, and educational resources in a collaborative academic community.

---

## 🚀 Key Features

### 🔐 Authentication & Users
- User registration via Firebase Authentication (Email/Password).
- Firestore profile for each user (full_name, is_admin, membership_status, photoURL).
- Role-based access: **Members** and **Admins**.

### 👥 Members Management
- Admin panel to approve/reject membership requests.
- Update member status (pending → approved/rejected).
- Remove inactive users.

### 🎟️ Events
- Create new events with details (title, date, location, capacity, requirements).
- Member event registration system.
- Admin can accept/reject event registrations.
- Each member sees their registered events on the Home screen (cards).

### 📚 Resources
- Educational resource library (videos, guides, documents).
- Upload and categorize resources by type.
- Browse and download resources.

### 🖥️ Frontend
- **React + Vite** with modern UI (Tailwind + custom CSS).
- **AuthContext** for storing user + token in localStorage.
- **Protected Routes** (restricted pages require login).
- **Home Screen** shows:
  - Logged-in user’s name and avatar.
  - List of their registered events.
  - Elegant cards for resources and events.

### ⚙️ Backend
- **Express.js** + **Firebase Admin SDK**.
- RESTful APIs: `/api/auth`, `/api/members`, `/api/events`, `/api/resources`.
- Middleware for security:
  - `requireAuth` → validates Firebase ID Token (JWT).
  - `requireAdmin` → checks Firestore role (`is_admin`).

---

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Axios, Context API, Tailwind/CSS
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Deployment/Infra:** Firebase / GitHub

---

