import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './infrastructure/database/prisma.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { TestModule } from './presentation/test/test.module';
import { SchoolsModule } from './application/schools/schools.module';
import { DirectorsModule } from './application/directors/directors.module';
import { EventsModule } from './application/events/events.module';
import { TeachersModule } from './application/teachers/teachers.module';
import { AnswersModule } from './application/answers/answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    TestModule,
    SchoolsModule,
    DirectorsModule,
    EventsModule,
    TeachersModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
