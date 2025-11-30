import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IDirectorRepository } from '../../../domain/repositories/director.repository.interface';
import { Director } from '../../../domain/entities/director.entity';

@Injectable()
export class DirectorRepository implements IDirectorRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(director: Director, schoolId: string): Promise<Director> {
    const data = director.toJSON();

    // Create user with DIRECTOR role and link to school
    const created = await this.prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        password: data.password,
        name: data.name,
        role: 'DIRECTOR',
        directorSchools: {
          create: {
            schoolId,
          },
        },
      },
    });

    return Director.fromPersistence(created);
  }

  async findById(id: string): Promise<Director | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, role: 'DIRECTOR' },
    });
    return user ? Director.fromPersistence(user) : null;
  }

  async findByEmail(email: string): Promise<Director | null> {
    const user = await this.prisma.user.findUnique({
      where: { email, role: 'DIRECTOR' },
    });
    return user ? Director.fromPersistence(user) : null;
  }

  async findAll(): Promise<Director[]> {
    const users = await this.prisma.user.findMany({
      where: { role: 'DIRECTOR' },
      orderBy: { createdAt: 'desc' },
    });
    return users.map((u) => Director.fromPersistence(u));
  }

  async findBySchoolId(schoolId: string): Promise<Director[]> {
    const directorSchools = await this.prisma.directorSchool.findMany({
      where: { schoolId },
      include: { user: true },
    });

    return directorSchools.map((ds) => Director.fromPersistence(ds.user));
  }

  async update(director: Director): Promise<Director> {
    const data = director.toJSON();
    const updated = await this.prisma.user.update({
      where: { id: data.id },
      data: {
        email: data.email,
        name: data.name,
        updatedAt: data.updatedAt,
      },
    });
    return Director.fromPersistence(updated);
  }

  async delete(id: string): Promise<void> {
    // Cascade delete will handle DirectorSchool junction table
    await this.prisma.user.delete({ where: { id } });
  }
}
