# Health AI — Architecture

## Overview

Health AI is a full-stack healthcare platform for doctor appointment booking, virtual consultations, and AI-powered medical assistance. Built with modern serverless infrastructure for scalability and performance.

---

## Tech Stack

| Layer                  | Technology                            |
| ---------------------- | ------------------------------------- |
| **Framework**    | Next.js 15 (App Router, SSR)          |
| **Language**     | TypeScript                            |
| **Database**     | Neon (Serverless PostgreSQL)          |
| **ORM**          | Drizzle ORM                           |
| **AI**           | OpenAI GPT models                     |
| **Vector DB**    | Upstash (RAG / semantic search)       |
| **File Storage** | Cloudinary                            |
| **Email**        | Resend                                |
| **Auth**         | JWT (jose) + bcrypt, httpOnly cookies |
| **Styling**      | Tailwind CSS v4                       |
| **UI**           | shadcn/ui components                  |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Client (Browser)                    │
│                   Next.js React (SSR/CSR)                │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  Next.js App Router                      │
│              (Server Components + API Routes)            │
├─────────────────────────────────────────────────────────┤
│  /api/auth/*      → JWT auth (login, register, logout)  │
│  /api/ai          → AI chat (OpenAI GPT)                │
│  /api/doctors     → Doctor listing                      │
│  /api/upload      → File upload (Cloudinary)            │
│  /api/email       → Email notifications (Resend)        │
└──┬──────────┬──────────┬──────────────┬──────────┬──────┘
   │          │          │              │          │
   ▼          ▼          ▼              ▼          ▼
┌──────┐ ┌────────┐ ┌─────────┐ ┌────────────┐ ┌────────┐
│ Neon │ │ OpenAI │ │ Upstash │ │ Cloudinary │ │ Resend │
│  DB  │ │  GPT   │ │ Vector  │ │   (CDN)    │ │ (Email)│
└──────┘ └────────┘ └─────────┘ └────────────┘ └────────┘
```

---

## Database Schema (Neon PostgreSQL)

```
users
├── id (uuid, PK)
├── name, email, password (hashed)
├── role (ADMIN | DOCTOR | PATIENT)
├── practice, bio, virtualChatFee (doctor fields)
└── createdAt

appointments
├── id (uuid, PK)
├── doctorId → users.id
├── patientId → users.id
├── date, timeStr, type, status, notes
└── createdAt

chat_messages
├── id (uuid, PK)
├── senderId → users.id
├── text, isAi
└── createdAt

documents
├── id (uuid, PK)
├── patientId → users.id
├── doctorId → users.id (optional)
├── title, url (Cloudinary)
└── uploadDate
```

---

## Authentication Flow

```
1. Client POST /api/auth/login  { email, password, role }
2. Server verifies credentials (bcrypt.compare)
3. Server signs JWT (HS256, 7-day expiry) with user payload
4. JWT set as httpOnly, secure, sameSite cookie
5. Client calls GET /api/auth/me on mount → returns user from JWT
6. Logout → POST /api/auth/logout → clears cookie
```

---

## Key Modules

### AI Assistant (OpenAI GPT)

- Server-side API route `/api/ai`
- Accepts chat history, returns GPT response
- System prompt tailored for medical assistance
- Upstash vector DB for RAG context retrieval (medical knowledge base)

### File Upload (Cloudinary)

- Patient document uploads (lab results, prescriptions)
- Doctor can attach files to records
- Signed upload via server-side API route
- CDN delivery for fast access

### Vector Search (Upstash)

- Stores embeddings of medical knowledge
- Semantic search for relevant context during AI chat
- Enhances GPT responses with domain-specific information

### Email Notifications (Resend)

- Appointment confirmations and reminders
- Password reset emails
- Virtual consultation invitations
- Document upload notifications
- Server-side API route `/api/email`

---

## Role-Based Access

| Role              | Dashboard    | Capabilities                                                                 |
| ----------------- | ------------ | ---------------------------------------------------------------------------- |
| **Patient** | `/patient` | Find doctors, book appointments, AI chat, virtual consults, upload documents |
| **Doctor**  | `/doctor`  | Manage availability, virtual consultations, patient records, settings        |
| **Admin**   | `/admin`   | User management, payment monitoring, system settings                         |

---

## Environment Variables

```env
NEON_DATABASE_URL=       # Neon PostgreSQL connection string
JWT_SECRET=              # Secret for signing JWTs
OPENAI_API_KEY=          # OpenAI API key for GPT models
UPSTASH_VECTOR_URL=      # Upstash vector database URL
UPSTASH_VECTOR_TOKEN=    # Upstash vector auth token
CLOUDINARY_CLOUD_NAME=   # Cloudinary cloud name
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
RESEND_API_KEY=          # Resend API key for email
```

---

## Scripts

```bash
pnpm dev          # Start dev server (port 3000)
pnpm build        # Production build
pnpm db:push      # Push schema to Neon
pnpm db:studio    # Open Drizzle Studio
pnpm db:seed      # Seed database
```
