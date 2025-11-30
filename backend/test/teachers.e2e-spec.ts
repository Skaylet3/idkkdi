import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Teachers (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let directorToken: string;
  let teacherToken: string;
  let schoolId: string;
  let teacherId: string;

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

    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin123!',
      });

    adminToken = adminLogin.body.access_token;

    // Create school
    const schoolResponse = await request(app.getHttpServer())
      .post('/api/schools')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test School',
        address: '123 Main St',
      });

    schoolId = schoolResponse.body.id;

    // Create director and get token
    await request(app.getHttpServer())
      .post('/api/directors')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        email: 'director@test.com',
        password: 'Director123!',
        name: 'Test Director',
        schoolIds: [schoolId],
      });

    const directorLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'director@test.com',
        password: 'Director123!',
      });

    directorToken = directorLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/teachers (POST)', () => {
    it('should create teacher as director', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'teacher@test.com',
          password: 'Teacher123!',
          name: 'Test Teacher',
          schoolIds: [schoolId],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe('teacher@test.com');
      expect(response.body.name).toBe('Test Teacher');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body.role).toBe('TEACHER');

      teacherId = response.body.id;
    });

    it('should allow teacher to login', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'teacher@test.com',
          password: 'Teacher123!',
        })
        .expect(200);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body.user.role).toBe('TEACHER');
      expect(response.body.user.schoolId).toBe(schoolId);

      teacherToken = response.body.access_token;
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/teachers')
        .send({
          email: 'teacher2@test.com',
          password: 'Teacher123!',
          name: 'Another Teacher',
          schoolIds: [schoolId],
        })
        .expect(401);
    });

    it('should fail with duplicate email', async () => {
      await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'teacher@test.com',
          password: 'Teacher123!',
          name: 'Duplicate Teacher',
          schoolIds: [schoolId],
        })
        .expect(409);
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'invalid-email',
          password: 'Teacher123!',
          name: 'Test Teacher',
          schoolIds: [schoolId],
        })
        .expect(400);
    });

    it('should fail as admin (not director)', async () => {
      await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          email: 'teacher3@test.com',
          password: 'Teacher123!',
          name: 'Test Teacher',
          schoolIds: [schoolId],
        })
        .expect(403);
    });

    it('should fail as teacher (not director)', async () => {
      await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          email: 'teacher4@test.com',
          password: 'Teacher123!',
          name: 'Test Teacher',
          schoolIds: [schoolId],
        })
        .expect(403);
    });
  });

  describe('/api/teachers (GET)', () => {
    it('should list teachers in director school', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('email');
      expect(response.body[0]).not.toHaveProperty('password');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer()).get('/api/teachers').expect(401);
    });

    it('should fail as admin (not director)', async () => {
      await request(app.getHttpServer())
        .get('/api/teachers')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });

    it('should fail as teacher (not director)', async () => {
      await request(app.getHttpServer())
        .get('/api/teachers')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(403);
    });
  });

  describe('/api/teachers/:id (GET)', () => {
    it('should get teacher by id as director', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(200);

      expect(response.body.id).toBe(teacherId);
      expect(response.body.email).toBe('teacher@test.com');
      expect(response.body.name).toBe('Test Teacher');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/teachers/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/teachers/${teacherId}`)
        .expect(401);
    });
  });

  describe('/api/teachers/:id (PATCH)', () => {
    it('should update teacher as director', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          name: 'Updated Teacher Name',
        })
        .expect(200);

      expect(response.body.id).toBe(teacherId);
      expect(response.body.name).toBe('Updated Teacher Name');
      expect(response.body.email).toBe('teacher@test.com');
    });

    it('should update email', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'updated-teacher@test.com',
        })
        .expect(200);

      expect(response.body.email).toBe('updated-teacher@test.com');
    });

    it('should fail with invalid email', async () => {
      await request(app.getHttpServer())
        .patch(`/api/teachers/${teacherId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'invalid-email',
        })
        .expect(400);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .patch('/api/teachers/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          name: 'New Name',
        })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/api/teachers/${teacherId}`)
        .send({
          name: 'New Name',
        })
        .expect(401);
    });
  });

  describe('/api/teachers/:id (DELETE)', () => {
    it('should delete teacher as director', async () => {
      // Create a teacher to delete
      const createResponse = await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'teacher-to-delete@test.com',
          password: 'Teacher123!',
          name: 'Teacher to Delete',
          schoolIds: [schoolId],
        });

      const deleteId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/api/teachers/${deleteId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/teachers/${deleteId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(404);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/api/teachers/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/teachers/${teacherId}`)
        .expect(401);
    });
  });
});
