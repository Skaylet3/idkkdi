import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import {
  IDirectorRepository,
  DIRECTOR_REPOSITORY,
} from '../../domain/repositories/director.repository.interface';
import {
  ISchoolRepository,
  SCHOOL_REPOSITORY,
} from '../../domain/repositories/school.repository.interface';
import { Director } from '../../domain/entities/director.entity';
import { CreateDirectorDto } from './dtos/create-director.dto';
import { UpdateDirectorDto } from './dtos/update-director.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DirectorsService {
  constructor(
    @Inject(DIRECTOR_REPOSITORY)
    private readonly directorRepository: IDirectorRepository,
    @Inject(SCHOOL_REPOSITORY)
    private readonly schoolRepository: ISchoolRepository,
  ) {}

  async create(dto: CreateDirectorDto): Promise<Director> {
    // Validate school exists
    const school = await this.schoolRepository.findById(dto.schoolId);
    if (!school) {
      throw new BadRequestException(`School with ID ${dto.schoolId} not found`);
    }

    // Check if email already exists
    const existingDirector = await this.directorRepository.findByEmail(
      dto.email,
    );
    if (existingDirector) {
      throw new ConflictException('Director with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create director
    const director = Director.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    return this.directorRepository.create(director, dto.schoolId);
  }

  async findAll(): Promise<Director[]> {
    return this.directorRepository.findAll();
  }

  async findById(id: string): Promise<Director> {
    const director = await this.directorRepository.findById(id);
    if (!director) {
      throw new NotFoundException(`Director with ID ${id} not found`);
    }
    return director;
  }

  async findBySchoolId(schoolId: string): Promise<Director[]> {
    return this.directorRepository.findBySchoolId(schoolId);
  }

  async update(id: string, dto: UpdateDirectorDto): Promise<Director> {
    const director = await this.findById(id);

    if (dto.email) {
      director.updateEmail(dto.email);
    }
    if (dto.name) {
      director.updateName(dto.name);
    }

    return this.directorRepository.update(director);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.directorRepository.delete(id);
  }
}
