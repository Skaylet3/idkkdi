import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Schools (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let schoolId: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/schools (POST)', () => {
    it('should create school as admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test School 1',
          address: '123 Main St',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test School 1');
      expect(response.body.address).toBe('123 Main St');
      expect(response.body).toHaveProperty('adminId');

      schoolId = response.body.id;
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/schools')
        .send({
          name: 'Test School 2',
          address: '456 Oak Ave',
        })
        .expect(401);
    });

    it('should fail with missing name', async () => {
      await request(app.getHttpServer())
        .post('/api/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          address: '789 Elm St',
        })
        .expect(400);
    });

    it('should create school without address', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test School 2',
        })
        .expect(201);

      expect(response.body.name).toBe('Test School 2');
      expect(response.body.address).toBeNull();
    });
  });

  describe('/api/schools (GET)', () => {
    it('should list all schools as admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer()).get('/api/schools').expect(401);
    });
  });

  describe('/api/schools/:id (GET)', () => {
    it('should get school by id as admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(schoolId);
      expect(response.body.name).toBe('Test School 1');
      expect(response.body.address).toBe('123 Main St');
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/schools/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/schools/${schoolId}`)
        .expect(401);
    });
  });

  describe('/api/schools/:id (PATCH)', () => {
    it('should update school as admin', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated School Name',
          address: 'Updated Address',
        })
        .expect(200);

      expect(response.body.id).toBe(schoolId);
      expect(response.body.name).toBe('Updated School Name');
      expect(response.body.address).toBe('Updated Address');
    });

    it('should update only name', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/schools/${schoolId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Partially Updated School',
        })
        .expect(200);

      expect(response.body.name).toBe('Partially Updated School');
      expect(response.body.address).toBe('Updated Address');
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .patch('/api/schools/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Name',
        })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/api/schools/${schoolId}`)
        .send({
          name: 'New Name',
        })
        .expect(401);
    });
  });

  describe('/api/schools/:id (DELETE)', () => {
    it('should delete school as admin', async () => {
      // Create a school to delete
      const createResponse = await request(app.getHttpServer())
        .post('/api/schools')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'School to Delete',
        });

      const deleteId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/api/schools/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/schools/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/api/schools/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/schools/${schoolId}`)
        .expect(401);
    });
  });
});
