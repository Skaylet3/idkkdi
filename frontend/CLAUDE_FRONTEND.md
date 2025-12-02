# Production-Ready FSD Vite React App - Development Brief

# Packege manager

We use only pnpm and pnpx, don't use npm or npx, you can see scripts in the package json if you need them, don't be shy and don't ask me premission

# Dependencies

Always use the latest versions of whatever you install, use only the best practices to implement the features and so on.

# Tasks

Task is not completed until you tested it, always write the tests to test the task

# New features

If you create a new code look at the project first and find the same functionality, if you found then use it to create the new feature, if not start creating, always check the project for the existing code or functionality.

# best practices

always use the best nowadays practices and the latest nowadays dependencies, don't use outdated stuff, always check if stuff is outdated

## Project Overview
**Goal:** Build a production-grade role-based dashboard system in 1 day using FSD architecture, connecting to an existing deployed backend.

**Tech Stack:**
- **Frontend:** Vite + React + TypeScript
- **Package Manager:** pnpm
- **Routing:** React Router DOM v6
- **State:** Zustand (auth state)
- **Data Fetching:** TanStack Query + OpenAPI-generated TypeScript client
- **UI:** Tailwind CSS + Shadcn/ui
- **Notifications:** Sonner
- **Auth:** Cookie-based JWT (httpOnly cookies from backend)
- **Deployment:** Vercel (free tier)
- **Containerization:** Docker

---

## Backend Integration Context

### Available Backend Endpoints & Roles

**Authentication Flow:**
- JWT stored in httpOnly cookies
- JWT payload contains: `userId`, `role`, `schoolId`
- Three roles: `ADMIN`, `DIRECTOR`, `TEACHER`

**Key Backend Rules:**
1. **ADMIN:** Creates schools and directors
2. **DIRECTOR:** 
   - Auto-assigned to a school
   - Can CRUD teachers (only in their school)
   - JWT contains their `schoolId`
3. **TEACHER:**
   - Auto-assigned to director's school
   - Cannot access `/api/teachers` endpoints (403 Forbidden)
   - JWT contains their `schoolId`

**API Endpoints:**
```
POST   /api/auth/login          (Public - returns user + JWT in cookie)
GET    /api/auth/me             (Protected - get current user from JWT)
POST   /api/auth/logout         (Protected - clears cookie)

POST   /api/schools             (ADMIN only)
GET    /api/schools             (ADMIN only)

POST   /api/directors           (ADMIN only)
GET    /api/directors           (ADMIN only)

POST   /api/teachers            (DIRECTOR only - auto-assigned to their school)
GET    /api/teachers            (DIRECTOR only - sees only their school's teachers)
GET    /api/teachers/:id        (DIRECTOR only)
PATCH  /api/teachers/:id        (DIRECTOR only)
DELETE /api/teachers/:id        (DIRECTOR only)
```

**Security Features:**
- ✅ Role-based access control (RolesGuard)
- ✅ School isolation (directors/teachers see only their school data)
- ✅ Password hashing (bcrypt, 10 rounds)
- ✅ Auto-assignment (teachers → director's school)

---

## Application Pages & Access Control

### 1. Login Page (`/`)
- **Access:** Public
- **Features:**
  - Email/password form
  - Form validation
  - Error handling
  - Redirect to role-specific dashboard on success

### 2. Admin Panel (`/admin`)
- **Access:** ADMIN role only
- **Features:**
  - Create schools
  - Create directors (assign to school)
  - List all schools
  - List all directors

### 3. Director Panel (`/director`)
- **Access:** DIRECTOR role only
- **Features:**
  - View their school info
  - Create teachers (auto-assigned to their school)
  - List teachers (only from their school)
  - Edit teacher details
  - Delete teachers
  - Teacher table with search/filter

### 4. Teacher Panel (`/teacher`)
- **Access:** TEACHER role only
- **Features:**
  - View their profile
  - View their school info
  - Dashboard with basic stats/info
  - (No CRUD operations)

---

## FSD Architecture Structure
```
src/
├── app/
│   ├── providers/
│   │   ├── index.ts                      # Barrel export all providers
│   │   ├── QueryProvider.tsx             # TanStack Query config
│   │   ├── RouterProvider.tsx            # React Router with role-based routes
│   │   └── ToastProvider.tsx             # Sonner toaster setup
│   ├── router/
│   │   ├── index.tsx                     # Main router component
│   │   ├── ProtectedRoute.tsx            # HOC for role-based route protection
│   │   └── routes.config.ts              # Route definitions with role requirements
│   ├── styles/
│   │   └── index.css                     # Tailwind directives + global styles
│   ├── App.tsx                           # Root component with provider composition
│   └── main.tsx                          # Vite entry point
│
├── pages/
│   ├── login/
│   │   ├── ui/
│   │   │   └── LoginPage.tsx             # Login page container
│   │   └── index.ts                      # Public API: export { LoginPage }
│   ├── admin/
│   │   ├── ui/
│   │   │   └── AdminPage.tsx             # Admin dashboard layout
│   │   └── index.ts
│   ├── director/
│   │   ├── ui/
│   │   │   └── DirectorPage.tsx          # Director dashboard with teacher management
│   │   └── index.ts
│   └── teacher/
│       ├── ui/
│       │   └── TeacherPage.tsx           # Teacher dashboard (read-only)
│       └── index.ts
│
├── widgets/
│   ├── header/
│   │   ├── ui/
│   │   │   └── Header.tsx                # Top navigation with user menu + logout
│   │   └── index.ts
│   ├── teacher-list/
│   │   ├── ui/
│   │   │   └── TeacherList.tsx           # Table widget for director's teacher management
│   │   └── index.ts
│   └── school-info/
│       ├── ui/
│       │   └── SchoolInfo.tsx            # Display school details card
│       └── index.ts
│
├── features/
│   ├── auth/
│   │   ├── login/
│   │   │   ├── ui/
│   │   │   │   └── LoginForm.tsx         # Login form with validation (react-hook-form)
│   │   │   ├── model/
│   │   │   │   └── useLogin.ts           # useMutation hook for login
│   │   │   └── index.ts
│   │   └── logout/
│   │       ├── ui/
│   │       │   └── LogoutButton.tsx      # Logout button component
│   │       ├── model/
│   │       │   └── useLogout.ts          # Logout mutation + Zustand clear
│   │       └── index.ts
│   ├── teacher/
│   │   ├── create/
│   │   │   ├── ui/
│   │   │   │   └── CreateTeacherForm.tsx # Modal form to create teacher
│   │   │   ├── model/
│   │   │   │   └── useCreateTeacher.ts   # useMutation with optimistic update
│   │   │   └── index.ts
│   │   ├── edit/
│   │   │   ├── ui/
│   │   │   │   └── EditTeacherForm.tsx   # Modal form to edit teacher
│   │   │   ├── model/
│   │   │   │   └── useUpdateTeacher.ts   # useMutation for PATCH
│   │   │   └── index.ts
│   │   └── delete/
│   │       ├── ui/
│   │       │   └── DeleteTeacherButton.tsx # Confirmation dialog + delete
│   │       ├── model/
│   │       │   │   └── useDeleteTeacher.ts # useMutation for DELETE
│   │       └── index.ts
│   ├── school/
│   │   └── create/
│   │       ├── ui/
│   │       │   └── CreateSchoolForm.tsx  # Admin creates school
│   │       ├── model/
│   │       │   └── useCreateSchool.ts
│   │       └── index.ts
│   └── director/
│       └── create/
│           ├── ui/
│           │   └── CreateDirectorForm.tsx # Admin creates director
│           ├── model/
│           │   └── useCreateDirector.ts
│           └── index.ts
│
├── entities/
│   ├── user/
│   │   ├── model/
│   │   │   ├── store.ts                  # Zustand: { user, role, isAuth, setUser, clearUser }
│   │   │   └── types.ts                  # User, Role enums from backend
│   │   ├── api/
│   │   │   └── userApi.ts                # login(), getCurrentUser(), logout()
│   │   └── index.ts
│   ├── teacher/
│   │   ├── model/
│   │   │   ├── types.ts                  # Teacher interface (from OpenAPI)
│   │   │   └── queries.ts                # Query keys: teacherKeys.all, teacherKeys.detail(id)
│   │   ├── api/
│   │   │   └── teacherApi.ts             # CRUD methods: getTeachers(), createTeacher(), etc.
│   │   ├── ui/
│   │   │   └── TeacherCard.tsx           # Reusable teacher display component
│   │   └── index.ts
│   ├── school/
│   │   ├── model/
│   │   │   └── types.ts                  # School interface
│   │   ├── api/
│   │   │   └── schoolApi.ts              # School CRUD methods
│   │   └── index.ts
│   └── director/
│       ├── model/
│       │   └── types.ts                  # Director interface
│       ├── api/
│       │   └── directorApi.ts            # Director CRUD methods
│       └── index.ts
│
└── shared/
    ├── api/
    │   ├── client.ts                     # Base fetch client with credentials: 'include'
    │   ├── interceptors.ts               # Response interceptor (401/403 → logout)
    │   └── types/
    │       └── generated.ts              # OpenAPI-generated TypeScript types
    ├── lib/
    │   ├── react-query/
    │   │   └── queryClient.ts            # QueryClient config with global error handling
    │   ├── utils/
    │   │   ├── cn.ts                     # Tailwind merge utility (clsx + tailwind-merge)
    │   │   └── validators.ts             # Reusable validation schemas (Zod)
    │   └── constants/
    │       ├── roles.ts                  # Role enum: ADMIN, DIRECTOR, TEACHER
    │       └── queryKeys.ts              # Centralized query key factory
    ├── ui/
    │   ├── button/
    │   │   └── Button.tsx                # Shadcn button component
    │   ├── input/
    │   │   └── Input.tsx                 # Shadcn input component
    │   ├── form/
    │   │   └── Form.tsx                  # Shadcn form components (react-hook-form)
    │   ├── table/
    │   │   └── Table.tsx                 # Shadcn table component
    │   ├── dialog/
    │   │   └── Dialog.tsx                # Shadcn dialog/modal component
    │   ├── card/
    │   │   └── Card.tsx                  # Shadcn card component
    │   └── index.ts                      # Barrel export all UI components
    └── config/
        └── env.ts                        # Environment variables (API_BASE_URL)
```

---

## Success Criteria (Final Checklist)

### Functionality
- [ ] **Authentication**
  - [ ] Login with email/password works
  - [ ] JWT stored in httpOnly cookie
  - [ ] Auto-redirect to role-specific dashboard
  - [ ] Logout clears session and redirects to login
  - [ ] Protected routes block unauthorized access
  - [ ] Page refresh maintains auth state

- [ ] **Admin Panel**
  - [ ] Create schools
  - [ ] View schools list
  - [ ] Create directors and assign to schools
  - [ ] View directors list with school names

- [ ] **Director Panel**
  - [ ] View own school information
  - [ ] Create teachers (auto-assigned to director's school)
  - [ ] View teachers list (only from own school)
  - [ ] Edit teacher details
  - [ ] Delete teachers with confirmation
  - [ ] Table updates in real-time after mutations

- [ ] **Teacher Panel**
  - [ ] View own profile
  - [ ] View school information
  - [ ] Cannot access teacher CRUD endpoints

### Code Quality
- [ ] **TypeScript**
  - [ ] No `any` types (except in rare cases with comments)
  - [ ] All API responses properly typed
  - [ ] Proper interface/type definitions
  - [ ] Type-safe Zustand store

- [ ] **FSD Architecture**
  - [ ] All imports follow layer hierarchy (down only)
  - [ ] No cross-imports between same-layer slices
  - [ ] Public APIs exposed via index.ts
  - [ ] Clear separation: pages → widgets → features → entities → shared

- [ ] **Error Handling**
  - [ ] All API calls wrapped in try/catch
  - [ ] Error boundary catches React errors
  - [ ] User-friendly error messages
  - [ ] Toast notifications for all user actions

- [ ] **Performance**
  - [ ] React Query caching working
  - [ ] Optimistic updates for mutations
  - [ ] No unnecessary re-renders
  - [ ] Lazy loading for routes (optional)

### UX/UI
- [ ] **Design**
  - [ ] Consistent Tailwind spacing/colors
  - [ ] Shadcn components styled consistently
  - [ ] Responsive on mobile (320px+) and desktop
  - [ ] Loading states for all async operations
  - [ ] Empty states for empty lists

- [ ] **Accessibility**
  - [ ] Keyboard navigation works
  - [ ] Focus management in modals
  - [ ] ARIA labels on interactive elements
  - [ ] Color contrast meets WCAG AA

- [ ] **Forms**
  - [ ] Real-time validation feedback
  - [ ] Clear error messages
  - [ ] Disabled submit when invalid
  - [ ] Auto-focus on first field

### DevOps
- [ ] **Docker**
  - [ ] Image builds successfully
  - [ ] App runs in container
  - [ ] Env variables configurable
  - [ ] Image size optimized (<100MB)

- [ ] **Deployment**
  - [ ] Deployed to Vercel
  - [ ] Accessible via HTTPS
  - [ ] Environment variables set
  - [ ] CORS working with backend
  - [ ] No console errors in production

### Security
- [ ] **Auth**
  - [ ] httpOnly cookies (backend handles this)
  - [ ] No sensitive data in localStorage
  - [ ] Logout clears all client state
  - [ ] Protected API routes block unauthorized requests

- [ ] **Data**
  - [ ] No API keys in frontend code
  - [ ] Env variables for all config
  - [ ] Input sanitization on forms
  - [ ] XSS protection (React default + validation)

---

## Environment Variables

Create `.env` file:
```bash
VITE_API_BASE_URL=http://localhost:3000  # or your deployed backend URL
```

For production (Vercel):
```bash
VITE_API_BASE_URL=https://your-backend.com
```

---

## Quick Start Commands
```bash
# Development
pnpm install
pnpm run dev

# Build
pnpm run build
pnpm run preview

# Docker
docker build -t school-app .
docker run -p 3000:80 school-app

# Deploy
git push origin main  # Auto-deploys on Vercel
```

---

## Architecture Decisions & Rationale

### Why FSD?
- **Scalability:** Easy to add new features without refactoring
- **Maintainability:** Clear boundaries prevent spaghetti code
- **Team Collaboration:** Multiple devs can work on different slices independently
- **Testability:** Isolated slices are easier to unit test

### Why TanStack Query?
- **Caching:** Automatic background refetching and stale-while-revalidate
- **Optimistic Updates:** Better UX with instant feedback
- **Devtools:** Built-in debugging tools
- **Server State:** Separates server state from client state

### Why Zustand for Auth?
- **Simplicity:** Minimal boilerplate vs Redux
- **Performance:** No context re-render issues
- **DevTools:** Redux DevTools integration
- **TypeScript:** Excellent TS support

### Why Shadcn?
- **Copy-Paste:** You own the code, not a dependency
- **Customizable:** Full control over styling
- **Accessible:** Built on Radix UI primitives
- **Modern:** Tailwind + CVA pattern

### Why Cookie-Based Auth?
- **Security:** httpOnly cookies prevent XSS attacks
- **Simplicity:** Backend handles refresh token rotation
- **Mobile Friendly:** Works in WebViews and mobile browsers
- **CSRF Protection:** Combine with CSRF tokens if needed

### Why pnpm?
- **Speed:** 2x faster than npm, uses hard links
- **Disk Efficiency:** Saves disk space with global store
- **Strict:** Prevents phantom dependencies
- **Monorepo Ready:** Best-in-class workspace support

---

## Common Pitfalls & Solutions

### Pitfall 1: CORS Issues in Production
**Solution:** Ensure backend allows `credentials: true` and sets proper CORS origin (not wildcard with credentials)

### Pitfall 2: React Query Not Refetching
**Solution:** Ensure proper query key invalidation after mutations:
```typescript
queryClient.invalidateQueries({ queryKey: teacherKeys.all })
```

### Pitfall 3: Zustand State Not Persisting
**Solution:** Don't persist auth state - always hydrate from backend on mount to avoid stale data

### Pitfall 4: Protected Routes Flickering
**Solution:** Show loading spinner in App.tsx while checking auth status on mount

### Pitfall 5: Form Validation Not Triggering
**Solution:** Ensure Zod schema is passed to react-hook-form resolver:
```typescript
const form = useForm({ resolver: zodResolver(loginSchema) })
```

### Pitfall 6: Docker Image Too Large
**Solution:** Use multi-stage build (builder + nginx) to reduce final image size

### Pitfall 7: Vercel Environment Variables Not Working
**Solution:** Prefix with `VITE_` and rebuild after adding env vars in Vercel dashboard

### Pitfall 8: pnpm lockfile conflicts
**Solution:** Always commit `pnpm-lock.yaml` and use `pnpm install --frozen-lockfile` in CI/CD

---

## Resources & Documentation

**FSD:**
- Official Docs: https://feature-sliced.design/
- Examples: https://github.com/feature-sliced/examples

**TanStack Query:**
- Docs: https://tanstack.com/query/latest
- Optimistic Updates: https://tanstack.com/query/latest/docs/react/guides/optimistic-updates

**Shadcn:**
- Components: https://ui.shadcn.com/
- Installation: https://ui.shadcn.com/docs/installation/vite

**Vercel:**
- Deployment Docs: https://vercel.com/docs
- Environment Variables: https://vercel.com/docs/environment-variables

**Docker:**
- Best Practices: https://docs.docker.com/develop/dev-best-practices/
- Multi-stage Builds: https://docs.docker.com/build/building/multi-stage/

**pnpm:**
- Official Docs: https://pnpm.io/
- CLI Commands: https://pnpm.io/cli/install

---

## Developer Context

**Experience Profile:**
- Senior React.js developer
- Beginner React Native developer
- Backend: Nest.js/Express.js experience
- Preferred Framework: React Native with Expo
- Package Manager: pnpm
- Working Style: Asks clarifying questions before implementing
- Development Approach: FSD architecture, best practices, production-ready code

**Communication Protocol:**
- Always ask clarifying questions before implementing
- Focus on architecture decisions and trade-offs
- Explain "why" not just "how"
- Senior-to-senior technical discussions

---

## Final Notes

This is a **production-ready application** designed to be built in **one intensive day**. The architecture is deliberately over-engineered for a prototype to demonstrate:

1. **Scalability:** Can easily add 10+ more features without refactoring
2. **Best Practices:** Real-world patterns used in enterprise applications
3. **Type Safety:** Full TypeScript coverage prevents runtime errors
4. **Performance:** Optimized with caching, optimistic updates, code splitting
5. **Security:** Cookie-based auth, role-based access, input validation

**Success Metric:** Boss sees a polished, professional application that looks like a 2-week project, not a 1-day hack.

**Remember:** The goal is not just to make it work, but to make it production-ready with proper error handling, loading states, and user experience polish. This is the difference between a demo and a deployable product.

**Development Roadmap:** See `ROADMAP.md` for detailed phase-by-phase implementation guide.

Good luck! 🚀