# School Assessment Backend API

A production-ready NestJS backend API for managing school assessments, built with Clean Architecture principles, Prisma ORM, and PostgreSQL.

[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-336791?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Multi--stage-2496ED?logo=docker)](https://www.docker.com/)

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Overview

School Assessment Backend is a RESTful API system designed for educational institutions to manage schools, directors, teachers, and event-based assessments. The system implements a hierarchical permission model with three user roles:

- **Admin**: Creates and manages schools, directors, and assessment events
- **Director**: Manages teachers within their assigned school
- **Teacher**: Participates in assessment events by answering questions

### Key Features

- JWT-based authentication with role-based access control (RBAC)
- Multi-school support with isolated data access
- Event-based assessment system with multiple question types
- Bulk answer submission with transaction safety
- Comprehensive Swagger/OpenAPI documentation
- Docker-ready with multi-stage builds
- Production deployment on Render.com

---

## Architecture

The project follows **Clean Architecture** with a strict 4-layer separation:

```
src/
├── domain/              # Core business logic (framework-agnostic)
│   ├── entities/        # Business entities with identity
│   ├── repositories/    # Repository interfaces (contracts)
│   └── value-objects/   # Immutable value objects
│
├── application/         # Use cases & orchestration
│   ├── services/        # Application services
│   └── dtos/            # Data transfer objects
│
├── infrastructure/      # External integrations
│   ├── database/        # Prisma repositories & migrations
│   ├── auth/            # JWT strategies & guards
│   └── config/          # Environment configuration
│
└── presentation/        # HTTP layer
    ├── controllers/     # REST endpoints
    ├── guards/          # Authorization guards
    └── decorators/      # Custom decorators
```

### Design Patterns

- **Repository Pattern**: Abstracts data access through interfaces
- **Dependency Injection**: NestJS built-in IoC container
- **DTO Pattern**: Input validation with class-validator
- **Strategy Pattern**: JWT authentication with Passport
- **Guard Pattern**: Role-based authorization

---

## Tech Stack

### Core Framework
- **NestJS 11.x** - Progressive Node.js framework
- **TypeScript 5.x** - Type-safe development
- **Node.js 20.x** - Runtime environment

### Database & ORM
- **PostgreSQL 16+** - Primary database
- **Prisma 7.x** - Modern ORM with type safety
- **@prisma/adapter-pg** - PostgreSQL adapter for Prisma

### Authentication & Security
- **Passport JWT** - Token-based authentication
- **bcrypt 6.x** - Password hashing
- **Helmet** - Security headers
- **class-validator** - Input validation

### Documentation
- **Swagger/OpenAPI 3.0** - Interactive API docs
- **@nestjs/swagger** - NestJS integration

### DevOps
- **Docker** - Multi-stage containerization
- **pnpm** - Fast, disk-efficient package manager
- **Render.com** - Production hosting

### Testing
- **Jest 30.x** - Unit & integration testing
- **Supertest** - HTTP assertion library
- **ts-jest** - TypeScript support for Jest

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **pnpm** >= 9.x
- **PostgreSQL** >= 16.x (or Prisma Cloud Database)
- **Docker** (optional, for containerized deployment)

### Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Required variables:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   JWT_SECRET="your-secret-key-min-32-characters"
   JWT_EXPIRES_IN="7d"
   NODE_ENV="development"
   PORT=3000
   ```

4. **Run database migrations**
   ```bash
   pnpm prisma migrate dev
   ```

5. **Seed the database**
   ```bash
   pnpm prisma db seed
   ```

   Default admin credentials:
   - Email: `admin@school.com`
   - Password: `Admin@123`

6. **Start development server**
   ```bash
   pnpm start:dev
   ```

   The API will be available at `http://localhost:3000`

---

## API Documentation

### Interactive Documentation

Once the server is running, access the Swagger UI at:

```
http://localhost:3000/api/docs
```

### Authentication Flow

1. **Login** to receive JWT token
   ```bash
   POST /api/auth/login
   Content-Type: application/json

   {
     "email": "admin@school.com",
     "password": "Admin@123"
   }
   ```

2. **Use token** in subsequent requests
   ```bash
   Authorization: Bearer <your-jwt-token>
   ```

### Core Endpoints

| Endpoint | Method | Role | Description |
|----------|--------|------|-------------|
| `/api/auth/login` | POST | Public | Authenticate user |
| `/api/auth/me` | GET | Any | Get current user profile |
| `/api/schools` | POST | Admin | Create school |
| `/api/schools` | GET | Admin | List all schools |
| `/api/directors` | POST | Admin | Create director |
| `/api/teachers` | POST | Director | Create teacher |
| `/api/events` | POST | Admin | Create assessment event |
| `/api/events/:id/questions` | POST | Admin | Add questions to event |
| `/api/answers/submit` | POST | Teacher | Submit answers (bulk) |
| `/api/answers/history` | GET | Teacher | View submission history |

---

## Development

### Available Scripts

```bash
# Development
pnpm start:dev           # Start with hot-reload
pnpm start:debug         # Start with debugging

# Building
pnpm build               # Compile TypeScript to JS

# Database
pnpm prisma migrate dev  # Create & apply migrations
pnpm prisma generate     # Generate Prisma Client
pnpm prisma studio       # Open Prisma Studio GUI
pnpm prisma db seed      # Seed database

# Testing
pnpm test                # Run unit tests
pnpm test:watch          # Run tests in watch mode
pnpm test:cov            # Generate coverage report
pnpm test:e2e            # Run end-to-end tests

# Code Quality
pnpm lint                # Run ESLint
pnpm format              # Format with Prettier
```

### Adding New Features

1. **Define domain entity** in `src/domain/entities/`
2. **Create repository interface** in `src/domain/repositories/`
3. **Implement repository** in `src/infrastructure/database/repositories/`
4. **Create DTOs** in `src/application/*/dtos/`
5. **Build service** in `src/application/*/services/`
6. **Expose controller** in `src/presentation/controllers/`
7. **Register module** in respective `*.module.ts`

### Database Migrations

```bash
# Create migration after schema changes
pnpm prisma migrate dev --name descriptive-name

# Apply migrations in production
pnpm prisma migrate deploy

# Reset database (CAUTION: deletes all data)
pnpm prisma migrate reset
```

---

## Deployment

### Docker Deployment

The project uses a multi-stage Dockerfile optimized for production:

1. **Build the image**
   ```bash
   docker build -t school-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 3000:3000 \
     -e DATABASE_URL="your-db-url" \
     -e JWT_SECRET="your-secret" \
     school-backend
   ```

### Render.com Deployment

The application is production-ready for Render with automatic:
- Prisma Client generation
- Database migrations
- Health checks

**Environment Variables** (set in Render dashboard):
```
DATABASE_URL=<your-postgres-connection-string>
JWT_SECRET=<secure-random-string-min-32-chars>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

**Build Command**:
```bash
pnpm install && pnpm build
```

**Start Command** (automatically handled by Dockerfile):
```bash
pnpm prisma generate && pnpm prisma migrate deploy && node dist/src/main.js
```

### Health Checks

The Dockerfile includes a health check endpoint:
```
GET /api/auth/me
Expected: 401 Unauthorized (proves API is running)
```

---

## Project Structure

```
backend/
├── prisma/
│   ├── migrations/          # Database migration history
│   ├── schema.prisma        # Prisma schema definition
│   ├── seed.ts              # Database seeding script
│   └── prisma.config.ts     # Prisma 7 configuration
│
├── src/
│   ├── domain/              # Business logic layer
│   │   ├── entities/        # User, School, Event, etc.
│   │   └── repositories/    # Repository interfaces
│   │
│   ├── application/         # Use case layer
│   │   ├── schools/         # School management module
│   │   ├── directors/       # Director management
│   │   ├── teachers/        # Teacher management
│   │   ├── events/          # Event & questions
│   │   └── answers/         # Answer submission
│   │
│   ├── infrastructure/      # External services layer
│   │   ├── database/        # Prisma repositories
│   │   │   ├── prisma.service.ts
│   │   │   └── repositories/
│   │   ├── auth/            # JWT & Passport
│   │   │   ├── jwt.strategy.ts
│   │   │   └── guards/
│   │   └── config/          # Environment config
│   │
│   ├── presentation/        # HTTP layer
│   │   ├── controllers/     # REST endpoints
│   │   ├── guards/          # Auth & role guards
│   │   └── decorators/      # Custom decorators
│   │
│   ├── app.module.ts        # Root module
│   └── main.ts              # Application entry point
│
├── test/                    # E2E tests
├── Dockerfile               # Multi-stage Docker build
├── .env                     # Environment variables (local)
├── package.json             # Dependencies & scripts
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

---

## Key Business Rules

- **One admin** can manage multiple schools
- **One director** manages exactly ONE school
- **One teacher** can belong to MULTIPLE schools
- **Events** are global (visible to all schools)
- **Questions** are limited to 50 per event
- **Answers** are submitted in bulk (all at once)
- **One-time submission** - teachers cannot re-submit answers

---

## Database Schema

### Core Entities

```prisma
User (polymorphic: Admin | Director | Teacher)
  ├── role: ADMIN | DIRECTOR | TEACHER
  ├── schoolsAdmin (if ADMIN)
  ├── directorSchools (if DIRECTOR)
  └── teacherSchools (if TEACHER)

School
  ├── admin → User
  ├── directors → DirectorSchool[]
  └── teachers → TeacherSchool[]

Event
  ├── questions → Question[]
  └── answers → Answer[]

Question
  ├── type: FREE_TEXT | MULTIPLE_CHOICE
  ├── event → Event
  └── answers → Answer[]

Answer
  ├── user → User (Teacher)
  ├── question → Question
  ├── event → Event
  └── answerText | selectedOption
```

---

## Contributing

1. Create a feature branch
2. Follow the existing architecture patterns
3. Write tests for new features
4. Ensure `pnpm lint` passes
5. Update documentation as needed

---

## License

This project is private and unlicensed.

---

## Support

For detailed architectural guidance, see [`CLAUDE.md`](../CLAUDE.md) in the project root.

**Tech Stack Documentation**:
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
