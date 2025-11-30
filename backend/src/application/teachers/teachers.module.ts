import { Module } from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { TeachersController } from '../../presentation/teachers/teachers.controller';
import { TeacherRepository } from '../../infrastructure/database/repositories/teacher.repository';
import { TEACHER_REPOSITORY } from '../../domain/repositories/teacher.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TeachersController],
  providers: [
    TeachersService,
    {
      provide: TEACHER_REPOSITORY,
      useClass: TeacherRepository,
    },
  ],
  exports: [TeachersService],
})
export class TeachersModule {}
