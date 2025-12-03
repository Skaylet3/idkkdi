import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/infrastructure/database/prisma.service';

describe('Answers (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let directorToken: string;
  let teacherToken: string;
  let teacher2Token: string;
  let schoolId: string;
  let eventId: string;
  let teacherId: string;
  let teacher2Id: string;
  let questionIds: string[] = [];

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
        schoolId: schoolId,
      });

    const directorLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'director@test.com',
        password: 'Director123!',
      });

    directorToken = directorLogin.body.access_token;

    // Create teacher and get token
    const teacherResponse = await request(app.getHttpServer())
      .post('/api/teachers')
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        email: 'teacher@test.com',
        password: 'Teacher123!',
        name: 'Test Teacher',
      });

    teacherId = teacherResponse.body.id;

    const teacherLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'teacher@test.com',
        password: 'Teacher123!',
      });

    teacherToken = teacherLogin.body.access_token;

    // Create second teacher
    const teacher2Response = await request(app.getHttpServer())
      .post('/api/teachers')
      .set('Authorization', `Bearer ${directorToken}`)
      .send({
        email: 'teacher2@test.com',
        password: 'Teacher123!',
        name: 'Test Teacher 2',
      });

    teacher2Id = teacher2Response.body.id;

    const teacher2Login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: 'teacher2@test.com',
        password: 'Teacher123!',
      });

    teacher2Token = teacher2Login.body.access_token;

    // Create event with questions
    const eventResponse = await request(app.getHttpServer())
      .post('/api/events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Event',
        description: 'Test event for answers',
        isActive: true,
        questions: [
          {
            text: 'What is your name?',
            type: 'FREE_TEXT',
            order: 1,
          },
          {
            text: 'Do you agree?',
            type: 'MULTIPLE_CHOICE',
            order: 2,
          },
        ],
      });

    eventId = eventResponse.body.id;
    questionIds = eventResponse.body.questions.map((q: any) => q.id);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/answers/submit (POST)', () => {
    it('should submit answers as teacher', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'John Doe',
            },
            {
              questionId: questionIds[1],
              selectedOption: 'YES',
            },
          ],
        })
        .expect(201);

      expect(response.body).toHaveProperty('message');
      expect(response.body.answers).toHaveLength(2);
    });

    it('should fail when submitting duplicate answers', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Jane Doe',
            },
            {
              questionId: questionIds[1],
              selectedOption: 'NO',
            },
          ],
        })
        .expect(409);
    });

    it('should allow second teacher to submit answers', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacher2Token}`)
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Jane Smith',
            },
            {
              questionId: questionIds[1],
              selectedOption: 'NO',
            },
          ],
        })
        .expect(201);

      expect(response.body.answers).toHaveLength(2);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Test',
            },
          ],
        })
        .expect(401);
    });

    it('should fail as admin (not teacher)', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Test',
            },
          ],
        })
        .expect(403);
    });

    it('should fail as director (not teacher)', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          eventId,
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Test',
            },
          ],
        })
        .expect(403);
    });

    it('should fail with missing answers', async () => {
      // Create new event
      const newEventResponse = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Another Event',
          questions: [
            {
              text: 'Question 1?',
              type: 'FREE_TEXT',
              order: 1,
            },
            {
              text: 'Question 2?',
              type: 'FREE_TEXT',
              order: 2,
            },
          ],
        });

      const newEventId = newEventResponse.body.id;
      const newQuestionIds = newEventResponse.body.questions.map(
        (q: any) => q.id,
      );

      // Try to submit with only one answer (missing one)
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId: newEventId,
          answers: [
            {
              questionId: newQuestionIds[0],
              answerText: 'Answer 1',
            },
          ],
        })
        .expect(400);
    });

    it('should fail with non-existent event', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId: '00000000-0000-0000-0000-000000000000',
          answers: [
            {
              questionId: questionIds[0],
              answerText: 'Test',
            },
          ],
        })
        .expect(404);
    });

    it('should fail with non-existent question', async () => {
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId,
          answers: [
            {
              questionId: '00000000-0000-0000-0000-000000000000',
              answerText: 'Test',
            },
          ],
        })
        .expect(404);
    });
  });

  describe('/api/answers/my-history (GET)', () => {
    it('should get teacher answer history', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/answers/my-history')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
      expect(response.body[0]).toHaveProperty('eventId');
      expect(response.body[0]).toHaveProperty('eventName');
      expect(response.body[0]).toHaveProperty('submittedAt');
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-history')
        .expect(401);
    });

    it('should fail as admin (not teacher)', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-history')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('/api/answers/my-answers/:eventId (GET)', () => {
    it('should get teacher answers for specific event', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/answers/my-answers/${eventId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('eventId');
      expect(response.body).toHaveProperty('eventName');
      expect(response.body).toHaveProperty('answers');
      expect(Array.isArray(response.body.answers)).toBe(true);
      expect(response.body.answers.length).toBe(2);
    });

    it('should fail with non-existent event', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-answers/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/my-answers/${eventId}`)
        .expect(401);
    });

    it('should fail as director (not teacher)', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/my-answers/${eventId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(403);
    });
  });

  describe('/api/answers/school-results/:eventId (GET)', () => {
    it('should get school results as director', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/answers/school-results/${eventId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('eventId');
      expect(response.body).toHaveProperty('eventName');
      expect(response.body).toHaveProperty('schoolId');
      expect(response.body).toHaveProperty('teachers');
      expect(Array.isArray(response.body.teachers)).toBe(true);
      expect(response.body.teachers.length).toBe(2);
    });

    it('should fail with non-existent event', async () => {
      await request(app.getHttpServer())
        .get(
          '/api/answers/school-results/00000000-0000-0000-0000-000000000000',
        )
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/school-results/${eventId}`)
        .expect(401);
    });

    it('should fail as teacher (not director)', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/school-results/${eventId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(403);
    });

    it('should fail as admin (not director)', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/school-results/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('/api/answers/teacher-history/:teacherId (GET)', () => {
    it('should get teacher history as director', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/answers/teacher-history/${teacherId}`)
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('teacherId');
      expect(response.body).toHaveProperty('teacherName');
      expect(response.body).toHaveProperty('events');
      expect(Array.isArray(response.body.events)).toBe(true);
      expect(response.body.events.length).toBeGreaterThan(0);
    });

    it('should fail with non-existent teacher', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/teacher-history/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(404);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/teacher-history/${teacherId}`)
        .expect(401);
    });

    it('should fail as teacher (not director)', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/teacher-history/${teacherId}`)
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(403);
    });

    it('should fail as admin (not director)', async () => {
      await request(app.getHttpServer())
        .get(`/api/answers/teacher-history/${teacherId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });

  describe('/api/answers/my-participated-events (GET)', () => {
    it('should get participated events as teacher', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);

      const participatedEvent = response.body[0];
      expect(participatedEvent).toHaveProperty('eventId');
      expect(participatedEvent).toHaveProperty('eventName');
      expect(participatedEvent).toHaveProperty('eventDescription');
      expect(participatedEvent).toHaveProperty('isActive');
      expect(participatedEvent).toHaveProperty('answeredQuestionsCount');
      expect(participatedEvent).toHaveProperty('totalQuestionsCount');
      expect(participatedEvent).toHaveProperty('participatedAt');

      expect(participatedEvent.eventId).toBe(eventId);
      expect(participatedEvent.eventName).toBe('Test Event');
      expect(participatedEvent.answeredQuestionsCount).toBe(2);
      expect(participatedEvent.totalQuestionsCount).toBe(2);
    });

    it('should return empty array for teacher with no participation', async () => {
      // Create new teacher who hasn't participated
      await request(app.getHttpServer())
        .post('/api/teachers')
        .set('Authorization', `Bearer ${directorToken}`)
        .send({
          email: 'newteacher@test.com',
          password: 'Teacher123!',
          name: 'New Teacher',
        });

      const newTeacherLogin = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: 'newteacher@test.com',
          password: 'Teacher123!',
        });

      const newTeacherToken = newTeacherLogin.body.access_token;

      const response = await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .set('Authorization', `Bearer ${newTeacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('should show multiple events if teacher participated in multiple', async () => {
      // Create second event
      const event2Response = await request(app.getHttpServer())
        .post('/api/events')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Second Test Event',
          description: 'Another test event',
          isActive: true,
          questions: [
            {
              text: 'Question 1',
              type: 'FREE_TEXT',
              order: 1,
            },
          ],
        });

      const event2Id = event2Response.body.id;
      const event2QuestionIds = event2Response.body.questions.map((q: any) => q.id);

      // Teacher submits answers for second event
      await request(app.getHttpServer())
        .post('/api/answers/submit')
        .set('Authorization', `Bearer ${teacherToken}`)
        .send({
          eventId: event2Id,
          answers: [
            {
              questionId: event2QuestionIds[0],
              answerText: 'Answer to question 1',
            },
          ],
        })
        .expect(201);

      // Get participated events
      const response = await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .set('Authorization', `Bearer ${teacherToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      // Should be sorted by most recent first
      expect(response.body[0].eventId).toBe(event2Id);
      expect(response.body[1].eventId).toBe(eventId);
    });

    it('should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .expect(401);
    });

    it('should fail as director (not teacher)', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .set('Authorization', `Bearer ${directorToken}`)
        .expect(403);
    });

    it('should fail as admin (not teacher)', async () => {
      await request(app.getHttpServer())
        .get('/api/answers/my-participated-events')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(403);
    });
  });
});
