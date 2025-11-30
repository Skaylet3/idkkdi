import { Module } from '@nestjs/common';
import { AnswersService } from './answers.service';
import { AnswersController } from '../../presentation/answers/answers.controller';
import { AnswerRepository } from '../../infrastructure/database/repositories/answer.repository';
import { ANSWER_REPOSITORY } from '../../domain/repositories/answer.repository.interface';
import { EventRepository } from '../../infrastructure/database/repositories/event.repository';
import { EVENT_REPOSITORY } from '../../domain/repositories/event.repository.interface';
import { TeacherRepository } from '../../infrastructure/database/repositories/teacher.repository';
import { TEACHER_REPOSITORY } from '../../domain/repositories/teacher.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AnswersController],
  providers: [
    AnswersService,
    {
      provide: ANSWER_REPOSITORY,
      useClass: AnswerRepository,
    },
    {
      provide: EVENT_REPOSITORY,
      useClass: EventRepository,
    },
    {
      provide: TEACHER_REPOSITORY,
      useClass: TeacherRepository,
    },
  ],
  exports: [AnswersService],
})
export class AnswersModule {}
