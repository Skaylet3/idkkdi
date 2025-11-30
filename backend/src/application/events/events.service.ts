import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  IEventRepository,
  EVENT_REPOSITORY,
} from '../../domain/repositories/event.repository.interface';
import { Event } from '../../domain/entities/event.entity';
import { Question } from '../../domain/entities/question.entity';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENT_REPOSITORY)
    private readonly eventRepository: IEventRepository,
  ) {}

  async create(dto: CreateEventDto): Promise<Event> {
    // Create event entity
    const event = Event.create({
      name: dto.name,
      description: dto.description,
      isActive: dto.isActive ?? true,
    });

    // Create question entities
    const questions = dto.questions.map((q) =>
      Question.create({
        text: q.text,
        type: q.type,
        order: q.order,
        eventId: event.id,
      }),
    );

    // Save event with questions in transaction
    return this.eventRepository.create(event, questions);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.findAll();
  }

  async findById(id: string): Promise<Event> {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return event;
  }

  async findByIdWithQuestions(
    id: string,
  ): Promise<{ event: Event; questions: Question[] }> {
    const result = await this.eventRepository.findByIdWithQuestions(id);
    if (!result) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }
    return result;
  }

  async update(id: string, dto: UpdateEventDto): Promise<Event> {
    const event = await this.findById(id);

    if (dto.name) {
      event.updateName(dto.name);
    }
    if (dto.description !== undefined) {
      event.updateDescription(dto.description);
    }
    if (dto.isActive !== undefined && dto.isActive !== event.isActive) {
      event.toggleActive();
    }

    return this.eventRepository.update(event);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.eventRepository.delete(id);
  }
}
