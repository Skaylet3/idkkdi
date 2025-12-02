# ROADMAP.md - Development Sprint Plan

## Overview
**Timeline:** 1 Day (8-10 hours)
**Goal:** Production-ready FSD React app with role-based dashboards
**Package Manager:** pnpm

---

## Phase 1: Foundation Setup (2 hours)
**Goal:** Project scaffolding, tooling, and base architecture

### Tasks:
1. **Initialize Vite Project**
```bash
   pnpm create vite@latest . -- --template react-ts
   pnpm install
```

2. **Install Dependencies**
```bash
   # Core
   pnpm add react-router-dom zustand @tanstack/react-query
   
   # UI & Styling
   pnpm add tailwindcss postcss autoprefixer
   pnpm add class-variance-authority clsx tailwind-merge
   pnpm add lucide-react sonner
   
   # Forms & Validation
   pnpm add react-hook-form @hookform/resolvers zod
   
   # Dev Tools
   pnpm add -D @tanstack/eslint-plugin-query
```

3. **Setup Tailwind + Shadcn**
```bash
   pnpm dlx tailwindcss init -p
   pnpm dlx shadcn-ui@latest init
   pnpm dlx shadcn-ui@latest add button input form table dialog card
```

4. **Create FSD Folder Structure**
   - Create all directories as per architecture diagram
   - Setup barrel exports (`index.ts`) in each slice

5. **Configure Environment**
   - Create `.env` with `VITE_API_BASE_URL`
   - Setup `shared/config/env.ts` for type-safe env access

### Success Criteria:
- ✅ Project builds without errors
- ✅ Tailwind working (test with a colored div)
- ✅ All FSD folders created with index.ts files
- ✅ Shadcn components accessible from `@/shared/ui`

---

## Phase 2: API Layer & Types (1.5 hours)
**Goal:** OpenAPI integration, API client, and type safety

### Tasks:
1. **Generate OpenAPI Types**
```bash
   # Install codegen tool
   pnpm add -D openapi-typescript-codegen
   
   # Generate types from your backend Swagger
   pnpm dlx openapi-typescript-codegen \
     --input http://YOUR_BACKEND_URL/api-json \
     --output src/shared/api/types \
     --client fetch
```

2. **Create Base API Client** (`shared/api/client.ts`)
   - Setup fetch wrapper with:
     - `credentials: 'include'` for cookies
     - Base URL from env
     - JSON headers
     - TypeScript generics for request/response

3. **Setup API Interceptors** (`shared/api/interceptors.ts`)
   - Response interceptor:
     - 401/403 → clear Zustand auth → redirect to `/login`
     - Network errors → toast error via Sonner
   - Request interceptor (optional): Add CSRF token if needed

4. **Create Entity APIs**
   - `entities/user/api/userApi.ts`:
     - `login(email, password)`
     - `getCurrentUser()`
     - `logout()`
   - `entities/teacher/api/teacherApi.ts`:
     - `getTeachers()`
     - `createTeacher(data)`
     - `updateTeacher(id, data)`
     - `deleteTeacher(id)`
   - `entities/school/api/schoolApi.ts`
   - `entities/director/api/directorApi.ts`

5. **Setup TanStack Query** (`shared/lib/react-query/queryClient.ts`)
   - Configure QueryClient with:
     - `staleTime: 5 * 60 * 1000` (5 minutes)
     - Global `onError` handler → toast
     - Retry logic (retry: 1)

### Success Criteria:
- ✅ TypeScript types auto-generated from Swagger
- ✅ All entity API methods created with proper types
- ✅ Test API call works (e.g., ping /api/auth/me in browser console)
- ✅ QueryClient configured and exported

---

## Phase 3: Auth System (2 hours)
**Goal:** Complete authentication flow with Zustand + protected routes

### Tasks:
1. **Create Zustand Auth Store** (`entities/user/model/store.ts`)
```typescript
   interface AuthState {
     user: User | null
     role: Role | null
     isAuth: boolean
     setUser: (user: User) => void
     clearUser: () => void
   }
```

2. **Build Login Feature** (`features/auth/login/`)
   - `ui/LoginForm.tsx`:
     - React Hook Form with Zod validation
     - Email/password fields
     - Submit button with loading state
   - `model/useLogin.ts`:
     - useMutation for login API call
     - On success → update Zustand store → redirect by role
     - On error → display toast

3. **Build Logout Feature** (`features/auth/logout/`)
   - `ui/LogoutButton.tsx`
   - `model/useLogout.ts`:
     - Call logout API
     - Clear Zustand store
     - Redirect to `/login`

4. **Create ProtectedRoute Component** (`app/router/ProtectedRoute.tsx`)
```typescript
   <ProtectedRoute allowedRoles={['ADMIN', 'DIRECTOR']}>
     <Component />
   </ProtectedRoute>
```
   - Check Zustand `isAuth`
   - Check role matches `allowedRoles`
   - Redirect to `/login` if unauthorized

5. **Setup Router** (`app/router/index.tsx`)
```typescript
   <Routes>
     <Route path="/" element={<LoginPage />} />
     <Route path="/admin" element={
       <ProtectedRoute allowedRoles={['ADMIN']}>
         <AdminPage />
       </ProtectedRoute>
     } />
     {/* ... other protected routes */}
   </Routes>
```

6. **App Initialization** (`app/App.tsx`)
   - On mount: call `getCurrentUser()` API
   - If valid → populate Zustand store
   - If invalid → clear store (stay on login)
   - Show loading spinner during check

### Success Criteria:
- ✅ Login form validates and submits correctly
- ✅ Successful login updates Zustand and redirects to correct dashboard
- ✅ Protected routes block unauthorized access
- ✅ Page refresh maintains auth state (hydrates from backend)
- ✅ Logout clears state and redirects to login

---

## Phase 4: Pages & Widgets (3 hours)
**Goal:** Build all 4 pages with proper layouts and widgets

### Tasks:

#### 4.1 Login Page (`pages/login/`)
- Simple centered layout
- Import `LoginForm` from features
- Redirect logged-in users to their dashboard

#### 4.2 Admin Page (`pages/admin/`)
- Layout with `Header` widget
- Two sections:
  - School Management:
    - `CreateSchoolForm` (feature)
    - List of schools (simple table)
  - Director Management:
    - `CreateDirectorForm` (feature)
    - List of directors (simple table with school name)

#### 4.3 Director Page (`pages/director/`)
- Layout with `Header` widget
- `SchoolInfo` widget (shows director's school)
- Teacher Management section:
  - "Create Teacher" button → opens `CreateTeacherForm` modal
  - `TeacherList` widget (table with edit/delete actions)

#### 4.4 Teacher Page (`pages/teacher/`)
- Layout with `Header` widget
- Profile card (teacher info)
- `SchoolInfo` widget
- Simple dashboard (stats placeholder)

#### 4.5 Header Widget (`widgets/header/`)
- Logo/app name
- User info display (name + role badge)
- `LogoutButton` from features

#### 4.6 TeacherList Widget (`widgets/teacher-list/`)
- Shadcn Table component
- Columns: Name, Email, Created At, Actions
- Actions column:
  - Edit button → opens `EditTeacherForm` modal
  - Delete button → opens confirmation dialog
- Integrates with TanStack Query for data

### Success Criteria:
- ✅ All 4 pages render correctly for their respective roles
- ✅ Header shows correct user info and logout works
- ✅ Admin can see school/director forms and lists
- ✅ Director can see teacher table and create button
- ✅ Teacher sees read-only dashboard
- ✅ Navigation/redirects work correctly

---

## Phase 5: Teacher CRUD Features (2.5 hours)
**Goal:** Complete teacher management functionality for directors

### Tasks:

#### 5.1 Create Teacher Feature (`features/teacher/create/`)
- `ui/CreateTeacherForm.tsx`:
  - Shadcn Dialog component
  - Form fields: name, email, password
  - Validation: email format, password strength
  - Submit button with loading state
- `model/useCreateTeacher.ts`:
  - useMutation calling `teacherApi.createTeacher()`
  - On success:
    - Invalidate `teacherKeys.all` query
    - Toast success message
    - Close modal
  - On error: toast error message

#### 5.2 Edit Teacher Feature (`features/teacher/edit/`)
- `ui/EditTeacherForm.tsx`:
  - Similar to create form (pre-filled with current data)
  - Fields: name, email (no password change for now)
- `model/useUpdateTeacher.ts`:
  - useMutation calling `teacherApi.updateTeacher()`
  - Optimistic update for better UX
  - Invalidate queries on success

#### 5.3 Delete Teacher Feature (`features/teacher/delete/`)
- `ui/DeleteTeacherButton.tsx`:
  - Shadcn AlertDialog for confirmation
  - "Are you sure?" message with teacher name
- `model/useDeleteTeacher.ts`:
  - useMutation calling `teacherApi.deleteTeacher()`
  - Optimistic update (remove from list immediately)
  - Rollback on error

#### 5.4 Teacher Query Hooks (`entities/teacher/model/queries.ts`)
```typescript
export const teacherKeys = {
  all: ['teachers'] as const,
  lists: () => [...teacherKeys.all, 'list'] as const,
  list: (filters: string) => [...teacherKeys.lists(), { filters }] as const,
  details: () => [...teacherKeys.all, 'detail'] as const,
  detail: (id: string) => [...teacherKeys.details(), id] as const,
}

export const useTeachers = () => {
  return useQuery({
    queryKey: teacherKeys.lists(),
    queryFn: teacherApi.getTeachers,
  })
}
```

### Success Criteria:
- ✅ Director can create teacher (auto-assigned to their school)
- ✅ Teacher appears in table immediately (optimistic update)
- ✅ Director can edit teacher name/email
- ✅ Director can delete teacher with confirmation
- ✅ All mutations show loading states and toast messages
- ✅ Table refetches automatically after mutations

---

## Phase 6: Admin Features (1.5 hours)
**Goal:** School and director creation for admin role

### Tasks:

#### 6.1 Create School Feature (`features/school/create/`)
- Form with: name, address (optional)
- useMutation hook
- Success: add to schools list, toast

#### 6.2 Create Director Feature (`features/director/create/`)
- Form with: name, email, password, schoolId (dropdown)
- Fetch schools list for dropdown
- useMutation hook
- Success: add to directors list, toast

#### 6.3 Display Lists
- Simple tables in AdminPage
- Schools table: Name, Address, Created At
- Directors table: Name, Email, School Name, Created At
- Use TanStack Query for data fetching

### Success Criteria:
- ✅ Admin can create schools
- ✅ Admin can create directors and assign to schools
- ✅ Lists display correctly with real-time updates
- ✅ Dropdowns show available schools

---

## Phase 7: Polish & Error Handling (1.5 hours)
**Goal:** Production-ready UX with proper error handling

### Tasks:

1. **Global Error Boundaries**
   - Create `shared/ui/ErrorBoundary.tsx`
   - Wrap App.tsx with error boundary
   - Display friendly error UI

2. **Loading States**
   - Add skeleton loaders to tables (Shadcn Skeleton)
   - Suspense boundaries for lazy-loaded routes
   - Loading spinners on forms

3. **Form Validation Polish**
   - Add inline error messages
   - Field-level validation feedback
   - Disable submit on validation errors

4. **Toast Notifications**
   - Success: green toast with checkmark
   - Error: red toast with error message
   - Info: blue toast for neutral messages

5. **Responsive Design**
   - Test on mobile viewport
   - Adjust table to be horizontally scrollable on small screens
   - Hamburger menu for mobile header (optional)

6. **Empty States**
   - "No teachers yet" message in empty table
   - "Create your first school" CTA for admin

7. **Accessibility**
   - Add ARIA labels to buttons
   - Keyboard navigation for modals
   - Focus management in forms

### Success Criteria:
- ✅ No console errors or warnings
- ✅ All loading states show proper feedback
- ✅ Forms validate correctly with helpful messages
- ✅ Error boundary catches and displays errors gracefully
- ✅ Toasts appear for all user actions
- ✅ Responsive on mobile and desktop

---

## Phase 8: Docker Setup (1 hour)
**Goal:** Containerize the application for consistent deployment

### Tasks:

1. **Create Dockerfile**
```dockerfile
   # Build stage
   FROM node:20-alpine AS builder
   
   # Install pnpm
   RUN corepack enable && corepack prepare pnpm@latest --activate
   
   WORKDIR /app
   
   # Copy package files
   COPY package.json pnpm-lock.yaml ./
   
   # Install dependencies
   RUN pnpm install --frozen-lockfile
   
   # Copy source code
   COPY . .
   
   # Build the app
   RUN pnpm run build
   
   # Production stage
   FROM nginx:alpine
   COPY --from=builder /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/conf.d/default.conf
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
```

2. **Create nginx.conf**
```nginx
   server {
     listen 80;
     server_name localhost;
     root /usr/share/nginx/html;
     index index.html;
     
     location / {
       try_files $uri $uri/ /index.html;
     }
     
     # Cache static assets
     location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
     }
   }
```

3. **Create .dockerignore**
```
   node_modules
   dist
   .env
   .git
   *.log
   pnpm-lock.yaml
```

4. **Create docker-compose.yml** (for local testing)
```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - "3000:80"
       environment:
         - VITE_API_BASE_URL=http://your-backend-url
```

5. **Test Docker Build**
```bash
   docker build -t school-management-app .
   docker run -p 3000:80 school-management-app
```

### Success Criteria:
- ✅ Docker image builds successfully
- ✅ App runs in container and accessible on localhost:3000
- ✅ Env variables properly injected
- ✅ Nginx serves static files correctly
- ✅ SPA routing works (nginx fallback to index.html)

---

## Phase 9: Vercel Deployment (30 minutes)
**Goal:** Deploy to production on Vercel

### Tasks:

1. **Prepare for Deployment**
   - Create `vercel.json`:
```json
     {
       "buildCommand": "pnpm run build",
       "outputDirectory": "dist",
       "framework": "vite",
       "installCommand": "pnpm install",
       "rewrites": [
         { "source": "/(.*)", "destination": "/" }
       ]
     }
```
   - Add environment variable placeholder in Vercel dashboard

2. **Push to GitHub**
```bash
   git init
   git add .
   git commit -m "Initial commit: Production-ready FSD app"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
```

3. **Deploy on Vercel**
   - Go to vercel.com
   - Import GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `pnpm run build`
     - Install Command: `pnpm install`
     - Output Directory: `dist`
     - Environment Variables:
       - `VITE_API_BASE_URL` = your backend URL
   - Deploy

4. **Test Production Build**
   - Test all auth flows
   - Test CRUD operations
   - Test on mobile device
   - Check browser console for errors

5. **Setup Custom Domain** (optional)
   - Add domain in Vercel dashboard
   - Update DNS records

### Success Criteria:
- ✅ App deployed and accessible via Vercel URL
- ✅ All features work in production
- ✅ API calls succeed (CORS configured on backend)
- ✅ No console errors
- ✅ HTTPS working automatically

---

## Post-Launch Optimization (Future Improvements)

### Performance
- [ ] Implement route-based code splitting (`React.lazy`)
- [ ] Add service worker for offline support
- [ ] Optimize bundle size (analyze with `vite-plugin-visualizer`)
- [ ] Implement virtual scrolling for large tables

### Features
- [ ] Add search/filter to teacher table
- [ ] Implement pagination for large datasets
- [ ] Add bulk actions (delete multiple teachers)
- [ ] Email verification for new users
- [ ] Password reset flow
- [ ] User profile editing

### Monitoring
- [ ] Add Sentry for error tracking
- [ ] Implement analytics (Plausible/Umami)
- [ ] Add performance monitoring (Web Vitals)
- [ ] Setup uptime monitoring (UptimeRobot)

### Testing
- [ ] Unit tests for critical features (Vitest)
- [ ] E2E tests for auth flow (Playwright)
- [ ] Visual regression tests (Chromatic)
- [ ] API integration tests

---

## Quick Reference: Time Breakdown

| Phase | Duration | Focus |
|-------|----------|-------|
| 1. Foundation | 2h | Setup, dependencies, FSD structure |
| 2. API Layer | 1.5h | OpenAPI types, fetch client, TanStack Query |
| 3. Auth System | 2h | Zustand store, login/logout, protected routes |
| 4. Pages & Widgets | 3h | All 4 pages, header, layouts |
| 5. Teacher CRUD | 2.5h | Create/edit/delete teachers, optimistic updates |
| 6. Admin Features | 1.5h | School/director creation, lists |
| 7. Polish & Errors | 1.5h | Loading states, toasts, responsive, a11y |
| 8. Docker | 1h | Dockerfile, nginx, testing |
| 9. Deployment | 0.5h | Vercel setup, production testing |
| **Total** | **~15.5h** | **Flexible, can compress to 8-10h** |

---

## Critical Path (Minimum Viable Demo)

If time is limited, focus on this order:

1. **Auth (Phase 3)** - 2h
2. **Director CRUD (Phase 5)** - 2.5h
3. **Basic Pages (Phase 4 partial)** - 1.5h
4. **Deploy (Phase 9)** - 0.5h

**Total MVP:** 6.5 hours for a working demo with authentication and teacher management.

---

## Daily Checkpoint Schedule

**Hour 2:** Foundation complete, Tailwind working
**Hour 3.5:** API layer done, test API call successful
**Hour 5.5:** Auth working, can login/logout
**Hour 8.5:** All pages rendered, navigation works
**Hour 11:** Teacher CRUD complete
**Hour 12.5:** Admin features done
**Hour 14:** Polish complete
**Hour 15:** Docker + Vercel deployed

---

## Emergency Shortcuts (If Behind Schedule)

1. **Skip Docker** - Deploy directly to Vercel (save 1h)
2. **Skip Admin Panel** - Focus on Director/Teacher only (save 1.5h)
3. **Skip Optimistic Updates** - Use basic refetch (save 30min)
4. **Skip Responsive** - Desktop-only first (save 30min)
5. **Skip Empty States** - Basic "No data" text (save 15min)

These shortcuts maintain core functionality while reducing polish.