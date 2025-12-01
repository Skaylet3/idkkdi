# Developer Onboarding Guide

Welcome to the School Assessment Backend project! This guide will help you get up and running quickly, understand the codebase, and start contributing effectively.

## Table of Contents

- [Quick Start](#quick-start)
- [Understanding the Project](#understanding-the-project)
- [Daily Development Workflow](#daily-development-workflow)
- [Common Tasks](#common-tasks)
- [Testing Your Changes](#testing-your-changes)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Getting Help](#getting-help)

---

## Quick Start

### First Time Setup (15 minutes)

1. **Prerequisites Check**
   ```bash
   node --version    # Should be >= 20.x
   pnpm --version    # Should be >= 9.x
   ```

   If you don't have pnpm:
   ```bash
   npm install -g pnpm
   ```

2. **Install Dependencies**
   ```bash
   cd backend
   pnpm install
   ```

3. **Setup Database**

   You have two options:

   **Option A: Use Prisma Cloud Database (Easiest)**
   - Already configured in `.env`
   - No local PostgreSQL needed
   - Just use the existing `DATABASE_URL`

   **Option B: Local PostgreSQL**
   ```bash
   # Install PostgreSQL 16+
   # Create a database
   createdb school_assessment

   # Update .env
   DATABASE_URL="postgresql://your_user:your_password@localhost:5432/school_assessment"
   ```

4. **Initialize Database**
   ```bash
   pnpm prisma migrate dev    # Apply database schema
   pnpm prisma db seed        # Create admin account
   ```

5. **Start Development Server**
   ```bash
   pnpm start:dev
   ```

   You should see:
   ```
   ✅ Database connected
   🚀 Application running on: http://localhost:3000/api
   📚 Swagger documentation: http://localhost:3000/api/docs
   ```

6. **Test It Works**

   Open your browser to: `http://localhost:3000/api/docs`

   Try logging in:
   - Email: `admin@school.com`
   - Password: `Admin@123`

---

## Understanding the Project

### What Does This Backend Do?

This is a REST API for managing school assessments. Think of it like this:

```
Admin (You, initially)
  ├── Creates Schools (e.g., "Lincoln High School")
  ├── Creates Directors (e.g., "Jane Doe" manages Lincoln High)
  └── Creates Assessment Events (e.g., "Q1 Teacher Evaluation")

Director (School Manager)
  ├── Creates Teachers in their school
  └── Views results from their school only

Teacher (School Staff)
  ├── Participates in assessment events
  ├── Answers questions (can be text or multiple choice)
  └── Views their submission history
```

### The Architecture (Don't Panic!)

The code is organized in 4 layers. You'll mostly work in **application** and **presentation**:

```
src/
├── domain/              # Core business logic
│   └── entities/        # What things ARE (User, School, Event, etc.)
│
├── application/         # 👈 YOU'LL WORK HERE MOST
│   ├── schools/         # School management logic
│   ├── teachers/        # Teacher management logic
│   └── events/          # Event & question logic
│
├── infrastructure/      # Database & external services
│   └── database/        # Prisma stuff lives here
│
└── presentation/        # 👈 AND HERE
    └── controllers/     # API endpoints (what users call)
```

**Key Concept**: Each feature (schools, teachers, events) has its own folder with:
- `*.service.ts` - Business logic
- `*.controller.ts` - API endpoints
- `dtos/` - Data validation
- `*.module.ts` - Wires everything together

---

## Daily Development Workflow

### Starting Your Day

```bash
# Pull latest changes
git pull

# Install any new dependencies
pnpm install

# Check database is up to date
pnpm prisma migrate dev

# Start dev server
pnpm start:dev
```

### Making Changes

1. **Find the Feature Folder**

   Want to add a new school endpoint? Look in:
   ```
   src/application/schools/
   src/presentation/controllers/schools.controller.ts
   ```

2. **Understanding the Flow**

   HTTP Request → Controller → Service → Repository → Database

   Example: Creating a school
   ```
   POST /api/schools
     ↓
   schools.controller.ts (validates input)
     ↓
   schools.service.ts (business logic)
     ↓
   school.repository.ts (database save)
     ↓
   PostgreSQL
   ```

3. **Make Your Changes**

   The dev server auto-reloads when you save files!

4. **Test via Swagger**

   Open `http://localhost:3000/api/docs`
   - All endpoints are listed there
   - You can test them directly in the browser

---

## Common Tasks

### Task 1: Add a New API Endpoint

**Example: Add GET endpoint to fetch a single school**

1. **Add to Controller** (`src/presentation/controllers/schools.controller.ts`)
   ```typescript
   @Get(':id')
   @ApiOperation({ summary: 'Get school by ID' })
   async findOne(@Param('id') id: string) {
     return this.schoolsService.findOne(id);
   }
   ```

2. **Add to Service** (`src/application/schools/schools.service.ts`)
   ```typescript
   async findOne(id: string) {
     const school = await this.schoolRepository.findById(id);
     if (!school) {
       throw new NotFoundException('School not found');
     }
     return school;
   }
   ```

3. **Test in Swagger**
   - Go to `http://localhost:3000/api/docs`
   - Find your new endpoint
   - Try it with a school ID

### Task 2: Add a New Database Field

**Example: Add "phone number" to schools**

1. **Update Prisma Schema** (`prisma/schema.prisma`)
   ```prisma
   model School {
     id          String   @id @default(uuid())
     name        String
     address     String?
     phoneNumber String?  // 👈 Add this
     // ... rest of fields
   }
   ```

2. **Create Migration**
   ```bash
   pnpm prisma migrate dev --name add-school-phone
   ```

3. **Update DTO** (`src/application/schools/dtos/create-school.dto.ts`)
   ```typescript
   export class CreateSchoolDto {
     @IsString()
     name: string;

     @IsOptional()
     @IsString()
     phoneNumber?: string;  // 👈 Add this
   }
   ```

4. **Regenerate Prisma Client**
   ```bash
   pnpm prisma generate
   ```

   Now your code has TypeScript types for the new field!

### Task 3: Seed More Test Data

Edit `prisma/seed.ts` and run:
```bash
pnpm prisma db seed
```

The script uses `upsert` so it's safe to run multiple times.

### Task 4: Reset Everything (Fresh Start)

```bash
pnpm prisma migrate reset  # ⚠️ Deletes all data!
pnpm prisma db seed        # Recreate admin account
```

---

## Testing Your Changes

### Manual Testing (Easiest)

1. **Use Swagger UI**
   ```
   http://localhost:3000/api/docs
   ```

   - Click "Authorize" button
   - Login to get a token
   - Test your endpoints

2. **Use curl**
   ```bash
   # Login
   curl -X POST http://localhost:3000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@school.com","password":"Admin@123"}'

   # Copy the token, then use it:
   curl -X GET http://localhost:3000/api/schools \
     -H "Authorization: Bearer YOUR_TOKEN_HERE"
   ```

### Automated Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode (for TDD)
pnpm test:watch

# Run with coverage
pnpm test:cov
```

**Writing Tests** (when you're ready):
- Unit tests go next to the file: `schools.service.spec.ts`
- E2E tests go in: `test/` folder

---

## Troubleshooting

### "Cannot find module @prisma/client"

**Fix:**
```bash
pnpm prisma generate
```

This regenerates the Prisma client after schema changes.

### "Port 3000 is already in use"

**Fix:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or change the port in .env
PORT=3001
```

### "Database connection failed"

**Check:**
1. Is PostgreSQL running? `pg_isready`
2. Is the `DATABASE_URL` in `.env` correct?
3. Can you connect manually? `psql <your-database-url>`

**Quick fix** - Use Prisma Cloud:
```env
DATABASE_URL="postgres://fa1d2548f4b518cfbb2abfe9bf7be4b75e3457aebedab0e3b654dcf5acdb8484:sk_8zuoI1SpHbnaH7TTOesPh@db.prisma.io:5432/postgres?sslmode=require&schema=clean"
```

### "Migration failed"

**Fix:**
```bash
# Reset and start fresh
pnpm prisma migrate reset
pnpm prisma migrate dev
pnpm prisma db seed
```

### "Build errors" after pulling latest code

**Fix:**
```bash
# Clean install
rm -rf node_modules
pnpm install
pnpm prisma generate
pnpm build
```

---

## Best Practices

### Code Style

- **Use TypeScript types** - Let the compiler help you
- **Validate inputs** - Use DTOs with decorators (`@IsString()`, etc.)
- **Handle errors** - Throw proper NestJS exceptions:
  ```typescript
  throw new NotFoundException('User not found');
  throw new BadRequestException('Invalid data');
  throw new UnauthorizedException('Not logged in');
  ```

### Database

- **Always create migrations** - Don't edit the database directly
  ```bash
  pnpm prisma migrate dev --name descriptive-name
  ```

- **Use transactions** for multiple operations:
  ```typescript
  await this.prisma.$transaction([
    this.prisma.school.create(...),
    this.prisma.user.update(...),
  ]);
  ```

### Security

- **Never commit `.env`** - It's in `.gitignore`, keep it that way
- **Hash passwords** - Always use bcrypt:
  ```typescript
  const hashed = await bcrypt.hash(password, 10);
  ```
- **Validate ALL inputs** - Use class-validator decorators

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/add-school-api

# Make changes, commit often
git add .
git commit -m "Add GET endpoint for single school"

# Push and create PR
git push origin feature/add-school-api
```

---

## Common Commands Cheat Sheet

### Development
```bash
pnpm start:dev           # Start dev server (auto-reload)
pnpm build               # Build for production
pnpm start:prod          # Run production build
```

### Database
```bash
pnpm prisma studio       # Open database GUI
pnpm prisma migrate dev  # Create & apply migration
pnpm prisma generate     # Regenerate Prisma Client
pnpm prisma db seed      # Seed database
pnpm prisma migrate reset # ⚠️ Reset database
```

### Code Quality
```bash
pnpm lint                # Run linter
pnpm format              # Format code with Prettier
pnpm test                # Run tests
pnpm test:watch          # Run tests in watch mode
```

---

## Project Conventions

### Naming

- **Files**: `kebab-case.ts` (e.g., `schools.service.ts`)
- **Classes**: `PascalCase` (e.g., `SchoolsService`)
- **Variables**: `camelCase` (e.g., `schoolId`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `MAX_QUESTIONS`)

### Folder Structure

When adding a new feature (e.g., "reports"):

```
src/application/reports/
├── reports.module.ts
├── reports.service.ts
├── reports.service.spec.ts
└── dtos/
    ├── create-report.dto.ts
    └── update-report.dto.ts

src/presentation/controllers/
└── reports.controller.ts
```

### DTO Example Template

```typescript
import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSchoolDto {
  @ApiProperty({ description: 'School name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'School address', required: false })
  @IsOptional()
  @IsString()
  address?: string;
}
```

---

## Understanding Authentication

### How JWT Works Here

1. **User logs in** → Backend returns JWT token
2. **User stores token** → Usually in localStorage/cookies
3. **User makes request** → Sends token in header:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
4. **Backend validates** → Decodes token, checks user role
5. **Access granted/denied** → Based on role permissions

### Testing with Different Roles

```bash
# Login as admin
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.com","password":"Admin@123"}'

# Create a director (admin only)
curl -X POST http://localhost:3000/api/directors \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"director@test.com","password":"Test@123","name":"John Director","schoolId":"<school-id>"}'

# Login as that director
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"director@test.com","password":"Test@123"}'
```

---

## Deployment Notes

### Environment Variables

When deploying to production (Render.com):

```env
DATABASE_URL=<production-postgres-url>
JWT_SECRET=<super-secret-random-string-min-32-chars>
JWT_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

### Pre-Deployment Checklist

- [ ] All tests passing: `pnpm test`
- [ ] Build succeeds: `pnpm build`
- [ ] Migrations committed: `prisma/migrations/`
- [ ] Environment variables set in Render
- [ ] Database seeded (if fresh database)

---

## Useful Resources

### Documentation

- **NestJS Docs**: https://docs.nestjs.com
- **Prisma Docs**: https://www.prisma.io/docs
- **Class Validator**: https://github.com/typestack/class-validator

### Tools

- **Swagger UI**: `http://localhost:3000/api/docs` (when running)
- **Prisma Studio**: `pnpm prisma studio` (database GUI)
- **VS Code Extensions**:
  - Prisma (for `.prisma` files)
  - ESLint
  - Prettier

### Internal Docs

- **Architecture Details**: See `../CLAUDE.md`
- **Technical README**: See `README.md`

---

## Getting Help

### Debugging Steps

1. **Check the logs** - The dev server prints errors
2. **Use Swagger** - Test endpoints in isolation
3. **Check Prisma Studio** - Verify database state
4. **Read the error** - TypeScript errors are helpful!
5. **Check recent changes** - `git diff`

### Common Error Messages

| Error | Meaning | Fix |
|-------|---------|-----|
| `Module not found` | Missing dependency | `pnpm install` |
| `Cannot find module @prisma/client` | Prisma not generated | `pnpm prisma generate` |
| `Unauthorized` | No/invalid JWT token | Login again via `/api/auth/login` |
| `Forbidden` | Wrong role for endpoint | Check role permissions |
| `Validation failed` | Bad request data | Check DTO requirements in Swagger |

### Still Stuck?

1. Search in project documentation (`README.md`, `CLAUDE.md`)
2. Check NestJS/Prisma official docs
3. Look at similar working code in the project
4. Ask the team!

---

## Quick Reference: Role Permissions

| Endpoint | Admin | Director | Teacher |
|----------|-------|----------|---------|
| Create School | ✅ | ❌ | ❌ |
| Create Director | ✅ | ❌ | ❌ |
| Create Teacher | ❌ | ✅ | ❌ |
| Create Event | ✅ | ❌ | ❌ |
| Add Questions | ✅ | ❌ | ❌ |
| Submit Answers | ❌ | ❌ | ✅ |
| View All Schools | ✅ | ❌ | ❌ |
| View Own School | ❌ | ✅ | ❌ |
| View Own History | ❌ | ❌ | ✅ |

---

## First Day Tasks (To Get Familiar)

1. **Start the server** and access Swagger UI
2. **Login as admin** and explore the endpoints
3. **Create a school** via Swagger
4. **Create a director** for that school
5. **Login as the director** (new token)
6. **Create a teacher** (director can only do this)
7. **Login as the teacher** (another new token)
8. **Create an event** as admin with a few questions
9. **Submit answers** as the teacher
10. **View the answers** you just submitted

By the end of this, you'll understand the full user flow!

---

## Welcome Aboard!

Remember:
- **Don't be afraid to break things** in development
- **Ask questions** - there are no stupid questions
- **Read the code** - it's the best documentation
- **Have fun** - coding should be enjoyable!

Happy coding! 🚀
