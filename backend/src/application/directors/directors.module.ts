import { Module } from '@nestjs/common';
import { DirectorsService } from './directors.service';
import { DirectorsController } from '../../presentation/directors/directors.controller';
import { DirectorRepository } from '../../infrastructure/database/repositories/director.repository';
import { DIRECTOR_REPOSITORY } from '../../domain/repositories/director.repository.interface';
import { SchoolRepository } from '../../infrastructure/database/repositories/school.repository';
import { SCHOOL_REPOSITORY } from '../../domain/repositories/school.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [DirectorsController],
  providers: [
    DirectorsService,
    {
      provide: DIRECTOR_REPOSITORY,
      useClass: DirectorRepository,
    },
    {
      provide: SCHOOL_REPOSITORY,
      useClass: SchoolRepository,
    },
  ],
  exports: [DirectorsService],
})
export class DirectorsModule {}
