Answer me each time when you create your plan like this:

Use this as an example: ● 🎯 FIRST STEP: Install Dependencies

  What to do:
  cd backend
  pnpm install @prisma/client prisma @nestjs/jwt @nestjs/passport passport passport-jwt bcrypt class-validator
  class-transformer
  pnpm install -D @types/bcrypt @types/passport-jwt ts-node
  pnpx prisma init

  Why:
  - Nothing is installed yet (no Prisma, no JWT, no bcrypt)
  - Everything else needs these packages
  - Creates prisma/ folder and .env file

  That's it. After this, you can do Step 2 (configure Prisma schema).