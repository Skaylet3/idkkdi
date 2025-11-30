import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from '../../presentation/events/events.controller';
import { EventRepository } from '../../infrastructure/database/repositories/event.repository';
import { QuestionRepository } from '../../infrastructure/database/repositories/question.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.interface';
import { QUESTION_REPOSITORY } from '../../domain/repositories/question.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [EventsController],
  providers: [
    EventsService,
    {
      provide: EVENT_REPOSITORY,
      useClass: EventRepository,
    },
    {
      provide: QUESTION_REPOSITORY,
      useClass: QuestionRepository,
    },
  ],
  exports: [EventsService],
})
export class EventsModule {}
