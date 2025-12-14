# ✨ VartaX — Real-time chat microservices

Tech Stack

| Layer      | Tools Used                                                                                                        |
| ---------- | ----------------------------------------------------------------------------------------------------------------- |
| Frontend   | Next.js (React, TypeScript), Socket.IO client, Axios, Tailwind CSS                                                |
| Backend    | Node.js (TypeScript), Express, Socket.IO, Mongoose (MongoDB), JWT, Multer, Cloudinary, AMQP (amqplib), Nodemailer |
| Database   | MongoDB (via Mongoose)                                                                                            |
| Auth       | JSON Web Tokens (jsonwebtoken)                                                                                    |
| Styling    | Tailwind CSS                                                                                                      |
| Build Tool | Next.js for frontend; `tsc` + Node for backend services                                                           |
| Utilities  | dotenv, axios, redis, js-cookie, sonner                                                                           |

Key Features

- **Real-time chat (Socket.IO)** : Implements bidirectional, low-latency messaging between clients and the chat service using Socket.IO.
  

- **User authentication (JWT)**: Stateless authentication using JSON Web Tokens; tokens created and verified by the user service middleware.

- **Persistent message storage (MongoDB + Mongoose)**: Chats and messages are persisted with Mongoose models.

- **File/image uploads (Cloudinary + Multer)** : Image uploads handled via Multer and stored in Cloudinary.

- **Background email (RabbitMQ + Nodemailer)** : OTP/email send requests are queued and consumed by the mail service using RabbitMQ and `nodemailer`.

- **REST API endpoints for chat flows** : Chat endpoints and controllers implement messaging flows and user lookups.

Architecture Overview

- Microservice layout: a Next.js frontend plus discrete backend services for `user`, `chat`, and `mail`.
- Frontend: serves UI, manages auth state, and connects to the chat service via Socket.IO.
- Chat service: handles socket connections, message persistence (MongoDB), uploads (Cloudinary), and exposes HTTP APIs.
- User service: manages user accounts, authentication, and publishes messages to RabbitMQ when needed.
- Mail service: consumes RabbitMQ queues to send emails (OTP) via SMTP.
- Data flow: frontend → REST/Socket → chat/user services → MongoDB; background tasks via RabbitMQ → mail service.

Configuration & Environment Variables

### List of environment variables referenced in code (use only those in your environment files):

```env
# Frontend (exposed to browser)
NEXT_PUBLIC_USER_SERVICE_URL=
NEXT_PUBLIC_CHAT_SERVICE_URL=

# Shared / Backend
MONGO_URI=
PORT=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# RabbitMQ
RABBITMQ_HOST=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=

# Redis (user service)
REDIS_URL=

# Mail (SMTP)
SMTP_USER=
SMTP_PASS=

# Service discovery used by chat when contacting user service
USER_SERVICE=
```

Getting started (local development)

- Prerequisites: Node.js, npm, and a running MongoDB instance. RabbitMQ required for mail queueing, and a Redis instance for user service features if used.
- Start frontend:

```bash
cd frontend
npm install
npm run dev
```

- Start chat service:

```bash
cd backend/chat
npm install
npm run dev
```

- Start user service:

```bash
cd backend/user
npm install
npm run dev
```

- Start mail service (consumer):

```bash
cd backend/mail
npm install
npm run dev
```

Next steps

- Populate `.env` files for each service with the variables above.
- Consider Docker-compose for local orchestration of MongoDB, RabbitMQ, and Redis.
- Run the services and verify the chat flow between `frontend` and `backend/chat`.

### Folder structure

**Backend (Microservices-based)** : Each service is isolated with its own config, dependencies, and runtime, making the system easier to scale and reason about.

```bash
backend/
```

**Chat Service** : Handles real-time messaging, file uploads, and socket communication.

```bash
backend/chat/

├─ package.json
├─ tsconfig.json
└─ src/
   ├─ index.ts                # Service entry point
   ├─ config/
   │  ├─ db.ts                # Database connection
   │  └─ socket.ts            # Socket.IO setup
   ├─ controllers/
   │  └─ chatController.ts    # Chat-related business logic
   ├─ middlewares/
   │  ├─ isAuth.ts            # Auth guard for protected routes
   │  └─ multer.ts            # File upload handling
   ├─ models/
   │  ├─ ChatModel.ts         # Chat schema
   │  └─ MessagesModel.ts     # Message schema
   ├─ routes/
   │  └─ chat.ts              # Chat API routes
   └─ utils/
      ├─ ApiError.ts          # Centralized error handling
      ├─ ApiResponse.ts       # Standard API response format
      ├─ asyncHandler.ts      # Async error wrapper
      └─ cloudinary.ts        # Media upload utility
```

**Mail Service** : Responsible for async email delivery (OTP, notifications, etc.).

```bash
backend/mail/

├─ package.json
├─ tsconfig.json
└─ src/
   ├─ index.ts                # Service bootstrap
   └─ consumer.ts             # RabbitMQ consumer for email jobs
```

**User Service** : Manages authentication, authorization, and user-related APIs.

```bash
backend/user/


├─ package.json
├─ tsconfig.json
└─ src/
   ├─ index.ts                # Service entry point
   ├─ config/
   │  ├─ db.ts                # Database connection
   │  └─ rabbitmq.ts          # Queue configuration
   ├─ controllers/
   │  └─ userController.ts    # Auth & user logic
   ├─ middleware/
   │  └─ isAuth.ts            # JWT/session validation
   ├─ model/
   │  └─ UserModel.ts         # User schema
   ├─ routes/
   │  └─ routes.ts            # User-related routes
   └─ utils/
      ├─ ApiError.ts
      ├─ ApiResponse.ts
      ├─ asyncHandler.ts
      └─ generateToken.ts     # JWT/token helpers
```

**Frontend (Next.js App Router)**

Client-side application built with a clean separation of routes, components, and shared state.

```bash
frontend/

├─ components.json
├─ eslint.config.mjs
├─ next-env.d.ts
├─ next.config.ts
├─ package.json
├─ postcss.config.mjs
├─ tsconfig.json
├─ public/
└─ src/
```

App Router & Pages

```bash

src/app/
├─ globals.css
├─ layout.tsx                 # Root layout
├─ page.tsx                   # Landing page
├─ chat/page.tsx              # Chat UI
├─ login/page.tsx             # Auth login
├─ profile/page.tsx           # User profile
└─ verify/page.tsx            # OTP verification
```
```bash
Components

Reusable UI and feature-specific components.

src/components/
├─ ChatHeader.tsx
├─ ChatMessages.tsx
├─ ChatSideBar.tsx
├─ MessageInput.tsx
├─ VerifyOtp.tsx
├─ Loading.tsx
└─ ui/                         # Shared UI primitives
   ├─ button.tsx
   ├─ card.tsx
   ├─ input.tsx
   ├─ label.tsx
   ├─ skeleton.tsx
   └─ sonner.tsx

Context & Utilities
src/context/
├─ AppContext.tsx             # Global app state
└─ SocketContext.tsx          # Socket connection provider

src/lib/
└─ utils.ts                   # Shared helper functions
```
