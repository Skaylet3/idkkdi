import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IEventRepository } from '../../../domain/repositories/event.repository.interface';
import { Event } from '../../../domain/entities/event.entity';
import { Question } from '../../../domain/entities/question.entity';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(event: Event, questions: Question[]): Promise<Event> {
    const eventData = event.toJSON();

    // Create event with nested questions in transaction
    const created = await this.prisma.event.create({
      data: {
        id: eventData.id,
        name: eventData.name,
        description: eventData.description,
        isActive: eventData.isActive,
        questions: {
          create: questions.map((q) => {
            const qData = q.toJSON();
            return {
              id: qData.id,
              text: qData.text,
              type: qData.type,
              order: qData.order,
            };
          }),
        },
      },
    });

    return Event.fromPersistence({
      ...created,
      description: created.description ?? undefined,
    });
  }

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    return event
      ? Event.fromPersistence({
          ...event,
          description: event.description ?? undefined,
        })
      : null;
  }

  async findByIdWithQuestions(
    id: string,
  ): Promise<{ event: Event; questions: Question[] } | null> {
    const result = await this.prisma.event.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!result) return null;

    const event = Event.fromPersistence({
      ...result,
      description: result.description ?? undefined,
    });

    const questions = result.questions.map((q) =>
      Question.fromPersistence(q as any),
    );

    return { event, questions };
  }

  async findAll(): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return events.map((e) =>
      Event.fromPersistence({
        ...e,
        description: e.description ?? undefined,
      }),
    );
  }

  async update(event: Event): Promise<Event> {
    const data = event.toJSON();
    const updated = await this.prisma.event.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        updatedAt: data.updatedAt,
      },
    });
    return Event.fromPersistence({
      ...updated,
      description: updated.description ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    // Cascade delete will handle questions
    await this.prisma.event.delete({ where: { id } });
  }
}
