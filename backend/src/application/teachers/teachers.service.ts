import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import {
  ITeacherRepository,
  TEACHER_REPOSITORY,
} from '../../domain/repositories/teacher.repository.interface';
import { Teacher } from '../../domain/entities/teacher.entity';
import { CreateTeacherDto } from './dtos/create-teacher.dto';
import { UpdateTeacherDto } from './dtos/update-teacher.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Injectable()
export class TeachersService {
  constructor(
    @Inject(TEACHER_REPOSITORY)
    private readonly teacherRepository: ITeacherRepository,
  ) {}

  async create(dto: CreateTeacherDto, director: JwtPayload): Promise<Teacher> {
    // Validate director has schoolId
    if (!director.schoolId) {
      throw new ForbiddenException('Director not assigned to school');
    }

    // Check if email already exists
    const existingTeacher = await this.teacherRepository.findByEmail(dto.email);
    if (existingTeacher) {
      throw new ConflictException('Teacher with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create teacher
    const teacher = Teacher.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
    });

    // Auto-assign to director's school
    return this.teacherRepository.create(teacher, director.schoolId);
  }

  async findAll(): Promise<Teacher[]> {
    return this.teacherRepository.findAll();
  }

  async findById(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findById(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async findBySchoolId(schoolId: string): Promise<Teacher[]> {
    return this.teacherRepository.findBySchoolId(schoolId);
  }

  async update(id: string, dto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findById(id);

    if (dto.email) {
      teacher.updateEmail(dto.email);
    }
    if (dto.name) {
      teacher.updateName(dto.name);
    }

    return this.teacherRepository.update(teacher);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    await this.teacherRepository.delete(id);
  }
}
