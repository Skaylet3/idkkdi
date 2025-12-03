import { Answer } from '../entities/answer.entity';

export const ANSWER_REPOSITORY = 'ANSWER_REPOSITORY';

export interface IAnswerRepository {
  // Bulk create answers (teacher submits all at once)
  createBulk(answers: Answer[]): Promise<Answer[]>;

  // Check if user already submitted for this event
  findByUserAndEvent(userId: string, eventId: string): Promise<Answer[]>;

  // Get user's answer history
  findByUserId(userId: string): Promise<Answer[]>;

  // Get all answers for specific event
  findByEventId(eventId: string): Promise<Answer[]>;

  // Get answers for a specific user in a specific event
  findByUserAndEventWithDetails(
    userId: string,
    eventId: string,
  ): Promise<Answer[]>;

  // Get all answers by teachers in a specific school for an event
  findBySchoolAndEvent(schoolId: string, eventId: string): Promise<Answer[]>;

  // Get complete history for a specific user with all details
  findByUserIdWithDetails(userId: string): Promise<any[]>;

  // Get list of events a user has participated in with counts
  findParticipatedEventsByUserId(userId: string): Promise<any[]>;
}
