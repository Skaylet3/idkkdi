import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../../generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(this.pool);
    this.prisma = new PrismaClient({ adapter });
  }

  async onModuleInit() {
    await this.prisma.$connect();
    console.log('✅ Database connected');
  }

  async onModuleDestroy() {
    await this.prisma.$disconnect();
    console.log('👋 Database disconnected');
  }

  // Expose all Prisma Client methods
  get user() {
    return this.prisma.user;
  }

  get school() {
    return this.prisma.school;
  }

  get directorSchool() {
    return this.prisma.directorSchool;
  }

  get teacherSchool() {
    return this.prisma.teacherSchool;
  }

  get event() {
    return this.prisma.event;
  }

  get question() {
    return this.prisma.question;
  }

  get answer() {
    return this.prisma.answer;
  }
}
