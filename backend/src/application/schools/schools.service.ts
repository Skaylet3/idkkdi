import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import {
  ISchoolRepository,
  SCHOOL_REPOSITORY,
} from '../../domain/repositories/school.repository.interface';
import { School } from '../../domain/entities/school.entity';
import { CreateSchoolDto } from './dtos/create-school.dto';
import { UpdateSchoolDto } from './dtos/update-school.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @Inject(SCHOOL_REPOSITORY)
    private readonly schoolRepository: ISchoolRepository,
  ) {}

  async create(dto: CreateSchoolDto, adminId: string): Promise<School> {
    const school = School.create({
      name: dto.name,
      address: dto.address,
      adminId,
    });
    return this.schoolRepository.create(school);
  }

  async findAll(): Promise<School[]> {
    return this.schoolRepository.findAll();
  }

  async findById(id: string): Promise<School> {
    const school = await this.schoolRepository.findById(id);
    if (!school) {
      throw new NotFoundException(`School with ID ${id} not found`);
    }
    return school;
  }

  async update(id: string, dto: UpdateSchoolDto): Promise<School> {
    const school = await this.findById(id);

    if (dto.name) {
      school.updateName(dto.name);
    }
    if (dto.address !== undefined) {
      school.updateAddress(dto.address);
    }

    return this.schoolRepository.update(school);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.schoolRepository.delete(id);
  }
}
