# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Packege manager

We use only pnpm and pnpx, don't use npm or npx, you can see scripts in the package json if you need them, don't be shy and don't ask me premission

# Dependencies

Always use the latest versions of whatever you install, use only the best practices to implement the features and so on.

# Tasks

Task is not completed until you tested it, always write the tests to test the task

# Seeding

pnpm prisma:seed

# New features

If you create a new code look at the project first and find the same functionality, if you found then use it to create the new feature, if not start creating, always check the project for the existing code or functionality.

# best practices

always use the best nowadays practices and the latest nowadays dependencies, don't use outdated stuff, always check if stuff is outdated

## 📋 PROJECT OVERVIEW

**Goal:** Create a working backend prototype for a school assessment system where admins manage schools, directours manage teachers, and teachers answer event-based questions.

**Timeline:** MVP deployment → then build React (browser) → then React Native (mobile)

**Current Phase:** Backend development with NestJS + deployment

---

## 🏗️ ARCHITECTURE - 4 LAYERED CLEAN ARCHITECTURE

```
📁 src/
├── 📂 domain/              # Pure business logic (no dependencies)
│   ├── entities/           # Business objects with identity
│   ├── value-objects/      # Immutable data without identity
│   ├── repositories/       # Interfaces (contracts)
│   └── services/           # Complex domain logic
│
├── 📂 application/         # Use cases & orchestration
│   ├── services/           # Application services
│   ├── dtos/              # Data transfer objects
│   └── interfaces/        # Application contracts
│
├── 📂 infrastructure/      # External concerns
│   ├── database/          # Prisma repositories
│   ├── auth/              # JWT, Guards, Strategies
│   └── config/            # Configuration
│
└── 📂 presentation/        # HTTP layer
    ├── controllers/       # REST endpoints
    ├── guards/            # Auth & role guards
    └── decorators/        # Custom decorators
```

---

## 🎭 ENTITIES & RELATIONSHIPS

### **Core Entities (6 Total):**

1. **Admin** - Root user, creates schools & directours
2. **School** - Container for directours & teachers
3. **Directour** - Manages ONE school, creates teachers
4. **Teacher** - Belongs to MANY schools, answers questions
5. **Event** - Global assessment container (name, description, questions)
6. **Question** - Belongs to event, has type (FREE_TEXT | MULTIPLE_CHOICE)
7. **Answer** - Teacher's response to question in specific event

### **Relationships:**

```
Admin (1) ──< (many) School
School (1) ──< (many) Directour
School (many) >─< (many) Teacher
Event (1) ──< (many) Question
Question (1) ──< (many) Answer
Teacher (1) ──< (many) Answer
Event (1) ──< (many) Answer [for tracking participation]
```

### **Business Rules:**

- ✅ Admin creates: Schools, Directours, Events, Questions
- ✅ Directour creates: Teachers (ONLY in their own school)
- ✅ Teacher: Answers questions in events (bulk submission)
- ✅ Directour sees: ONLY teachers from their school
- ✅ Events are GLOBAL (all schools see same events)
- ✅ One directour manages ONE school only
- ✅ One teacher can belong to many schools
- ✅ Max 50 questions per event
- ✅ Teacher submits ALL answers at once (bulk form submission)
- ✅ No re-submission allowed (one-time answer per event)

---

## 🔐 AUTH & ROLES SYSTEM

### **JWT Payload Structure:**

```typescript
{
  userId: string,           // UUID of user
  email: string,            // User email
  role: 'ADMIN' | 'DIRECTOUR' | 'TEACHER',
  schoolId?: string         // null for admin, set for directour/teacher
}
```

### **Roles & Permissions Matrix:**

| Action                     | Admin | Directour      | Teacher |
|----------------------------|-------|----------------|---------|
| Create School              | ✅    | ❌             | ❌      |
| Create Directour           | ✅    | ❌             | ❌      |
| Create Teacher             | ❌    | ✅ (own school)| ❌      |
| Create Event               | ✅    | ❌             | ❌      |
| Create Questions           | ✅    | ❌             | ❌      |
| Answer Questions           | ❌    | ❌             | ✅      |
| View All Schools           | ✅    | ❌             | ❌      |
| View Teacher Results       | ✅    | ✅ (own school)| ❌      |
| View Own Answer History    | ❌    | ❌             | ✅      |

### **Auth Implementation:**

- **Strategy:** JWT with Passport
- **Guards:** `JwtAuthGuard` + `RolesGuard`
- **Decorators:** `@Roles('ADMIN')`, `@CurrentUser()`
- **Token Expiry:** 24h (configurable)
- **Password Hashing:** bcrypt (10 rounds)

---

## 📊 COMPLETE PRISMA SCHEMA

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================
// ENUMS
// ============================================

enum Role {
  ADMIN
  DIRECTOUR
  TEACHER
}

enum QuestionType {
  FREE_TEXT
  MULTIPLE_CHOICE
}

// ============================================
// ENTITIES
// ============================================

model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  schools   School[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model School {
  id         String      @id @default(uuid())
  name       String
  address    String?
  adminId    String
  admin      Admin       @relation(fields: [adminId], references: [id], onDelete: Cascade)
  directours Directour[]
  teachers   Teacher[]
  createdAt  DateTime    @default(now())
  updatedAt  DateTime    @updatedAt
}

model Directour {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Teacher {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String   // bcrypt hashed
  name      String
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  answers   Answer[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Event {
  id          String     @id @default(uuid())
  name        String
  description String?
  isActive    Boolean    @default(true)
  questions   Question[]
  answers     Answer[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

model Question {
  id        String       @id @default(uuid())
  text      String
  type      QuestionType
  order     Int          // Display order (1, 2, 3...)
  eventId   String
  event     Event        @relation(fields: [eventId], references: [id], onDelete: Cascade)
  answers   Answer[]
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  @@index([eventId])
}

model Answer {
  id             String   @id @default(uuid())
  teacherId      String
  teacher        Teacher  @relation(fields: [teacherId], references: [id], onDelete: Cascade)
  questionId     String
  question       Question @relation(fields: [questionId], references: [id], onDelete: Cascade)
  eventId        String
  event          Event    @relation(fields: [eventId], references: [id], onDelete: Cascade)
  answerText     String?  // For FREE_TEXT questions
  selectedOption String?  // For MULTIPLE_CHOICE: 'YES', 'NO', '30/70', etc.
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([teacherId, questionId, eventId])
  @@index([teacherId, eventId])
  @@index([eventId])
}
```

---

## 🌱 SEED SCRIPT - INITIAL ADMIN ACCOUNT

```typescript
// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default admin
  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const admin = await prisma.admin.upsert({
    where: { email: 'admin@school.com' },
    update: {},
    create: {
      email: 'admin@school.com',
      password: hashedPassword,
      name: 'System Administrator',
    },
  });

  console.log('✅ Admin created:', admin.email);
  console.log('📧 Email: admin@school.com');
  console.log('🔑 Password: Admin@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Add to package.json:**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

**Run seed:**
```bash
npx prisma db seed
```

---

## 🚀 COMPLETE API ENDPOINTS

### **Authentication:**

```
POST /auth/login
  Body: { email, password }
  Returns: { access_token, user: { id, email, role, schoolId } }
```

### **Admin Endpoints:**

```
# Schools
POST   /schools                    - Create school
GET    /schools                    - List all schools
GET    /schools/:id                - Get school details
PATCH  /schools/:id                - Update school
DELETE /schools/:id                - Delete school

# Directours
POST   /directours                 - Create directour + assign to school
GET    /directours                 - List all directours
GET    /directours/:id             - Get directour details
PATCH  /directours/:id             - Update directour
DELETE /directours/:id             - Delete directour

# Events
POST   /events                     - Create event
GET    /events                     - List all events
GET    /events/:id                 - Get event details
PATCH  /events/:id                 - Update event
DELETE /events/:id                 - Delete event

# Questions
POST   /events/:eventId/questions  - Add questions to event
GET    /events/:eventId/questions  - Get event questions
PATCH  /questions/:id              - Update question
DELETE /questions/:id              - Delete question

# Reports (Admin sees all)
GET    /reports/schools/:schoolId/teachers  - Teachers in school with results
```

### **Directour Endpoints:**

```
# Teachers
POST   /teachers                   - Create teacher in own school
GET    /teachers                   - List teachers in own school
GET    /teachers/:id               - Get teacher details
PATCH  /teachers/:id               - Update teacher
DELETE /teachers/:id               - Delete teacher

# Reports (Directour sees only own school)
GET    /reports/teachers           - All teachers in own school with results
GET    /reports/teachers/:id/events/:eventId  - Teacher's answers for event
```

### **Teacher Endpoints:**

```
# Events
GET    /events                     - List available events
GET    /events/:eventId            - Get event with questions

# Answers
POST   /answers/submit             - Submit bulk answers for event
GET    /answers/history            - My participation history
GET    /answers/events/:eventId    - My answers for specific event
```

---

## 🎯 DEVELOPMENT PRINCIPLES

### **1. Always Start With Domain Layer**
- Define entities with business rules first
- Create repository interfaces (contracts)
- Domain layer has ZERO external dependencies

### **2. Follow the Flow**
```
HTTP Request → Controller → Service → Repository → Database
HTTP Response ← Controller ← Service ← Repository ← Database
```

### **3. Never Skip Validation**
- DTOs validate ALL incoming data
- Domain entities validate business rules
- Repository validates persistence rules

### **4. One Responsibility Per Layer**
- **Domain:** Business logic only
- **Application:** Orchestration & use cases
- **Infrastructure:** External services (DB, auth)
- **Presentation:** HTTP handling

### **5. Always Use Transactions for Multi-Step Operations**
```typescript
await this.prisma.$transaction([
  this.prisma.answer.create(...),
  this.prisma.answer.create(...),
]);
```

### **6. Security First**
- Hash ALL passwords with bcrypt
- Verify JWT on every protected route
- Check role permissions with guards
- Validate schoolId in JWT matches resource access

### **7. Error Handling**
```typescript
// Always throw descriptive errors
throw new NotFoundException('School not found');
throw new ConflictException('Already submitted');
throw new BadRequestException('Invalid data');
```

### **8. Test Each Feature Before Moving On**
- Use Postman/Thunder Client
- Test happy path
- Test error cases
- Verify role permissions

---

## 📝 TESTING CHECKLIST

### **After Auth Module:**
- [ ] Login as admin (admin@school.com / Admin@123)
- [ ] Verify JWT token returned
- [ ] Decode JWT and verify payload structure

### **After Schools:**
- [ ] Admin can create school
- [ ] Admin can list all schools
- [ ] Admin can get school details
- [ ] Admin can update school
- [ ] Admin can delete school
- [ ] Non-admin gets 403 Forbidden

### **After Directours:**
- [ ] Admin can create directour
- [ ] Directour can login
- [ ] JWT contains correct schoolId

### **After Events:**
- [ ] Admin can create event with questions
- [ ] Validate max 50 questions limit
- [ ] Validate question types

### **After Teachers:**
- [ ] Directour can create teacher in their school
- [ ] Teacher can login
- [ ] JWT contains correct schoolId

### **After Answers:**
- [ ] Teacher can submit bulk answers
- [ ] Validate all questions answered
- [ ] Prevent duplicate submissions
- [ ] Teacher can view history
- [ ] Teacher can view specific event answers

### **After Reports:**
- [ ] Directour sees only own school teachers
- [ ] Directour sees teacher results
- [ ] Admin sees all schools

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Prisma schema finalized
- [ ] All migrations run successfully
- [ ] Seed script creates admin account
- [ ] All endpoints tested locally
- [ ] Environment variables configured
- [ ] Build succeeds (`npm run build`)
- [ ] Code pushed to GitHub
- [ ] Render connected to GitHub
- [ ] Database URL configured in Render
- [ ] JWT_SECRET configured in Render
- [ ] First deployment successful
- [ ] Health check endpoint works
- [ ] Test login on production
- [ ] Test one full flow end-to-end

---

## 🔥 CRITICAL REMINDERS FOR CLAUDE CODE

1. **Always run Prisma generate after schema changes**
   ```bash
   npx prisma generate
   ```

2. **Always run migrations before testing**
   ```bash
   npx prisma migrate dev --name <migration-name>
   ```

3. **Always hash passwords before saving**
   ```typescript
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

4. **Always validate schoolId in JWT for directour/teacher actions**
   ```typescript
   if (user.schoolId !== resourceSchoolId) {
     throw new ForbiddenException();
   }
   ```

5. **Always use transactions for bulk operations**
   ```typescript
   await this.prisma.$transaction([...]);
   ```

6. **Always validate question types match answer types**
   ```typescript
   if (question.type === 'FREE_TEXT' && !answerText) {
     throw new BadRequestException();
   }
   ```

7. **Always check for duplicate submissions**
   ```typescript
   const existing = await this.prisma.answer.findFirst({
     where: { teacherId, eventId }
   });
   if (existing) throw new ConflictException();
   ```

---

## 📦 MODULE STRUCTURE TEMPLATE

Every feature should follow this structure:

```typescript
@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [FeatureController],
  providers: [
    FeatureService,
    {
      provide: 'IFeatureRepository',
      useClass: FeatureRepository,
    },
  ],
  exports: [FeatureService],
})
export class FeatureModule {}
```

---

## 🎉 SUCCESS CRITERIA

**MVP is complete when:**

✅ Admin can create schools & directours
✅ Admin can create events with questions
✅ Directour can create teachers in their school
✅ Teacher can submit answers (bulk)
✅ Teacher can view their history
✅ Directour can view teacher results (own school only)
✅ All roles can authenticate
✅ Backend is deployed and accessible
✅ Postman collection tests all endpoints successfully

---

**NOW GO BUILD IT! 🚀**

Let Claude Code handle the implementation following this plan step by step. Test after each phase. Deploy when MVP is complete.