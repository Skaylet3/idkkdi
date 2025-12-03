import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAnswerRepository } from '../../../domain/repositories/answer.repository.interface';
import { Answer } from '../../../domain/entities/answer.entity';
import { MultipleChoiceOption } from '@prisma/client';

@Injectable()
export class AnswerRepository implements IAnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBulk(answers: Answer[]): Promise<Answer[]> {
    const answerData = answers.map((answer) => ({
      id: answer.id,
      userId: answer.userId,
      questionId: answer.questionId,
      eventId: answer.eventId,
      answerText: answer.answerText ?? null,
      selectedOption: answer.selectedOption
        ? (answer.selectedOption as MultipleChoiceOption)
        : null,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }));

    // Use createMany for bulk insert
    await this.prisma.answer.createMany({
      data: answerData,
    });

    // Return the created answers
    return answers;
  }

  async findByUserAndEvent(userId: string, eventId: string): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        userId,
        eventId,
      },
    });

    return answers.map((answer) =>
      Answer.fromPersistence({
        ...answer,
        answerText: answer.answerText ?? undefined,
        selectedOption: answer.selectedOption ?? undefined,
      }),
    );
  }

  async findByUserId(userId: string): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return answers.map((answer) =>
      Answer.fromPersistence({
        ...answer,
        answerText: answer.answerText ?? undefined,
        selectedOption: answer.selectedOption ?? undefined,
      }),
    );
  }

  async findByEventId(eventId: string): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return answers.map((answer) =>
      Answer.fromPersistence({
        ...answer,
        answerText: answer.answerText ?? undefined,
        selectedOption: answer.selectedOption ?? undefined,
      }),
    );
  }

  async findByUserAndEventWithDetails(
    userId: string,
    eventId: string,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        userId,
        eventId,
      },
      include: {
        question: true,
        event: true,
      },
    });

    return answers.map((answer) =>
      Answer.fromPersistence({
        id: answer.id,
        userId: answer.userId,
        questionId: answer.questionId,
        eventId: answer.eventId,
        answerText: answer.answerText ?? undefined,
        selectedOption: answer.selectedOption ?? undefined,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      }),
    );
  }

  async findBySchoolAndEvent(
    schoolId: string,
    eventId: string,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: {
        eventId,
        user: {
          role: 'TEACHER',
          teacherSchools: {
            some: {
              schoolId: schoolId,
            },
          },
        },
      },
      include: {
        user: true,
        question: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return answers.map((answer) =>
      Answer.fromPersistence({
        id: answer.id,
        userId: answer.userId,
        questionId: answer.questionId,
        eventId: answer.eventId,
        answerText: answer.answerText ?? undefined,
        selectedOption: answer.selectedOption ?? undefined,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      }),
    );
  }

  async findByUserIdWithDetails(userId: string): Promise<any[]> {
    const answers = await this.prisma.answer.findMany({
      where: { userId },
      include: {
        question: true,
        event: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return answers.map((answer) => ({
      id: answer.id,
      teacherId: answer.userId,
      teacherName: answer.user.name,
      teacherEmail: answer.user.email,
      eventId: answer.eventId,
      eventName: answer.event.name,
      eventDescription: answer.event.description,
      questionId: answer.questionId,
      questionText: answer.question.text,
      questionType: answer.question.type,
      answerText: answer.answerText ?? undefined,
      selectedOption: answer.selectedOption ?? undefined,
      submittedAt: answer.createdAt,
    }));
  }

  async findParticipatedEventsByUserId(userId: string): Promise<any[]> {
    const answers = await this.prisma.answer.findMany({
      where: { userId },
      select: {
        eventId: true,
        createdAt: true,
        event: {
          select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
            _count: {
              select: { questions: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Group by eventId and aggregate
    const eventMap = new Map();

    answers.forEach((answer) => {
      if (!eventMap.has(answer.eventId)) {
        eventMap.set(answer.eventId, {
          eventId: answer.event.id,
          eventName: answer.event.name,
          eventDescription: answer.event.description,
          isActive: answer.event.isActive,
          answeredQuestionsCount: 1,
          totalQuestionsCount: answer.event._count.questions,
          participatedAt: answer.createdAt,
        });
      } else {
        const existing = eventMap.get(answer.eventId);
        existing.answeredQuestionsCount++;
        // Keep the earliest participation date
        if (answer.createdAt < existing.participatedAt) {
          existing.participatedAt = answer.createdAt;
        }
      }
    });

    // Convert Map to array and sort by participatedAt (newest first)
    return Array.from(eventMap.values()).sort(
      (a, b) => b.participatedAt.getTime() - a.participatedAt.getTime(),
    );
  }
}
