import { Teacher } from '../entities/teacher.entity';

export interface ITeacherRepository {
  create(teacher: Teacher, schoolId: string): Promise<Teacher>;
  findById(id: string): Promise<Teacher | null>;
  findByEmail(email: string): Promise<Teacher | null>;
  findAll(): Promise<Teacher[]>;
  findBySchoolId(schoolId: string): Promise<Teacher[]>;
  update(teacher: Teacher): Promise<Teacher>;
  delete(id: string): Promise<void>;
}

export const TEACHER_REPOSITORY = 'TEACHER_REPOSITORY';
