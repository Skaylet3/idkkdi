import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IAnswerRepository } from '../../../domain/repositories/answer.repository.interface';
import { Answer } from '../../../domain/entities/answer.entity';
import { MultipleChoiceOption } from '../../../../generated/prisma';

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
}
