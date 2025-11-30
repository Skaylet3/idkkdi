import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ISchoolRepository } from '../../../domain/repositories/school.repository.interface';
import { School } from '../../../domain/entities/school.entity';

@Injectable()
export class SchoolRepository implements ISchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(school: School): Promise<School> {
    const data = school.toJSON();
    const created = await this.prisma.school.create({
      data: {
        id: data.id,
        name: data.name,
        address: data.address,
        adminId: data.adminId,
      },
    });
    return School.fromPersistence({
      ...created,
      address: created.address ?? undefined,
    });
  }

  async findById(id: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    return school
      ? School.fromPersistence({
          ...school,
          address: school.address ?? undefined,
        })
      : null;
  }

  async findAll(): Promise<School[]> {
    const schools = await this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return schools.map((s) =>
      School.fromPersistence({
        ...s,
        address: s.address ?? undefined,
      }),
    );
  }

  async update(school: School): Promise<School> {
    const data = school.toJSON();
    const updated = await this.prisma.school.update({
      where: { id: data.id },
      data: {
        name: data.name,
        address: data.address,
        updatedAt: data.updatedAt,
      },
    });
    return School.fromPersistence({
      ...updated,
      address: updated.address ?? undefined,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.school.delete({ where: { id } });
  }
}
