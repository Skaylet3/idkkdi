import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IQuestionRepository } from '../../../domain/repositories/question.repository.interface';
import { Question } from '../../../domain/entities/question.entity';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEventId(eventId: string): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      where: { eventId },
      orderBy: { order: 'asc' },
    });
    return questions.map((q) => Question.fromPersistence(q as any));
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({ where: { id } });
    return question ? Question.fromPersistence(question as any) : null;
  }

  async update(question: Question): Promise<Question> {
    const data = question.toJSON();
    const updated = await this.prisma.question.update({
      where: { id: data.id },
      data: {
        text: data.text,
        updatedAt: data.updatedAt,
      },
    });
    return Question.fromPersistence(updated as any);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.question.delete({ where: { id } });
  }
}
