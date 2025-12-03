import { Test, TestingModule } from '@nestjs/testing';
import { AnswersService } from './answers.service';
import { ANSWER_REPOSITORY } from '../../domain/repositories/answer.repository.interface';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.interface';
import { TEACHER_REPOSITORY } from '../../domain/repositories/teacher.repository.interface';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

describe('AnswersService - getMyParticipatedEvents', () => {
  let service: AnswersService;
  let mockAnswerRepository: any;
  let mockEventRepository: any;
  let mockTeacherRepository: any;

  beforeEach(async () => {
    // Create mock repositories
    mockAnswerRepository = {
      findParticipatedEventsByUserId: jest.fn(),
      createBulk: jest.fn(),
      findByUserId: jest.fn(),
      findByUserAndEvent: jest.fn(),
      findByUserAndEventWithDetails: jest.fn(),
      findBySchoolAndEvent: jest.fn(),
      findByUserIdWithDetails: jest.fn(),
    };

    mockEventRepository = {
      findByIdWithQuestions: jest.fn(),
    };

    mockTeacherRepository = {
      findById: jest.fn(),
      findBySchoolId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnswersService,
        {
          provide: ANSWER_REPOSITORY,
          useValue: mockAnswerRepository,
        },
        {
          provide: EVENT_REPOSITORY,
          useValue: mockEventRepository,
        },
        {
          provide: TEACHER_REPOSITORY,
          useValue: mockTeacherRepository,
        },
      ],
    }).compile();

    service = module.get<AnswersService>(AnswersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getMyParticipatedEvents', () => {
    it('should return list of participated events for teacher', async () => {
      // Arrange
      const teacherPayload: JwtPayload = {
        userId: 'teacher-123',
        email: 'teacher@test.com',
        role: 'TEACHER',
        schoolId: 'school-123',
      };

      const mockParticipatedEvents = [
        {
          eventId: 'event-1',
          eventName: 'Q1 2025 Assessment',
          eventDescription: 'First quarter evaluation',
          isActive: true,
          answeredQuestionsCount: 15,
          totalQuestionsCount: 15,
          participatedAt: new Date('2025-12-03T10:30:00.000Z'),
        },
        {
          eventId: 'event-2',
          eventName: 'Q4 2024 Assessment',
          eventDescription: 'Fourth quarter evaluation',
          isActive: false,
          answeredQuestionsCount: 10,
          totalQuestionsCount: 10,
          participatedAt: new Date('2024-11-20T14:15:00.000Z'),
        },
      ];

      mockAnswerRepository.findParticipatedEventsByUserId.mockResolvedValue(
        mockParticipatedEvents,
      );

      // Act
      const result = await service.getMyParticipatedEvents(teacherPayload);

      // Assert
      expect(result).toEqual(mockParticipatedEvents);
      expect(mockAnswerRepository.findParticipatedEventsByUserId).toHaveBeenCalledWith(
        'teacher-123',
      );
      expect(mockAnswerRepository.findParticipatedEventsByUserId).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when teacher has no participation', async () => {
      // Arrange
      const teacherPayload: JwtPayload = {
        userId: 'teacher-456',
        email: 'newteacher@test.com',
        role: 'TEACHER',
        schoolId: 'school-123',
      };

      mockAnswerRepository.findParticipatedEventsByUserId.mockResolvedValue([]);

      // Act
      const result = await service.getMyParticipatedEvents(teacherPayload);

      // Assert
      expect(result).toEqual([]);
      expect(mockAnswerRepository.findParticipatedEventsByUserId).toHaveBeenCalledWith(
        'teacher-456',
      );
      expect(mockAnswerRepository.findParticipatedEventsByUserId).toHaveBeenCalledTimes(1);
    });

    it('should pass correct userId from JWT payload', async () => {
      // Arrange
      const teacherPayload: JwtPayload = {
        userId: 'unique-teacher-id-789',
        email: 'specific@test.com',
        role: 'TEACHER',
        schoolId: 'school-999',
      };

      mockAnswerRepository.findParticipatedEventsByUserId.mockResolvedValue([]);

      // Act
      await service.getMyParticipatedEvents(teacherPayload);

      // Assert
      expect(mockAnswerRepository.findParticipatedEventsByUserId).toHaveBeenCalledWith(
        'unique-teacher-id-789',
      );
    });

    it('should handle repository errors gracefully', async () => {
      // Arrange
      const teacherPayload: JwtPayload = {
        userId: 'teacher-error',
        email: 'error@test.com',
        role: 'TEACHER',
        schoolId: 'school-123',
      };

      const repositoryError = new Error('Database connection failed');
      mockAnswerRepository.findParticipatedEventsByUserId.mockRejectedValue(
        repositoryError,
      );

      // Act & Assert
      await expect(
        service.getMyParticipatedEvents(teacherPayload),
      ).rejects.toThrow('Database connection failed');
    });

    it('should return events with all required properties', async () => {
      // Arrange
      const teacherPayload: JwtPayload = {
        userId: 'teacher-123',
        email: 'teacher@test.com',
        role: 'TEACHER',
        schoolId: 'school-123',
      };

      const mockEvent = {
        eventId: 'event-1',
        eventName: 'Test Event',
        eventDescription: 'Test Description',
        isActive: true,
        answeredQuestionsCount: 5,
        totalQuestionsCount: 10,
        participatedAt: new Date('2025-12-03T10:30:00.000Z'),
      };

      mockAnswerRepository.findParticipatedEventsByUserId.mockResolvedValue([
        mockEvent,
      ]);

      // Act
      const result = await service.getMyParticipatedEvents(teacherPayload);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('eventId');
      expect(result[0]).toHaveProperty('eventName');
      expect(result[0]).toHaveProperty('eventDescription');
      expect(result[0]).toHaveProperty('isActive');
      expect(result[0]).toHaveProperty('answeredQuestionsCount');
      expect(result[0]).toHaveProperty('totalQuestionsCount');
      expect(result[0]).toHaveProperty('participatedAt');
    });
  });
});
