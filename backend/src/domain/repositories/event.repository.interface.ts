import { Event } from '../entities/event.entity';
import { Question } from '../entities/question.entity';

export interface IEventRepository {
  create(event: Event, questions: Question[]): Promise<{ event: Event; questions: Question[] }>;
  findById(id: string): Promise<Event | null>;
  findByIdWithQuestions(
    id: string,
  ): Promise<{ event: Event; questions: Question[] } | null>;
  findAll(): Promise<Event[]>;
  update(event: Event): Promise<Event>;
  delete(id: string): Promise<void>;
}

export const EVENT_REPOSITORY = 'EVENT_REPOSITORY';
