import { Question } from '../entities/question.entity';

export interface IQuestionRepository {
  findByEventId(eventId: string): Promise<Question[]>;
  findById(id: string): Promise<Question | null>;
  update(question: Question): Promise<Question>;
  delete(id: string): Promise<void>;
}

export const QUESTION_REPOSITORY = 'QUESTION_REPOSITORY';
