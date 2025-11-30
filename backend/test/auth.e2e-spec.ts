import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.setGlobalPrefix('api');

    await app.init();

    prisma = app.get<PrismaService>(PrismaService);

    // Clean database
    await prisma.answer.deleteMany();
    await prisma.question.deleteMany();
    await prisma.event.deleteMany();
    await prisma.teacherSchool.deleteMany();
    await prisma.directorSchool.deleteMany();
    await prisma.school.deleteMany();
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/test/create-admin (POST)', () => {
    it('should create admin account', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/test/create-admin')
        .send({
          email: 'admin@test.com',
          password: 'Admin123!',
          name: 'Test Admin',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('admin@test.com');
      expect(response.body.name).toBe('Test Admin');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-admin')
        .send({
          email: 'admin@test.com',
          password: 'Admin123!',
          name: 'Another Admin',
        })
        .expect(409);
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-admin')
        .send({
          email: 'invalid-email',
          password: 'Admin123!',
          name: 'Test Admin',
        })
        .expect(400);
    });

    it('should fail with short password', async () => {
      await request(app.getHttpServer())
        .post('/api/test/create-admin')
        .send({
          email: 'admin2@test.com',
          password: 'short',
          name: 'Test Admin',
        })
        .expect(400);
    });
  });

  describe('/api/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'Admin123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user).toHaveProperty('userId');
      expect(response.body.user.email).toBe('admin@test.com');
      expect(response.body.user.role).toBe('ADMIN');

      adminToken = response.body.access_token;
    });

    it('should fail with wrong password', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'admin@test.com',
          password: 'WrongPassword',
        })
        .expect(401);
    });

    it('should fail with non-existent email', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@test.com',
          password: 'Admin123!',
        })
        .expect(401);
    });

    it('should fail with invalid email format', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'Admin123!',
        })
        .expect(400);
    });
  });

  describe('/api/auth/me (GET)', () => {
    it('should return current user info with valid token', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.user).toHaveProperty('userId');
      expect(response.body.user.email).toBe('admin@test.com');
      expect(response.body.user.role).toBe('ADMIN');
    });

    it('should fail without token', async () => {
      await request(app.getHttpServer()).get('/api/auth/me').expect(401);
    });

    it('should fail with invalid token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('/api/auth/admin-only (GET)', () => {
    it('should allow access for admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/auth/admin-only')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Admin access granted');
    });

    it('should fail without token', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/admin-only')
        .expect(401);
    });
  });
});
