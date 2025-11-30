import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ITeacherRepository } from '../../../domain/repositories/teacher.repository.interface';
import { Teacher } from '../../../domain/entities/teacher.entity';

@Injectable()
export class TeacherRepository implements ITeacherRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(teacher: Teacher, schoolId: string): Promise<Teacher> {
    const data = teacher.toJSON();

    const created = await this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'TEACHER',
        teacherSchools: {
          create: {
            schoolId,
          },
        },
      },
    });

    return Teacher.fromPersistence(created);
  }

  async findById(id: string): Promise<Teacher | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, role: 'TEACHER' },
    });
    return user ? Teacher.fromPersistence(user) : null;
  }

  async findByEmail(email: string): Promise<Teacher | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, role: 'TEACHER' },
    });
    return user ? Teacher.fromPersistence(user) : null;
  }

  async findAll(): Promise<Teacher[]> {
    const users = await this.prisma.user.findMany({
      where: { role: 'TEACHER' },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => Teacher.fromPersistence(u));
  }

  async findBySchoolId(schoolId: string): Promise<Teacher[]> {
    const teacherSchools = await this.prisma.teacherSchool.findMany({
      where: { schoolId },
      include: { user: true },
    });

    return teacherSchools.map((ts) => Teacher.fromPersistence(ts.user));
  }

  async update(teacher: Teacher): Promise<Teacher> {
    const data = teacher.toJSON();
    const updated = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        name: data.name,
        updatedAt: data.updatedAt,
      },
    });
    return Teacher.fromPersistence(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
