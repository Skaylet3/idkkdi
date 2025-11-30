import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Directors (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let directorToken: string;
  let schoolId: string;
  let directorId: string;

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

    // Create admin and get token
    await request(app.getHttpServer())
      .post('/api/test/create-admin')
      .send({
        email: 'admin@test.com',
        password: 'Admin123!',
        name: 'Test Admin',
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin123!',
      });

    adminToken = loginResponse.body.access_token;

    // Create school
    const schoolResponse = await request(app.getHttpServer())
      .post('/api/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test School',
        address: '123 Main St',
      });

    schoolId = schoolResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/directors (POST)', () => {
    it('should create director as admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'director@test.com',
          password: 'Director123!',
          name: 'Test Director',
          schoolIds: [schoolId],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('director@test.com');
      expect(response.body.name).toBe('Test Director');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body.role).toBe('DIRECTOR');

      directorId = response.body.id;
    });

    it('should allow director to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'director@test.com',
          password: 'Director123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.role).toBe('DIRECTOR');
      expect(response.body.user.schoolId).toBe(schoolId);

      directorToken = response.body.access_token;
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/directors')
        .send({
          email: 'director2@test.com',
          password: 'Director123!',
          name: 'Another Director',
          schoolIds: [schoolId],
        })
        .expect(401);
    });

    it('should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'director@test.com',
          password: 'Director123!',
          name: 'Duplicate Director',
          schoolIds: [schoolId],
        })
        .expect(409);
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email',
          password: 'Director123!',
          name: 'Test Director',
          schoolIds: [schoolId],
        })
        .expect(400);
    });

    it('should fail with non-existent school', async () => {
      await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'director3@test.com',
          password: 'Director123!',
          name: 'Test Director',
          schoolIds: ['00000000-0000-0000-0000-000000000000'],
        })
        .expect(404);
    });

    it('should fail as director (not admin)', async () => {
      await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'director4@test.com',
          password: 'Director123!',
          name: 'Test Director',
          schoolIds: [schoolId],
        })
        .expect(403);
    });
  });

  describe('/api/directors (GET)', () => {
    it('should list all directors as admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer()).get('/api/directors').expect(401);
    });

    it('should fail as director (not admin)', async () => {
      await request(app.getHttpServer())
        .get('/api/directors')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(403);
    });
  });

  describe('/api/directors/:id (GET)', () => {
    it('should get director by id as admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/directors/${directorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(directorId);
      expect(response.body.email).toBe('director@test.com');
      expect(response.body.name).toBe('Test Director');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/directors/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/directors/${directorId}`)
        .expect(401);
    });
  });

  describe('/api/directors/:id (PATCH)', () => {
    it('should update director as admin', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/directors/${directorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Director Name',
        })
        .expect(200);

      expect(response.body.id).toBe(directorId);
      expect(response.body.name).toBe('Updated Director Name');
      expect(response.body.email).toBe('director@test.com');
    });

    it('should update email', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/directors/${directorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'updated-director@test.com',
        })
        .expect(200);

      expect(response.body.email).toBe('updated-director@test.com');
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .patch(`/api/directors/${directorId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .patch('/api/directors/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Name',
        })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/api/directors/${directorId}`)
        .send({
          name: 'New Name',
        })
        .expect(401);
    });
  });

  describe('/api/directors/:id (DELETE)', () => {
    it('should delete director as admin', async () => {
      // Create a director to delete
      const createResponse = await request(app.getHttpServer())
        .post('/api/directors')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'director-to-delete@test.com',
          password: 'Director123!',
          name: 'Director to Delete',
          schoolIds: [schoolId],
        });

      const deleteId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/api/directors/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/directors/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/api/directors/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/directors/${directorId}`)
        .expect(401);
    });
  });
});
