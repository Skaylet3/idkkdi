import {
  Injectable,
  Inject,
  ConflictException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import {
  IAnswerRepository,
  ANSWER_REPOSITORY,
} from '../../domain/repositories/answer.repository.interface';
import {
  IEventRepository,
  EVENT_REPOSITORY,
} from '../../domain/repositories/event.repository.interface';
import {
  ITeacherRepository,
  TEACHER_REPOSITORY,
} from '../../domain/repositories/teacher.repository.interface';
import { Answer } from '../../domain/entities/answer.entity';
import { SubmitAnswersDto } from './dtos/submit-answers.dto';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Injectable()
export class AnswersService {
  constructor(
    @Inject(ANSWER_REPOSITORY)
    private readonly answerRepository: IAnswerRepository,
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepository,
  ) {}

  async submitAnswers(
    dto: SubmitAnswersDto,
    teacher: JwtPayload,
  ): Promise<Answer[]> {
    // 1. Check if event exists and get its questions
    const eventWithQuestions = await this.eventRepository.findByIdWithQuestions(
      dto.eventId,
    );

    if (!eventWithQuestions) {
      throw new NotFoundException('Event not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { event, questions } = eventWithQuestions;

    // 2. Check if user already submitted for this event
    const existingAnswers = await this.answerRepository.findByUserAndEvent(
      teacher.userId,
      dto.eventId,
    );

    if (existingAnswers.length > 0) {
      throw new ConflictException(
        'You have already submitted answers for this event',
      );
    }

    // 3. Validate all questions are answered
    if (dto.answers.length !== questions.length) {
      throw new BadRequestException(
        `You must answer all ${questions.length} questions`,
      );
    }

    // 4. Validate all question IDs are valid
    const questionIds = questions.map((q) => q.id);
    const answerQuestionIds = dto.answers.map((a) => a.questionId);

    const invalidQuestionIds = answerQuestionIds.filter(
      (id) => !questionIds.includes(id),
    );

    if (invalidQuestionIds.length > 0) {
      throw new BadRequestException(
        `Invalid question IDs: ${invalidQuestionIds.join(', ')}`,
      );
    }

    // 5. Check for duplicate question IDs in submission
    const duplicates = answerQuestionIds.filter(
      (id, index) => answerQuestionIds.indexOf(id) !== index,
    );

    if (duplicates.length > 0) {
      throw new BadRequestException(
        `Duplicate answers for questions: ${duplicates.join(', ')}`,
      );
    }

    // 6. Create answer entities
    const answers = dto.answers.map((answerDto) =>
      Answer.create({
        userId: teacher.userId,
        questionId: answerDto.questionId,
        eventId: dto.eventId,
        answerText: answerDto.answerText,
        selectedOption: answerDto.selectedOption,
      }),
    );

    // 7. Save in bulk
    return this.answerRepository.createBulk(answers);
  }

  async getMyHistory(teacher: JwtPayload): Promise<Answer[]> {
    return this.answerRepository.findByUserId(teacher.userId);
  }

  async getMyAnswersForEvent(
    teacher: JwtPayload,
    eventId: string,
  ): Promise<Answer[]> {
    return this.answerRepository.findByUserAndEventWithDetails(
      teacher.userId,
      eventId,
    );
  }

  async getSchoolResults(
    director: JwtPayload,
    eventId: string,
  ): Promise<Answer[]> {
    if (!director.schoolId) {
      throw new BadRequestException('Director not assigned to school');
    }

    return this.answerRepository.findBySchoolAndEvent(
      director.schoolId,
      eventId,
    );
  }

  async getTeacherHistory(director: JwtPayload, teacherId: string) {
    if (!director.schoolId) {
      throw new BadRequestException('Director not assigned to school');
    }

    // 1. Verify teacher exists
    const teacher = await this.teacherRepository.findById(teacherId);
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    // 2. Verify teacher belongs to director's school
    // Get all teachers from director's school
    const schoolTeachers = await this.teacherRepository.findBySchoolId(
      director.schoolId,
    );
    const teacherBelongsToSchool = schoolTeachers.some(
      (t) => t.id === teacherId,
    );

    if (!teacherBelongsToSchool) {
      throw new ForbiddenException(
        'You can only view teachers from your school',
      );
    }

    // 3. Return complete history with full details
    return this.answerRepository.findByUserIdWithDetails(teacherId);
  }
}
