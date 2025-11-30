import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from '../../presentation/schools/schools.controller';
import { SchoolRepository } from '../../infrastructure/database/repositories/school.repository';
import { SCHOOL_REPOSITORY } from '../../domain/repositories/school.repository.interface';
import { AuthModule } from '../../infrastructure/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [SchoolsController],
  providers: [
    SchoolsService,
    {
      provide: SCHOOL_REPOSITORY,
      useClass: SchoolRepository,
    },
  ],
  exports: [SchoolsService],
})
export class SchoolsModule {}
