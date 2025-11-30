 📋 What's in the Roadmap:

  Structure:
  - 10 Phases covering all 31 steps
  - Each phase has: action items, file paths, critical notes, test checkpoints
  - Pattern established early: Entity → Repo Interface → Repo Impl → DTOs → Service → Controller → Module

  Key Highlights:
  - ✅ Uses pnpm (as specified in CLAUDE.md)
  - ✅ Critical security rules highlighted (password hashing, JWT validation, schoolId checks)
  - ✅ Testing checkpoints after each phase
  - ✅ Clean architecture principles emphasized
  - ✅ Bulk answer submission logic detailed (most complex feature)
  - ✅ Production deployment options (Render + Docker VPS)

  Quick Reference:
  - Phase 1: Foundation (Prisma, seed, Docker)
  - Phase 2-4: Auth infrastructure & login
  - Phase 5-7: Admin features (Schools, Directours, Events)
  - Phase 8: Directour features (Teachers)
  - Phase 9: Teacher features (Bulk answers)
  - Phase 10: Production deploy

  The roadmap is ready to copy-paste and use as your implementation guide!

────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
 Ready to code?

 Here is Claude's plan:
╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌╌
 🚀 School Assessment Backend - Execution Roadmap

 📋 Overview

 - Goal: Build school assessment system backend with Admin → Directour → Teacher hierarchy
 - Stack: NestJS + Prisma + PostgreSQL (Neon) + JWT + Clean Architecture
 - Package Manager: pnpm (as specified in CLAUDE.md)
 - Total Steps: 31 steps across 10 phases

 ---
 🎯 PHASE 1: FOUNDATION (Steps 1-5)

 Step 1: Initialize Project

 cd backend
 pnpm install @prisma/client prisma @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt
 class-validator class-transformer helmet compression
 pnpm install -D @types/bcrypt @types/passport-jwt ts-node
 npx prisma init
 ✓ Verify: node_modules, prisma folder, .env exist

 Step 2: Configure Prisma

 - Copy complete schema from STEPS.md into prisma/schema.prisma
 - Update .env with Neon DATABASE_URL and JWT_SECRET (32+ chars)
 ✓ Verify: All 7 models in schema, valid .env

 Step 3: Run Migration

 npx prisma migrate dev --name init
 npx prisma generate
 ✓ Verify: prisma/migrations folder created, no errors

 Step 4: Seed Database

 - Create prisma/seed.ts from STEPS.md template
 - Add "prisma": {"seed": "ts-node prisma/seed.ts"} to package.json
 npx prisma db seed
 ✓ Verify: Admin created (admin@school.com / Admin@123)

 Step 5: Docker Setup

 - Create Dockerfile, docker-compose.yml, .dockerignore from STEPS.md
 docker-compose up -d
 docker-compose exec app npx prisma migrate dev --name init
 docker-compose exec app npx prisma db seed
 ✓ Verify: 2 containers running, app on localhost:3000

 ---
 🔐 PHASE 2: INFRASTRUCTURE - AUTH (Steps 6-10)

 Step 6: Prisma Service

 - Create src/infrastructure/database/prisma.service.ts
 - Create src/infrastructure/database/prisma.module.ts
 - Update src/app.module.ts to import PrismaModule + ConfigModule
 ✓ Verify: App compiles with pnpm run start:dev

 Step 7: JWT Strategy

 - Create src/infrastructure/auth/jwt.strategy.ts
 - Export JwtPayload interface: {userId, email, role, schoolId?}
 ✓ Verify: No TypeScript errors

 Step 8: Auth Guards

 - Create src/infrastructure/auth/jwt-auth.guard.ts
 - Create src/infrastructure/auth/roles.guard.ts
 ✓ Verify: Both guards created

 Step 9: Custom Decorators

 - Create src/presentation/decorators/roles.decorator.ts
 - Create src/presentation/decorators/current-user.decorator.ts
 ✓ Verify: No TypeScript errors

 Step 10: Auth Module

 - Create src/infrastructure/auth/auth.module.ts
 - Configure JwtModule with JWT_SECRET from ConfigService
 - Update app.module.ts to import AuthModule
 ✓ Verify: App runs without errors

 ---
 🧱 PHASE 3: DOMAIN VALUE OBJECTS (Step 11)

 Step 11: Multiple Choice Value Object

 - Create src/domain/value-objects/multiple-choice-option.vo.ts
 - Define VALID_MULTIPLE_CHOICE_OPTIONS: ['YES', 'NO', '30/70', '70/30', '50/50', 'I_DONT_KNOW']
 - Implement isValid() static method
 ✓ Verify: Can validate options

 ---
 🔑 PHASE 4: AUTH SERVICE & LOGIN (Steps 12-15)

 Step 12: Auth Service

 - Create src/application/auth/auth.service.ts
 - Implement login(): check admin/directour/teacher tables, verify bcrypt, sign JWT
 ✓ Verify: Service logic complete

 Step 13: Login DTO

 - Create src/application/auth/dtos/login.dto.ts
 - Add @IsEmail, @MinLength(6) validators
 ✓ Verify: DTO with class-validator decorators

 Step 14: Auth Controller

 - Create src/presentation/auth/auth.controller.ts
 - POST /auth/login endpoint with LoginDto
 ✓ Verify: Controller created

 Step 15: Wire Auth Module

 - Create src/application/auth/auth.module.ts (AuthApplicationModule)
 - Update main.ts: add ValidationPipe, CORS, global prefix 'api'
 - Update app.module.ts: import AuthApplicationModule

 🧪 TEST: POST /api/auth/login with admin@school.com / Admin@123
 ✓ Should return access_token + user object with role ADMIN

 ---
 🏫 PHASE 5: ADMIN - SCHOOLS (Steps 16-21)

 Pattern for ALL features: Entity → Repo Interface → Repo Impl → DTOs → Service → Controller → Module

 Steps 16-21: Schools CRUD

 1. Create src/domain/entities/school.entity.ts
 2. Create src/domain/repositories/school.repository.interface.ts (export SCHOOL_REPOSITORY token)
 3. Create src/infrastructure/database/repositories/school.repository.ts
 4. Create DTOs: create-school.dto.ts, update-school.dto.ts
 5. Create src/application/schools/schools.service.ts (inject via SCHOOL_REPOSITORY token)
 6. Create src/presentation/schools/schools.controller.ts (@UseGuards, @Roles('ADMIN'))
 7. Create src/application/schools/schools.module.ts (provide repository with token)
 8. Update app.module.ts: import SchoolsModule

 🧪 TEST: CRUD operations on /api/schools with admin JWT
 ✓ POST creates, GET lists, PATCH updates, DELETE removes (204)

 ---
 👔 PHASE 6: ADMIN - DIRECTOURS (Steps 22-24)

 Steps 22-24: Directours CRUD

 Follow same pattern as Schools with these differences:
 - CRITICAL: Hash password with bcrypt.hash(password, 10) before create
 - Include schoolId in CreateDirectourDto
 - Validate schoolId exists before creating

 Files: directour.entity.ts, directour.repository.interface.ts, directour.repository.ts, DTOs, service, controller,
 module

 🧪 TEST:
 ✓ Admin can create directour with schoolId
 ✓ Password is hashed in database
 ✓ Directour can login, JWT contains schoolId

 ---
 📅 PHASE 7: ADMIN - EVENTS & QUESTIONS (Steps 25-27)

 Steps 25-27: Events with Nested Questions

 - Create event.entity.ts + question.entity.ts
 - Create repositories for both (interfaces + implementations)
 - CreateEventDto: Nested structure with questions array
 - Validation: Max 50 questions, unique order per event, valid QuestionType
 - Service creates event + questions in single transaction

 Files: event.entity.ts, question.entity.ts, repositories, DTOs, services, controllers, modules

 🧪 TEST:
 ✓ Admin creates event with multiple questions
 ✓ Max 50 questions enforced
 ✓ Questions have order field (1, 2, 3...)

 ---
 👨‍🏫 PHASE 8: DIRECTOUR - TEACHERS (Steps 28-

 Steps 28-29: Teachers (Directour creates)

 CRITICAL: Directour can only create teachers in THEIR school

 - In TeachersService.create():
   - Validate directour has schoolId in JWT
   - Hash password with bcrypt
   - Auto-assign teacher.schoolId = directour.schoolId (from JWT)
 - In TeachersController:
   - @Roles('DIRECTOUR')
   - findAll() filters by user.schoolId (only their school's teachers)

 Files: teacher.entity.ts, teacher.repository.interface.ts, teacher.repository.ts, DTOs, service, controller, module

 🧪 TEST:
 ✓ Directour creates teacher (auto-assigned to their school)
 ✓ Teacher can login, JWT has correct schoolId
 ✓ Directour sees only their school's teachers

 ---
 📝 PHASE 9: TEACHER - ANSWERS (Step 30)

 Step 30: Bulk Answer Submission

 Most complex feature - bulk submission with validation

 SubmitAnswersDto:
 {
   eventId: string,
   answers: [
     { questionId: string, answerText?: string, selectedOption?: string }
   ]
 }

 AnswersService.submitAnswers() validation:
 1. Check if already submitted (ConflictException)
 2. Validate event exists + fetch questions
 3. Validate all questionIds belong to event
 4. Validate answer types match question types (FREE_TEXT needs text, MULTIPLE_CHOICE needs option)
 5. Validate multiple choice options with MultipleChoiceOption.isValid()
 6. Create all answers in Prisma transaction

 Additional methods:
 - getMyHistory(): Teacher's participation history
 - getEventAnswers(): Teacher's answers for specific event

 Files: answer.entity.ts, answer.repository (if using clean arch), answers.service.ts, submit-answers.dto.ts,
 answers.controller.ts, answers.module.ts

 🧪 TEST:
 ✓ Teacher submits bulk answers for event
 ✓ Duplicate submission rejected (409)
 ✓ Answer types validated correctly
 ✓ Teacher views history (all events participated)

 ---
 🚀 PHASE 10: PRODUCTION (Step 31)

 Step 31: Production Setup & Deploy

 Update main.ts:
 - Add helmet(), compression()
 - Configure CORS with FRONTEND_URL
 - Listen on '0.0.0.0'

 Test production build:
 pnpm run build
 pnpm run start:prod

 Deploy to Render:
 1. Push to GitHub
 2. Create Web Service on Render
 3. Connect repo
 4. Set env vars: DATABASE_URL (Neon), JWT_SECRET, NODE_ENV=production
 5. Build: pnpm install && pnpm run build
 6. Start: pnpm run start:prod

 Or Docker on VPS:
 docker build -t school-backend --target production .
 docker run -d -p 3000:3000 --env-file .env.production school-backend
 docker exec school-backend npx prisma migrate deploy

 🧪 FINAL TEST:
 ✓ Production URL accessible
 ✓ All endpoints work
 ✓ Full workflow: Admin creates school → directour → teacher → event → teacher answers

 ---
 ⚠️ CRITICAL RULES

 Security:
 - Hash ALL passwords: bcrypt.hash(password, 10)
 - Validate schoolId in JWT for directour/teacher operations
 - Use @UseGuards(JwtAuthGuard, RolesGuard) + @Roles()
 - No API endpoint without auth (except /auth/login)

 Data Integrity:
 - Use transactions for bulk operations: prisma.$transaction([...])
 - Validate question types match answer types
 - Check duplicate submissions before creating answers
 - Enforce max 50 questions per event

 Clean Architecture:
 - Domain layer: ZERO external dependencies
 - Application layer: imports only domain
 - Infrastructure: implements domain interfaces
 - Always use dependency injection with tokens

 Testing:
 - Test AFTER EACH PHASE (don't skip ahead)
 - Verify happy path + error cases
 - Check role permissions (401/403 errors)
 - Use Postman/Thunder Client

 ---
 📊 EXECUTION SUMMARY

 Steps 1-5:   Foundation (Prisma, seed, Docker)
 Steps 6-10:  Infrastructure (Auth system)
 Step 11:     Domain (Value objects)
 Steps 12-15: Auth service (Login works)
 Steps 16-21: Schools (Admin CRUD)
 Steps 22-24: Directours (Admin creates)
 Steps 25-27: Events + Questions (Admin creates)
 Steps 28-29: Teachers (Directour creates in own school)
 Step 30:     Answers (Teacher bulk submission)
 Step 31:     Production deploy

 Estimated Time: 8-11 hours total

 ---
 ✅ SUCCESS CRITERIA

 - Admin login works
 - Admin creates schools, directours, events with questions
 - Directour login works, JWT has schoolId
 - Directour creates teachers (auto-assigned to their school)
 - Directour sees only their school's teachers
 - Teacher login works, JWT has schoolId
 - Teacher submits bulk answers (one-time only)
 - Teacher views participation history
 - Backend deployed and accessible
 - All endpoints tested with real data

 ---
 Ready to implement! Follow steps 1-31 sequentially. Test after each phase.