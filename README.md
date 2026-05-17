# HR Management System — Backend

A production-ready REST API for managing employees and vacation requests, built with Node.js, Express, TypeScript, and MongoDB.

---

## Features

- JWT authentication with access & refresh tokens
- Role-based authorization (admin / hr)
- Employee CRUD with pagination, filtering, sorting, and search
- Vacation request management with atomic approval using MongoDB transactions
- Global error handling with custom AppError class
- Request validation using Zod
- Security hardening with Helmet, CORS, rate limiting, and NoSQL injection protection
- Structured logging with Winston and Morgan
- Interactive API documentation with Swagger UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js |
| Framework | Express 4 |
| Language | TypeScript |
| Database | MongoDB + Mongoose |
| Authentication | JWT (jsonwebtoken) |
| Password Hashing | bcryptjs |
| Validation | Zod |
| Logging | Winston + Morgan |
| Security | Helmet, express-rate-limit, express-mongo-sanitize |
| Documentation | Swagger UI (swagger-jsdoc) |

---

## Project Structure

```
HR-Backend/
├── src/
│   ├── app.ts                        # Express app factory
│   ├── server.ts                     # Server entry point
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
│   └── shared/
│       ├── config/
│       │   ├── db.ts                 # Mongoose connection
│       │   ├── env.ts                # Typed env loader
│       │   └── swagger.ts            # Swagger config
│       ├── middleware/
│       │   ├── authenticate.ts       # JWT guard
│       │   ├── authorize.ts          # Role-based access
│       │   ├── errorHandler.ts       # Global error handler
│       │   ├── httpLogger.ts         # Morgan + Winston
│       │   ├── notFound.ts           # 404 handler
│       │   ├── rateLimiter.ts        # Rate limiting
│       │   └── validate.ts           # Zod middleware
│       ├── models/
│       │   ├── employee.model.ts
│       │   ├── user.model.ts
│       │   └── vacation.model.ts
│       └── utils/
│           ├── AppError.ts
│           ├── asyncHandler.ts
│           ├── generateToken.ts
│           ├── httpStatusText.ts
│           └── logger.ts
├── logs/                             # Auto-generated log files
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
└── tsconfig.json
```

---

## Setup & Installation

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB replica set)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/AsmaaElawady/HR-Backend.git
cd HR-Backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Fill in your values in .env

# 4. Run in development mode
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_min_16_chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your_refresh_secret_min_16_chars
JWT_REFRESH_EXPIRES_IN=7d
```

---

## How to Run

```bash
# Development (hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## API Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/auth/register` | Admin | Register a new HR user |
| POST | `/api/v1/auth/login` | Public | Login and get tokens |
| POST | `/api/v1/auth/refresh` | Public | Refresh access token |
| GET | `/api/v1/auth/me` | Auth | Get current user |

### Employees

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/v1/employees` | Auth | List employees (paginated, filtered, sorted) |
| POST | `/api/v1/employees` | Admin | Create new employee |
| GET | `/api/v1/employees/search?name=` | Auth | Search by name |
| GET | `/api/v1/employees/:id` | Auth | Get single employee |
| PATCH | `/api/v1/employees/:id` | Admin, HR | Update employee |
| DELETE | `/api/v1/employees/:id` | Admin | Delete employee |
| PATCH | `/api/v1/employees/:id/photo` | Admin, HR | Upload profile photo |

### Vacations

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/v1/vacations` | Admin, HR | Submit vacation request |
| GET | `/api/v1/vacations/submitted` | Admin, HR | Get all submitted vacations |
| PATCH | `/api/v1/vacations/:id/approve` | Admin | Approve vacation (atomic) |
| PATCH | `/api/v1/vacations/:id/reject` | Admin | Reject vacation |
| GET | `/api/v1/vacations/stats` | Admin, HR | Vacation statistics |

### System

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/docs` | Swagger UI documentation |

---

## API Documentation

Interactive API documentation is available at:

```
http://localhost:5000/api/docs
```

To authenticate in Swagger UI:
1. Call `POST /api/v1/auth/login` to get an access token
2. Click the **Authorize 🔓** button at the top right
3. Paste your access token and click **Authorize**
4. All subsequent requests will include the token automatically

---

## Role Permissions

| Action | Admin | HR |
|--------|-------|----|
| Create employee | ✅ | ❌ |
| Read employees | ✅ | ✅ |
| Update employee | ✅ | ✅ |
| Delete employee | ✅ | ❌ |
| Submit vacation | ✅ | ✅ |
| Approve / Reject vacation | ✅ | ❌ |
| View stats | ✅ | ✅ |
| Register new users | ✅ | ❌ |
