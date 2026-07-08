# HR Management System — Backend

A production-ready REST API for managing employees and vacation requests, built with Node.js, Express, TypeScript, and MongoDB.

**Swagger Docs:** [https://hr-backend-lake.vercel.app/api/docs](https://hr-backend-lake.vercel.app/api/docs)

---

## Features

- **JWT Authentication** — Access & refresh token strategy with secure rotation
- **Role-Based Authorization** — Three-tier RBAC system: `admin`, `hr`, and `employee`
- **Employee CRUD** — Full lifecycle management with pagination, filtering, sorting, and name search
- **Profile Photo Uploads** — Multer + Cloudinary integration for cloud-hosted employee photos
- **Vacation Request Management** — Submit, approve, and reject requests with atomic balance deduction via MongoDB transactions
- **Real-Time Notifications** — Socket.IO events pushed to admins on new requests and to employees on status changes
- **Email Notifications** — Nodemailer + Gmail SMTP sends emails on employee creation and vacation status updates
- **Global Error Handling** — Centralized `AppError` class with structured error responses
- **Request Validation** — Zod schemas enforced at the middleware layer
- **Security Hardening** — Helmet, CORS, dual-tier rate limiting (global + auth), and NoSQL injection protection
- **Structured Logging** — Winston file logs + Morgan HTTP request logging
- **Interactive API Docs** — Swagger UI with JWT bearer authentication support

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js v18+ |
| Framework | Express 4 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| File Uploads | Multer + Cloudinary SDK |
| Real-Time | Socket.IO |
| Email | Nodemailer (Gmail SMTP) |
| Logging | Winston + Morgan |
| Security | Helmet, express-rate-limit, express-mongo-sanitize |
| Documentation | Swagger UI (swagger-jsdoc) |
| Deployment | Vercel |

---

## Project Structure

```
HR-Backend/
├── src/
│   ├── app.ts                        # Express app factory
│   ├── server.ts                     # Server entry point + Socket.IO init
│   ├── api/
│   │   └── v1/
│   │       ├── index.ts              # Mount all v1 routers
│   │       ├── controllers/
│   │       │   ├── auth.controller.ts
│   │       │   ├── employee.controller.ts
│   │       │   └── vacation.controller.ts
│   │       ├── routes/
│   │       │   ├── auth.routes.ts
│   │       │   ├── employee.routes.ts
│   │       │   └── vacation.routes.ts
│   │       ├── services/
│   │       │   ├── auth.service.ts
│   │       │   ├── employee.service.ts
│   │       │   └── vacation.service.ts
│   │       └── validators/
│   │           ├── auth.validator.ts
│   │           ├── employee.validator.ts
│   │           └── vacation.validator.ts
│   ├── shared/
│   │   ├── config/
│   │   │   ├── cloudinary.ts         # Cloudinary SDK config
│   │   │   ├── db.ts                 # Mongoose connection
│   │   │   ├── env.ts                # Typed env loader with startup guards
│   │   │   ├── swagger.ts            # Swagger spec config
│   │   │   └── swaggerUi.ts          # Swagger UI router
│   │   ├── middleware/
│   │   │   ├── authenticate.ts       # JWT guard
│   │   │   ├── authorize.ts          # Role-based access control
│   │   │   ├── errorHandler.ts       # Global error handler
│   │   │   ├── httpLogger.ts         # Morgan + Winston HTTP logger
│   │   │   ├── notFound.ts           # 404 fallback handler
│   │   │   ├── rateLimiter.ts        # Global + auth-specific rate limits
│   │   │   ├── upload.ts             # Multer memory storage middleware
│   │   │   └── validate.ts           # Zod schema middleware
│   │   ├── models/
│   │   │   ├── employee.model.ts
│   │   │   ├── user.model.ts
│   │   │   └── vacation.model.ts
│   │   └── utils/
│   │       ├── appError.ts           # Custom error class
│   │       ├── asyncHandler.ts       # Async route wrapper
│   │       ├── cloudinary.ts         # Cloudinary upload helper
│   │       ├── emailTemplates.ts     # HTML email templates
│   │       ├── generatePassword.ts   # Random password generator
│   │       ├── generateToken.ts      # JWT access & refresh token factory
│   │       ├── httpStatusText.ts     # HTTP status text constants
│   │       ├── logger.ts             # Winston logger instance
│   │       └── sendEmail.ts          # Nodemailer send helper
│   └── sockets/
│       ├── index.ts                  # Socket.IO server factory & getter
│       ├── vacation.events.ts        # Typed event emitters
│       └── vacation.socket.ts        # Connection handler & room logic
├── logs/                             # Auto-generated log files (gitignored)
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── tsconfig.json
└── vercel.json                       # Vercel serverless deployment config
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB replica set — **required** for transactions)
- Gmail account with an [App Password](https://myaccount.google.com/apppasswords) enabled
- Cloudinary account (free tier is sufficient)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/AsmaaElawady/HR-Backend.git
cd HR-Backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in all required values (see section below)

# 4. Run in development mode
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory. All variables marked **required** will cause the server to exit on startup if missing.

```env
# Server
PORT=5000
NODE_ENV=development

# Database (required)
MONGO_URI=your_mongodb_atlas_connection_string

# JWT (required)
JWT_SECRET=your_jwt_secret_min_16_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_min_16_chars
JWT_REFRESH_EXPIRES_IN=7d

# Email — Gmail SMTP (required)
GMAIL_USER=your_gmail_address@gmail.com
GMAIL_PASS=your_gmail_app_password

# Cloudinary — Photo Uploads (required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## How to Run

```bash
# Development — hot reload via nodemon
npm run dev

# Build for production
npm run build

# Run the production build
npm start
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1`. Authentication uses a **Bearer token** in the `Authorization` header.

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Admin | Register a new HR or Admin user |
| POST | `/auth/login` | Public | Login and receive access + refresh tokens |
| POST | `/auth/refresh` | Public | Exchange a refresh token for a new access token |
| GET | `/auth/me` | Any authenticated | Get the currently logged-in user's profile |

### Employees

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/employees` | Any authenticated | List employees with pagination, filtering & sorting |
| POST | `/employees` | Admin | Create a new employee (sends welcome email) |
| GET | `/employees/search?name=` | Any authenticated | Full-text search by employee name |
| GET | `/employees/:id` | Any authenticated | Get a single employee by ID |
| PATCH | `/employees/:id` | Admin, HR, Employee (own) | Update employee fields |
| DELETE | `/employees/:id` | Admin | Permanently delete an employee |
| PATCH | `/employees/:id/photo` | Admin, HR, Employee (own) | Upload or replace profile photo (Cloudinary) |

**List Employees — Query Parameters:**

| Parameter | Type | Values | Description |
|-----------|------|--------|-------------|
| `page` | integer | `1`, `2`, … | Page number (default: 1) |
| `limit` | integer | `1`–`100` | Results per page (default: 10) |
| `gender` | string | `male`, `female` | Filter by gender |
| `maritalStatus` | string | `single`, `married`, `divorced`, `widowed` | Filter by marital status |
| `sortBy` | string | `name`, `salary`, `createdAt` | Sort field |
| `order` | string | `asc`, `desc` | Sort direction |

### Vacations

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/vacations` | Admin, HR, Employee | Submit a vacation request |
| GET | `/vacations/my` | Employee | Get the current employee's own vacation history |
| GET | `/vacations/submitted` | Admin, HR | Get all pending/submitted vacation requests |
| PATCH | `/vacations/:id/approve` | Admin | Approve a request (atomically deducts vacation days) |
| PATCH | `/vacations/:id/reject` | Admin | Reject a vacation request |
| GET | `/vacations/stats` | Admin, HR | Aggregated vacation statistics |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check — returns `{ status: "ok" }` |
| GET | `/api/docs` | Interactive Swagger UI |

---

## Real-Time Events (Socket.IO)

The server emits Socket.IO events over the same HTTP server. Clients connect to the root path and join rooms based on their role.

| Event | Room | Payload | Triggered By |
|-------|------|---------|--------------|
| `vacation:new` | `admins` | `{ message, employeeName, employeeId, vacationId, fromDate, toDate, requestedDays }` | Employee submits a vacation request |
| `vacation:approved` | `employee_<id>` | `{ message, employeeId, vacationId, fromDate, toDate, days }` | Admin approves a request |
| `vacation:rejected` | `employee_<id>` | `{ message, employeeId, vacationId, fromDate, toDate }` | Admin rejects a request |

**Connecting from a client:**

```js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: { token: "your_access_token" }
});

// Admin clients join the "admins" room automatically
// Employee clients join "employee_<their_id>" automatically

socket.on("vacation:approved", (data) => {
  console.log(data.message); // "Your vacation request has been approved"
});
```

---

## Email Notifications

Emails are sent automatically via Gmail SMTP (Nodemailer) in the following scenarios:

| Trigger | Recipient | Content |
|---------|-----------|---------|
| New employee created | Employee's email | Welcome email with login credentials |
| Vacation request approved | Employee's email | Approval confirmation with date details |
| Vacation request rejected | Employee's email | Rejection notice |

---

## API Documentation

Interactive Swagger UI is available at:

| Environment | URL |
|---|---|
| Production | [https://hr-backend-lake.vercel.app/api/docs](https://hr-backend-lake.vercel.app/api/docs) |
| Local | [http://localhost:5000/api/docs](http://localhost:5000/api/docs) |

**To authenticate in Swagger UI:**
1. Call `POST /api/v1/auth/login` to get an access token
2. Click the **Authorize 🔓** button at the top right
3. Enter `Bearer <your_access_token>` and click **Authorize**
4. All subsequent requests will include the token automatically

---

## Role Permissions

| Action | Admin | HR | Employee |
|--------|:-----:|:--:|:--------:|
| Register new users | ✅ | ❌ | ❌ |
| Create employee | ✅ | ❌ | ❌ |
| Read all employees | ✅ | ✅ | ✅ |
| Update any employee | ✅ | ✅ | ❌ |
| Update own profile | ✅ | ✅ | ✅ |
| Upload own photo | ✅ | ✅ | ✅ |
| Delete employee | ✅ | ❌ | ❌ |
| Submit vacation request | ✅ | ✅ | ✅ |
| View own vacations | ✅ | ✅ | ✅ |
| View all submitted vacations | ✅ | ✅ | ❌ |
| Approve / Reject vacation | ✅ | ❌ | ❌ |
| View vacation stats | ✅ | ✅ | ❌ |

---

## Security

| Measure | Implementation |
|---------|---------------|
| Helmet | Sets secure HTTP headers on every response |
| CORS | Configured via `cors` middleware |
| Rate Limiting | Global: 100 req/15 min · Auth routes: 10 req/15 min |
| NoSQL Injection | `express-mongo-sanitize` strips `$` and `.` from user input |
| Password Hashing | `bcryptjs` with a cost factor of 12 |
| JWT Expiry | Short-lived access tokens (15m) + long-lived refresh tokens (7d) |

---

## Deployment

The API is live on Vercel:

```
https://hr-backend-lake.vercel.app
```
