# 🤖 CLAUDE CODE IMPLEMENTATION PLAN - SCHOOL ASSESSMENT BACKEND

## 📋 CRITICAL CONTEXT FOR CLAUDE CODE

**Read this entire section before starting ANY implementation.**

---

### 🎯 PROJECT OVERVIEW

**What we're building:**
A school assessment system backend with 4 roles (Admin, School, Directour, Teacher) where:
- Admin creates schools, directours, events with questions
- Directour creates teachers (only in their school)
- Teacher answers questions in bulk (form submission)
- Directour sees only their school's teacher results

**Tech Stack:**
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL via Neon (serverless)
- **ORM:** Prisma
- **Auth:** JWT with Passport
- **Architecture:** 4-layer clean architecture (Domain, Application, Infrastructure, Presentation)
- **Deployment:** Render (containerized)
- **Development:** Docker + docker-compose

**User's Setup:**
- OS: Windows 11 Home
- Will use Claude Code to implement everything
- Has: Neon account, GitHub repo ready
- Testing: Postman/Thunder Client

---

### 🏗️ ARCHITECTURE PRINCIPLES

**4 Layers (STRICT SEPARATION):**

```
src/
├── domain/              # ZERO external dependencies
│   ├── entities/        # Business objects with identity
│   ├── value-objects/   # Immutable values (e.g., MultipleChoiceOption)
│   ├── repositories/    # Interfaces ONLY (no implementation)
│   └── services/        # Complex business logic
│
├── application/         # Use cases orchestration
│   ├── services/        # Application services (use repositories)
│   ├── dtos/           # Validation with class-validator
│   └── interfaces/      # Application contracts
│
├── infrastructure/      # External integrations
│   ├── database/       # Prisma repositories (implement domain interfaces)
│   ├── auth/           # JWT, Guards, Strategies
│   └── config/         # Environment config
│
└── presentation/        # HTTP/API layer
    ├── controllers/     # REST endpoints
    ├── guards/          # Auth & authorization
    └── decorators/      # Custom decorators (@CurrentUser, @Roles)
```

**Flow:**
```
HTTP Request → Controller → Service → Repository → Prisma → Database
HTTP Response ← Controller ← Service ← Repository ← Prisma ← Database
```

**Critical Rules:**
1. Domain layer NEVER imports from other layers
2. Application layer imports ONLY domain
3. Infrastructure implements domain interfaces
4. Presentation depends on application + infrastructure
5. Always use dependency injection
6. Always validate with DTOs

---

### 📊 COMPLETE DATA MODEL

**Entities (7 total):**

1. **Admin** - Root user, creates schools + directours + events
2. **School** - Container for directours + teachers
3. **Directour** - Manages ONE school, creates teachers
4. **Teacher** - Belongs to ONE school, answers questions
5. **Event** - Global assessment (name, description, questions)
6. **Question** - Belongs to event, type: FREE_TEXT | MULTIPLE_CHOICE
7. **Answer** - Teacher's response to question in event

**Relationships:**
```
Admin (1) ──< (many) School
School (1) ──< (many) Directour
School (1) ──< (many) Teacher
Event (1) ──< (many) Question
Question (1) ──< (many) Answer
Teacher (1) ──< (many) Answer
Event (1) ──< (many) Answer  [tracking participation]
```

**Business Rules (ENFORCE STRICTLY):**
- Admin creates: Schools, Directours, Events, Questions
- Directour creates: Teachers (ONLY in own school - validate JWT.schoolId)
- Teacher submits: ALL answers at once (bulk/transaction)
- One directour = ONE school
- One teacher = ONE school
- Max 50 questions per event
- No answer re-submission (unique constraint)
- Multiple choice options: ['YES', 'NO', '30/70', '70/30', '50/50', 'I_DONT_KNOW']

---

### 🔐 AUTH SYSTEM

**JWT Payload Structure:**
```typescript
{
  userId: string;      // UUID
  email: string;
  role: 'ADMIN' | 'DIRECTOUR' | 'TEACHER';
  schoolId?: string;   // null for admin, set for directour/teacher
}
```

**Permissions Matrix:**

| Action              | Admin | Directour      | Teacher |
|---------------------|-------|----------------|---------|
| Create School       | ✅    | ❌             | ❌      |
| Create Directour    | ✅    | ❌             | ❌      |
| Create Teacher      | ❌    | ✅ (own school)| ❌      |
| Create Event        | ✅    | ❌             | ❌      |
| Answer Questions    | ❌    | ❌             | ✅      |
| View Teacher Results| ✅    | ✅ (own school)| ❌      |

**Security Checklist:**
- [ ] Hash ALL passwords with bcrypt (10 rounds)
- [ ] Validate JWT on every protected route
- [ ] Check role with RolesGuard
- [ ] Validate schoolId matches resource (directour/teacher)
- [ ] Use @UseGuards(JwtAuthGuard, RolesGuard) on controllers
- [ ] Use @Roles('ADMIN') decorator

---

### 📦 COMPLETE PRISMA SCHEMA

**Copy this EXACTLY into `prisma/schema.prisma`:**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  ADMIN
  DIRECTOUR
  TEACHER
}

enum QuestionType {
  FREE_TEXT
  MULTIPLE_CHOICE
}

model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
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
  password  String
  name      String
  schoolId  String
  school    School   @relation(fields: [schoolId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Teacher {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
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
  order     Int
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
  answerText     String?
  selectedOption String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@unique([teacherId, questionId, eventId])
  @@index([teacherId, eventId])
  @@index([eventId])
}
```

---

### 🌱 SEED SCRIPT

**Create `prisma/seed.ts` with this EXACT content:**

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

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

**Add to `package.json`:**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

## 🐳 DOCKER CONFIGURATION

### **Dockerfile (multi-stage)**

**Create `Dockerfile` in project root:**

```dockerfile
# Development stage
FROM node:18-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .

RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci --only=production
RUN npx prisma generate

COPY --from=build /app/dist ./dist

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
```

### **docker-compose.yml**

**Create `docker-compose.yml` in project root:**

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      target: development
    container_name: school-backend-dev
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - .:/app
      - /app/node_modules
      - /app/dist
    depends_on:
      - postgres
    networks:
      - school-network

  postgres:
    image: postgres:15-alpine
    container_name: school-postgres-dev
    restart: unless-stopped
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=school_db
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - school-network

networks:
  school-network:
    driver: bridge

volumes:
  postgres-data:
```

### **.dockerignore**

**Create `.dockerignore` in project root:**

```
node_modules
dist
.git
.gitignore
.env
.env.*
*.md
docker-compose*.yml
Dockerfile
.dockerignore
npm-debug.log
coverage
.vscode
.idea
```

---

## 🚀 30-STEP IMPLEMENTATION PLAN

### **PHASE 1: PROJECT FOUNDATION (Steps 1-5)**

---

#### **STEP 1: Initialize NestJS Project**

**Commands to execute:**
```bash
npx @nestjs/cli new school-assessment-backend
cd school-assessment-backend
```

**When prompted:**
- Package manager: `npm`

**Install dependencies:**
```bash
npm install @prisma/client prisma
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install bcrypt class-validator class-transformer helmet compression
npm install -D @types/bcrypt @types/passport-jwt
```

**Initialize Prisma:**
```bash
npx prisma init
```

**Verification:**
- [ ] `node_modules/` exists
- [ ] `prisma/` folder created
- [ ] `.env` file exists

---

#### **STEP 2: Configure Prisma Schema**

**Action:**
1. Replace entire content of `prisma/schema.prisma` with the schema provided above
2. Update `.env` file:

```env
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/school_db?sslmode=require"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NODE_ENV="development"
PORT=3000
```

**For local Docker development, create `.env.local`:**
```env
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/school_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-at-least-32-characters-long"
NODE_ENV="development"
PORT=3000
```

**Verification:**
- [ ] Schema has all 7 models
- [ ] `.env` has valid DATABASE_URL
- [ ] JWT_SECRET is at least 32 characters

---

#### **STEP 3: Run Initial Migration**

**Commands:**
```bash
npx prisma migrate dev --name init
npx prisma generate
```

**What this does:**
- Creates database tables based on schema
- Generates Prisma Client

**Verification:**
- [ ] `prisma/migrations/` folder created
- [ ] No errors in console
- [ ] `node_modules/.prisma/client` exists

---

#### **STEP 4: Create & Run Seed Script**

**Action:**
1. Create `prisma/seed.ts` with seed script provided above
2. Update `package.json` - add this in the root object:

```json
{
  "name": "school-assessment-backend",
  "version": "0.0.1",
  // ... other fields
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

3. Install ts-node if not present:
```bash
npm install -D ts-node
```

4. Run seed:
```bash
npx prisma db seed
```

**Verification:**
- [ ] Console shows: "✅ Admin created: admin@school.com"
- [ ] Can login with: admin@school.com / Admin@123 (later)

---

#### **STEP 5: Setup Docker**

**Action:**
1. Create `Dockerfile` with content provided above
2. Create `docker-compose.yml` with content provided above
3. Create `.dockerignore` with content provided above

**Start containers:**
```bash
docker-compose up -d
```

**Run migrations in container:**
```bash
docker-compose exec app npx prisma migrate dev --name init
docker-compose exec app npx prisma generate
docker-compose exec app npx prisma db seed
```

**Verification:**
- [ ] `docker ps` shows 2 running containers (app + postgres)
- [ ] `docker-compose logs app` shows no errors
- [ ] App accessible at http://localhost:3000

**Docker commands reference:**
```bash
# View logs
docker-compose logs -f app

# Stop containers
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Execute commands
docker-compose exec app npx prisma studio
docker-compose exec app npm run test

# Clean slate
docker-compose down -v
```

---

### **PHASE 2: INFRASTRUCTURE - AUTH SYSTEM (Steps 6-10)**

---

#### **STEP 6: Create Prisma Service**

**Action:**
Create `src/infrastructure/database/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

**Create `src/infrastructure/database/prisma.module.ts`:**

```typescript
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

**Update `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
  ],
})
export class AppModule {}
```

**Verification:**
- [ ] Files created in correct paths
- [ ] No TypeScript errors
- [ ] App compiles: `npm run start:dev`

---

#### **STEP 7: Create JWT Strategy**

**Action:**
Create `src/infrastructure/auth/jwt.strategy.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  userId: string;
  email: string;
  role: 'ADMIN' | 'DIRECTOUR' | 'TEACHER';
  schoolId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (!payload.userId || !payload.role) {
      throw new UnauthorizedException('Invalid token');
    }
    return payload;
  }
}
```

**Verification:**
- [ ] File created
- [ ] JwtPayload interface exported
- [ ] No TypeScript errors

---

#### **STEP 8: Create Auth Guards**

**Action:**
Create `src/infrastructure/auth/jwt-auth.guard.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

**Create `src/infrastructure/auth/roles.guard.ts`:**

```typescript
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
```

**Verification:**
- [ ] Both guard files created
- [ ] No TypeScript errors

---

#### **STEP 9: Create Custom Decorators**

**Action:**
Create `src/presentation/decorators/roles.decorator.ts`:

```typescript
import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

**Create `src/presentation/decorators/current-user.decorator.ts`:**

```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): JwtPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

**Verification:**
- [ ] Both decorator files created
- [ ] No TypeScript errors

---

#### **STEP 10: Create Auth Module**

**Action:**
Create `src/infrastructure/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '24h' },
      }),
    }),
  ],
  providers: [JwtStrategy, RolesGuard],
  exports: [JwtModule, PassportModule, RolesGuard],
})
export class AuthModule {}
```

**Update `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
  ],
})
export class AppModule {}
```

**Verification:**
- [ ] Auth module created
- [ ] App module updated
- [ ] No errors: `npm run start:dev`

---

### **PHASE 3: DOMAIN LAYER - VALUE OBJECTS (Step 11)**

---

#### **STEP 11: Create Multiple Choice Value Object**

**Action:**
Create `src/domain/value-objects/multiple-choice-option.vo.ts`:

```typescript
export const VALID_MULTIPLE_CHOICE_OPTIONS = [
  'YES',
  'NO',
  '30/70',
  '70/30',
  '50/50',
  'I_DONT_KNOW'
] as const;

export type MultipleChoiceOptionType = typeof VALID_MULTIPLE_CHOICE_OPTIONS[number];

export class MultipleChoiceOption {
  private readonly value: MultipleChoiceOptionType;

  private constructor(value: MultipleChoiceOptionType) {
    this.value = value;
  }

  static create(value: string): MultipleChoiceOption {
    if (!this.isValid(value)) {
      throw new Error(
        `Invalid multiple choice option: ${value}. Valid options: ${VALID_MULTIPLE_CHOICE_OPTIONS.join(', ')}`
      );
    }
    return new MultipleChoiceOption(value as MultipleChoiceOptionType);
  }

  static isValid(value: string): boolean {
    return VALID_MULTIPLE_CHOICE_OPTIONS.includes(value as any);
  }

  getValue(): string {
    return this.value;
  }

  equals(other: MultipleChoiceOption): boolean {
    return this.value === other.value;
  }
}
```

**Verification:**
- [ ] File created
- [ ] VALID_MULTIPLE_CHOICE_OPTIONS exported
- [ ] isValid() method works
- [ ] No TypeScript errors

---

### **PHASE 4: AUTH SERVICE & LOGIN (Steps 12-15)**

---

#### **STEP 12: Create Auth Service**

**Action:**
Create `src/application/auth/auth.service.ts`:

```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    // Try to find user in all three tables
    const admin = await this.prisma.admin.findUnique({ where: { email } });
    const directour = await this.prisma.directour.findUnique({ where: { email } });
    const teacher = await this.prisma.teacher.findUnique({ where: { email } });

    let user: any;
    let role: 'ADMIN' | 'DIRECTOUR' | 'TEACHER';
    let schoolId: string | undefined;

    if (admin) {
      user = admin;
      role = 'ADMIN';
    } else if (directour) {
      user = directour;
      role = 'DIRECTOUR';
      schoolId = directour.schoolId;
    } else if (teacher) {
      user = teacher;
      role = 'TEACHER';
      schoolId = teacher.schoolId;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role,
      schoolId,
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role,
        schoolId,
      },
    };
  }
}
```

**Verification:**
- [ ] File created
- [ ] Service checks all 3 user tables
- [ ] Password verified with bcrypt
- [ ] JWT generated with correct payload
- [ ] No TypeScript errors

---

#### **STEP 13: Create Login DTO**

**Action:**
Create `src/application/auth/dtos/login.dto.ts`:

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
```

**Verification:**
- [ ] File created
- [ ] Decorators from class-validator
- [ ] No TypeScript errors

---

#### **STEP 14: Create Auth Controller**

**Action:**
Create `src/presentation/auth/auth.controller.ts`:

```typescript
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../application/auth/auth.service';
import { LoginDto } from '../../application/auth/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }
}
```

**Verification:**
- [ ] File created
- [ ] POST /auth/login endpoint
- [ ] Returns 200 on success
- [ ] No TypeScript errors

---

#### **STEP 15: Wire Up Auth Module**

**Action:**
Create `src/application/auth/auth.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from '../../presentation/auth/auth.controller';
import { AuthModule as InfraAuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [InfraAuthModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthApplicationModule {}
```

**Update `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AuthApplicationModule } from './application/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AuthApplicationModule,
  ],
})
export class AppModule {}
```

**Update `src/main.ts`:**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // CORS
  app.enableCors();

  // Global prefix
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`🚀 Application running on: http://localhost:${port}/api`);
}
bootstrap();
```

**TEST NOW:**
```bash
# Using curl or Postman
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "Admin@123"
}

# Expected response:
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@school.com",
    "name": "System Administrator",
    "role": "ADMIN",
    "schoolId": null
  }
}
```

**Verification:**
- [ ] Login works with admin credentials
- [ ] JWT token returned
- [ ] Invalid credentials return 401
- [ ] Missing fields return 400 with validation errors

---

### **PHASE 5: ADMIN FEATURES - SCHOOLS (Steps 16-21)**

**Pattern to follow for ALL remaining features:**
```
1. Domain Entity
2. Repository Interface (domain)
3. Repository Implementation (infrastructure)
4. DTOs (application)
5. Service (application)
6. Controller (presentation)
7. Wire up in module
8. Test endpoints
```

---

#### **STEP 16: School Domain Entity**

**Action:**
Create `src/domain/entities/school.entity.ts`:

```typescript
export interface SchoolProps {
  id: string;
  name: string;
  address?: string;
  adminId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class School {
  private constructor(private props: SchoolProps) {}

  static create(props: Omit<SchoolProps, 'id' | 'createdAt' | 'updatedAt'>): School {
    return new School({
      ...props,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: SchoolProps): School {
    return new School(props);
  }

  get id(): string { return this.props.id; }
  get name(): string { return this.props.name; }
  get address(): string | undefined { return this.props.address; }
  get adminId(): string { return this.props.adminId; }

  updateName(name: string): void {
    this.props.name = name;
    this.props.updatedAt = new Date();
  }

  updateAddress(address: string): void {
    this.props.address = address;
    this.props.updatedAt = new Date();
  }

  toJSON() {
    return { ...this.props };
  }
}
```

**Verification:**
- [ ] Entity created with factory methods
- [ ] Getters for all props
- [ ] Update methods change updatedAt
- [ ] No TypeScript errors

---

#### **STEP 17: School Repository Interface**

**Action:**
Create `src/domain/repositories/school.repository.interface.ts`:

```typescript
import { School } from '../entities/school.entity';

export interface ISchoolRepository {
  create(school: School): Promise<School>;
  findById(id: string): Promise<School | null>;
  findAll(): Promise<School[]>;
  update(school: School): Promise<School>;
  delete(id: string): Promise<void>;
}

export const SCHOOL_REPOSITORY = 'SCHOOL_REPOSITORY';
```

**Verification:**
- [ ] Interface defines all CRUD methods
- [ ] Token exported for DI
- [ ] No TypeScript errors

---

#### **STEP 18: School Repository Implementation**

**Action:**
Create `src/infrastructure/database/repositories/school.repository.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ISchoolRepository } from '../../../domain/repositories/school.repository.interface';
import { School } from '../../../domain/entities/school.entity';

@Injectable()
export class SchoolRepository implements ISchoolRepository {
  constructor(private prisma: PrismaService) {}

  async create(school: School): Promise<School> {
    const data = school.toJSON();
    const created = await this.prisma.school.create({
      data: {
        id: data.id,
        name: data.name,
        address: data.address,
        adminId: data.adminId,
      },
    });
    return School.fromPersistence(created);
  }

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    return school ? School.fromPersistence(school) : null;
  }

  async findAll(): Promise<School[]> {
    const schools = await this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return schools.map(s => School.fromPersistence(s));
  }

  async update(school: School): Promise<School> {
    const data = school.toJSON();
    const updated = await this.prisma.school.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
      },
    });
    return School.fromPersistence(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.school.delete({ where: { id } });
  }
}
```

**Verification:**
- [ ] Implements ISchoolRepository
- [ ] Converts between Prisma models and domain entities
- [ ] No TypeScript errors

---

#### **STEP 19: School DTOs**

**Action:**
Create `src/application/schools/dtos/create-school.dto.ts`:

```typescript
import { IsString, IsOptional, MinLength } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @IsOptional()
  address?: string;
}
```

**Create `src/application/schools/dtos/update-school.dto.ts`:**

```typescript
import { IsString, IsOptional, MinLength } from 'class-validator';

export class UpdateSchoolDto {
  @IsString()
  @MinLength(2)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;
}
```

**Verification:**
- [ ] DTOs have validation decorators
- [ ] No TypeScript errors

---

#### **STEP 20: School Service**

**Action:**
Create `src/application/schools/schools.service.ts`:

```typescript
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { ISchoolRepository, SCHOOL_REPOSITORY } from '../../domain/repositories/school.repository.interface';
import { School } from '../../domain/entities/school.entity';
import { CreateSchoolDto } from './dtos/create-school.dto';
import { UpdateSchoolDto } from './dtos/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @Inject(SCHOOL_REPOSITORY)
    private schoolRepository: ISchoolRepository,
  ) {}

  async create(dto: CreateSchoolDto, adminId: string): Promise<School> {
    const school = School.create({
      name: dto.name,
      address: dto.address,
      adminId,
    });
    return this.schoolRepository.create(school);
  }

  async findAll(): Promise<School[]> {
    return this.schoolRepository.findAll();
  }

  async findById(id: string): Promise<School> {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, dto: UpdateSchoolDto): Promise<School> {
    const school = await this.findById(id);
    if (dto.name) school.updateName(dto.name);
    if (dto.address) school.updateAddress(dto.address);
    return this.schoolRepository.update(school);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.schoolRepository.delete(id);
  }
}
```

**Verification:**
- [ ] Service injects repository via interface
- [ ] All CRUD operations implemented
- [ ] Throws NotFoundException when not found
- [ ] No TypeScript errors

---

#### **STEP 21: School Controller**

**Action:**
Create `src/presentation/schools/schools.controller.ts`:

```typescript
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SchoolsService } from '../../application/schools/schools.service';
import { CreateSchoolDto } from '../../application/schools/dtos/create-school.dto';
import { UpdateSchoolDto } from '../../application/schools/dtos/update-school.dto';
import { JwtAuthGuard } from '../../infrastructure/auth/jwt-auth.guard';
import { RolesGuard } from '../../infrastructure/auth/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Controller('schools')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Post()
  async create(
    @Body() dto: CreateSchoolDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.schoolsService.create(dto, user.userId);
  }

  @Get()
  async findAll() {
    return this.schoolsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.schoolsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSchoolDto) {
    return this.schoolsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.schoolsService.delete(id);
  }
}
```

**Create Schools Module `src/application/schools/schools.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from '../../presentation/schools/schools.controller';
import { SchoolRepository } from '../../infrastructure/database/repositories/school.repository';
import { SCHOOL_REPOSITORY } from '../../domain/repositories/school.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SchoolsController],
  providers: [
    SchoolsService,
    {
      provide: SCHOOL_REPOSITORY,
      useClass: SchoolRepository,
    },
  ],
  exports: [SchoolsService],
})
export class SchoolsModule {}
```

**Update `src/app.module.ts`:**

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AuthApplicationModule } from './application/auth/auth.module';
import { SchoolsModule } from './application/schools/schools.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    AuthApplicationModule,
    SchoolsModule,
  ],
})
export class AppModule {}
```

**TEST NOW:**
```bash
# Get JWT token first
POST http://localhost:3000/api/auth/login
{
  "email": "admin@school.com",
  "password": "Admin@123"
}

# Use the token in subsequent requests
# Authorization: Bearer <token>

# Create school
POST http://localhost:3000/api/schools
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Test High School",
  "address": "123 Main St"
}

# List schools
GET http://localhost:3000/api/schools
Authorization: Bearer <your-token>

# Get single school
GET http://localhost:3000/api/schools/{id}
Authorization: Bearer <your-token>

# Update school
PATCH http://localhost:3000/api/schools/{id}
Authorization: Bearer <your-token>
Content-Type: application/json

{
  "name": "Updated School Name"
}

# Delete school
DELETE http://localhost:3000/api/schools/{id}
Authorization: Bearer <your-token>
```

**Verification:**
- [ ] POST creates school (201)
- [ ] GET lists all schools (200)
- [ ] GET /:id returns single school (200)
- [ ] PATCH updates school (200)
- [ ] DELETE removes school (204)
- [ ] Without token: 401 Unauthorized
- [ ] With non-admin token: 403 Forbidden

---

### **PHASE 6-9: REMAINING FEATURES**

**For steps 22-29, follow the EXACT same pattern as Schools (steps 16-21):**

1. Create domain entity
2. Create repository interface
3. Create repository implementation
4. Create DTOs
5. Create service
6. Create controller
7. Create module
8. Add to app.module
9. Test endpoints

---

#### **STEP 22-24: Directours (Admin Feature)**

**Key differences from Schools:**
- **Must hash password** with bcrypt before saving
- Include `schoolId` in CreateDirectourDto
- Validate schoolId exists before creating

**Files to create:**
- `src/domain/entities/directour.entity.ts`
- `src/domain/repositories/directour.repository.interface.ts`
- `src/infrastructure/database/repositories/directour.repository.ts`
- `src/application/directours/dtos/create-directour.dto.ts`
- `src/application/directours/dtos/update-directour.dto.ts`
- `src/application/directours/directours.service.ts`
- `src/presentation/directours/directours.controller.ts`
- `src/application/directours/directours.module.ts`

**Critical: In DirectoursService.create():**
```typescript
const hashedPassword = await bcrypt.hash(dto.password, 10);
const directour = Directour.create({
  ...dto,
  password: hashedPassword,
});
```

---

#### **STEP 25-27: Events & Questions (Admin Feature)**

**Key points:**
- Event can have up to 50 questions
- Questions have `order` field (1, 2, 3...)
- Create event with nested questions in single request

**CreateEventDto structure:**
```typescript
{
  name: string;
  description?: string;
  questions: [
    { text: string; type: 'FREE_TEXT' | 'MULTIPLE_CHOICE'; order: number }
  ];
}
```

**Validation:**
- Max 50 questions
- Question type must be valid
- Order must be unique per event

**Files to create:**
- `src/domain/entities/event.entity.ts`
- `src/domain/entities/question.entity.ts`
- Repository interfaces + implementations for both
- DTOs for create/update
- Services
- Controllers
- Modules

---

#### **STEP 28-29: Teachers (Directour Feature)**

**CRITICAL: Directour can only create teachers in THEIR school**

**In TeachersService.create():**
```typescript
async create(dto: CreateTeacherDto, directourJwtPayload: JwtPayload): Promise<Teacher> {
  // Validate directour's schoolId matches
  if (!directourJwtPayload.schoolId) {
    throw new ForbiddenException('Directour not assigned to school');
  }

  const hashedPassword = await bcrypt.hash(dto.password, 10);
  const teacher = Teacher.create({
    ...dto,
    password: hashedPassword,
    schoolId: directourJwtPayload.schoolId, // AUTO-ASSIGN
  });

  return this.teacherRepository.create(teacher);
}
```

**Controller:**
```typescript
@Controller('teachers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('DIRECTOUR')
export class TeachersController {
  // ...
  
  @Post()
  async create(
    @Body() dto: CreateTeacherDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.teachersService.create(dto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: JwtPayload) {
    // Only teachers from directour's school
    return this.teachersService.findBySchoolId(user.schoolId);
  }
}
```

---

#### **STEP 30: Answers (Teacher Feature) - BULK SUBMISSION**

**This is the most complex feature. Pay close attention.**

**SubmitAnswersDto:**
```typescript
export class SingleAnswerDto {
  @IsUUID()
  questionId: string;

  @IsString()
  @IsOptional()
  answerText?: string;

  @IsEnum(['YES', 'NO', '30/70', '70/30', '50/50', 'I_DONT_KNOW'])
  @IsOptional()
  selectedOption?: string;
}

export class SubmitAnswersDto {
  @IsUUID()
  eventId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SingleAnswerDto)
  answers: SingleAnswerDto[];
}
```

**AnswersService.submitAnswers() logic:**

```typescript
async submitAnswers(dto: SubmitAnswersDto, teacherId: string) {
  // 1. Check if already submitted
  const existingAnswers = await this.prisma.answer.findFirst({
    where: { teacherId, eventId: dto.eventId },
  });
  if (existingAnswers) {
    throw new ConflictException('Already submitted answers for this event');
  }

  // 2. Validate event exists + get questions
  const event = await this.prisma.event.findUnique({
    where: { id: dto.eventId },
    include: { questions: true },
  });
  if (!event) {
    throw new BadRequestException('Event not found');
  }

  // 3. Validate all questionIds belong to event
  const questionIds = event.questions.map(q => q.id);
  const invalidQuestions = dto.answers.filter(a => !questionIds.includes(a.questionId));
  if (invalidQuestions.length > 0) {
    throw new BadRequestException('Some questions do not belong to this event');
  }

  // 4. Validate answer types match question types
  for (const answer of dto.answers) {
    const question = event.questions.find(q => q.id === answer.questionId);
    
    if (question.type === 'FREE_TEXT' && !answer.answerText) {
      throw new BadRequestException(`Question ${question.id} requires text answer`);
    }

    if (question.type === 'MULTIPLE_CHOICE') {
      if (!answer.selectedOption) {
        throw new BadRequestException(`Question ${question.id} requires selected option`);
      }
      if (!MultipleChoiceOption.isValid(answer.selectedOption)) {
        throw new BadRequestException(`Invalid option for question ${question.id}`);
      }
    }
  }

  // 5. Create all answers in transaction
  const createdAnswers = await this.prisma.$transaction(
    dto.answers.map(answer =>
      this.prisma.answer.create({
        data: {
          teacherId,
          questionId: answer.questionId,
          eventId: dto.eventId,
          answerText: answer.answerText,
          selectedOption: answer.selectedOption,
        },
      }),
    ),
  );

  return {
    message: 'Answers submitted successfully',
    count: createdAnswers.length,
    eventId: dto.eventId,
  };
}
```

**Endpoints:**
```
POST /answers/submit - Submit bulk answers
GET /answers/history - My participation history
GET /answers/events/:eventId - My answers for specific event
```

---

### **PHASE 10: PRODUCTION & DEPLOYMENT (Step 31)**

---

#### **STEP 31: Production Setup & Deploy**

**Update `src/main.ts` for production:**

```typescript
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security
  app.use(helmet());
  app.use(compression());   

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  });

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 Application running on: http://localhost:${port}/api`);
}
bootstrap();
```

**Ensure package.json has:**
```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "start:dev": "nest start --watch"
  }
}
```

**Test production build locally:**
```bash
npm run build
npm run start:prod
```

**Create render.yaml (optional):**
```yaml
services:
  - type: web
    name: school-backend
    env: docker
    dockerfilePath: ./Dockerfile
    dockerContext: .
    envVars:
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000
```

**Deploy to Render:**

1. Push to GitHub:
```bash
git add .
git commit -m "Ready for production deployment"
git push origin main
```

2. Go to render.com
3. New Web Service
4. Connect GitHub repo
5. Configure:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
   - Environment Variables:
     - DATABASE_URL (from Neon)
     - JWT_SECRET (min 32 chars)
     - NODE_ENV=production

6. Deploy

**Or use Docker on VPS:**
```bash
# On VPS
git clone <your-repo>
cd school-backend

# Create .env.production
echo "DATABASE_URL=your-neon-url" > .env.production
echo "JWT_SECRET=your-secret" >> .env.production
echo "NODE_ENV=production" >> .env.production

# Build and run
docker build -t school-backend --target production .
docker run -d \
  -p 3000:3000 \
  --env-file .env.production \
  --name school-backend \
  school-backend

# Run migrations
docker exec school-backend npx prisma migrate deploy
docker exec school-backend npx prisma db seed
```

**Verification:**
- [ ] Production build succeeds
- [ ] App runs on production URL
- [ ] All endpoints work
- [ ] Database connected
- [ ] Admin can login
- [ ] Full workflow tested

---

## 🎯 CRITICAL TESTING CHECKLIST

**Test each feature before moving to next:**

### **After Step 15 (Auth):**
- [ ] Login as admin works
- [ ] JWT contains correct payload
- [ ] Invalid credentials rejected

### **After Step 21 (Schools):**
- [ ] Admin can CRUD schools
- [ ] Non-admin gets 403

### **After Directours:**
- [ ] Admin can create directour
- [ ] Password is hashed
- [ ] Directour can login
- [ ] JWT has schoolId

### **After Events:**
- [ ] Admin can create event with questions
- [ ] Max 50 questions enforced
- [ ] Questions ordered correctly

### **After Teachers:**
- [ ] Directour can create teacher
- [ ] Teacher auto-assigned to directour's school
- [ ] Directour sees only their school's teachers

### **After Answers:**
- [ ] Teacher can submit bulk answers
- [ ] Duplicate submission rejected
- [ ] Answer types validated
- [ ] Teacher can view history

### **After Deployment:**
- [ ] Production URL accessible
- [ ] All endpoints work
- [ ] Database persists data

---

## 🔥 CRITICAL REMINDERS FOR CLAUDE CODE

**Always remember:**

1. **Run Prisma generate after schema changes:**
   ```bash
   npx prisma generate
   ```

2. **Run migrations before testing:**
   ```bash
   npx prisma migrate dev --name <name>
   ```

3. **Hash passwords with bcrypt:**
   ```typescript
   const hashed = await bcrypt.hash(password, 10);
   ```

4. **Validate schoolId in JWT for directour/teacher:**
   ```typescript
   if (user.schoolId !== resource.schoolId) {
     throw new ForbiddenException();
   }
   ```

5. **Use transactions for bulk operations:**
   ```typescript
   await this.prisma.$transaction([...]);
   ```

6. **Check for duplicate submissions:**
   ```typescript
   const existing = await this.prisma.answer.findFirst({
     where: { teacherId, eventId }
   });
   if (existing) throw new ConflictException();
   ```

7. **Validate question types match answers:**
   ```typescript
   if (question.type === 'FREE_TEXT' && !answerText) {
     throw new BadRequestException();
   }
   ```

8. **Test after EVERY feature:**
   - Don't move to next feature until current one works
   - Test happy path + error cases
   - Verify role permissions

---

## 📊 IMPLEMENTATION SUMMARY

```
Steps 1-5:   Foundation + Docker
Steps 6-10:  Infrastructure (Prisma + Auth)
Step 11:     Domain (Value Objects)
Steps 12-15: Auth Service (Login)
Steps 16-21: Admin - Schools
Steps 22-24: Admin - Directours
Steps 25-27: Admin - Events & Questions
Steps 28-29: Directour - Teachers
Step 30:     Teacher - Answers (bulk)
Step 31:     Production Deploy
```

**Total Time: 8-11 hours**

---

## ✅ SUCCESS CRITERIA

**MVP is complete when:**

✅ Admin can login
✅ Admin can create schools
✅ Admin can create directours
✅ Admin can create events with questions
✅ Directour can login
✅ Directour can create teachers in their school
✅ Teacher can login
✅ Teacher can submit bulk answers
✅ Teacher can view history
✅ Directour can view teacher results (own school only)
✅ Backend deployed and accessible
✅ All endpoints tested with Postman

---

**NOW IMPLEMENT STEP BY STEP! 🚀**

**Remember: TEST AFTER EACH PHASE. Don't skip ahead.**