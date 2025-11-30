import { PrismaService } from '../../src/infrastructure/database/prisma.service';

export async function cleanDatabase(prisma: PrismaService) {
  // Order matters for foreign key constraints
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.event.deleteMany();
  await prisma.teacherSchool.deleteMany();
  await prisma.directorSchool.deleteMany();
  await prisma.school.deleteMany(); // Must delete schools before users (adminId FK)
  await prisma.user.deleteMany();
}
