import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Events (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let directorToken: string;
  let teacherToken: string;
  let eventId: string;
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
    await request(app.getHttpServer()).post('/api/test/create-admin').send({
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

    // Create teacher and get token
    await request(app.getHttpServer())
      .post('/api/teachers')
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        email: 'teacher@test.com',
        password: 'Teacher123!',
        name: 'Test Teacher',
        schoolIds: [schoolId],
      });

    const teacherLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'teacher@test.com',
        password: 'Teacher123!',
      });

    teacherToken = teacherLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/events (POST)', () => {
    it('should create event with questions as admin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Event',
          description: 'Test event description',
          isActive: true,
          questions: [
            {
              text: 'Question 1?',
              type: 'FREE_TEXT',
              order: 1,
            },
            {
              text: 'Question 2?',
              type: 'MULTIPLE_CHOICE',
              order: 2,
            },
          ],
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Event');
      expect(response.body.description).toBe('Test event description');
      expect(response.body.isActive).toBe(true);
      expect(response.body.questions).toHaveLength(2);
      expect(response.body.questions[0].text).toBe('Question 1?');
      expect(response.body.questions[0].type).toBe('FREE_TEXT');

      eventId = response.body.id;
    });

    it('should create event without description', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Event Without Description',
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        })
        .expect(201);

      expect(response.body.name).toBe('Event Without Description');
      expect(response.body.description).toBeNull();
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .send({
          name: 'Test Event',
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        })
        .expect(401);
    });

    it('should fail as director (not admin)', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          name: 'Test Event',
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        })
        .expect(403);
    });

    it('should fail as teacher (not admin)', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          name: 'Test Event',
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        })
        .expect(403);
    });

    it('should fail with missing name', async () => {
      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        })
        .expect(400);
    });

    it('should fail with more than 50 questions', async () => {
      const questions = Array.from({ length: 51 }, (_, i) => ({
        text: `Question ${i + 1}?`,
        type: 'FREE_TEXT',
        order: i + 1,
      }));

      await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Too Many Questions Event',
          questions,
        })
        .expect(400);
    });

    it('should allow exactly 50 questions', async () => {
      const questions = Array.from({ length: 50 }, (_, i) => ({
        text: `Question ${i + 1}?`,
        type: 'FREE_TEXT',
        order: i + 1,
      }));

      const response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Max Questions Event',
          questions,
        })
        .expect(201);

      expect(response.body.questions).toHaveLength(50);
    });
  });

  describe('/api/events (GET)', () => {
    it('should list all events as admin', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
    });

    it('should list all events as director', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should list all events as teacher', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/events')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer()).get('/api/events').expect(401);
    });
  });

  describe('/api/events/:id (GET)', () => {
    it('should get event with questions as admin', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.name).toBe('Test Event');
      expect(response.body.questions).toBeDefined();
      expect(Array.isArray(response.body.questions)).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
    });

    it('should get event with questions as teacher', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.questions).toBeDefined();
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .get('/api/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/events/${eventId}`)
        .expect(401);
    });
  });

  describe('/api/events/:id (PATCH)', () => {
    it('should update event as admin', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Updated Event Name',
          description: 'Updated description',
        })
        .expect(200);

      expect(response.body.id).toBe(eventId);
      expect(response.body.name).toBe('Updated Event Name');
      expect(response.body.description).toBe('Updated description');
    });

    it('should toggle isActive', async () => {
      const response = await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          isActive: false,
        })
        .expect(200);

      expect(response.body.isActive).toBe(false);
    });

    it('should fail as director (not admin)', async () => {
      await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          name: 'New Name',
        })
        .expect(403);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .patch('/api/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New Name',
        })
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .patch(`/api/events/${eventId}`)
        .send({
          name: 'New Name',
        })
        .expect(401);
    });
  });

  describe('/api/events/:id (DELETE)', () => {
    it('should delete event as admin', async () => {
      // Create an event to delete
      const createResponse = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Event to Delete',
          questions: [
            {
              text: 'Question?',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        });

      const deleteId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/api/events/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(204);

      // Verify deletion
      await request(app.getHttpServer())
        .get(`/api/events/${deleteId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail as director (not admin)', async () => {
      await request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(403);
    });

    it('should fail with non-existent id', async () => {
      await request(app.getHttpServer())
        .delete('/api/events/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .delete(`/api/events/${eventId}`)
        .expect(401);
    });
  });
});
