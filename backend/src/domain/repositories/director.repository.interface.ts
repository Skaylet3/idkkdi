import { Director } from '../entities/director.entity';

export interface IDirectorRepository {
  create(director: Director, schoolId: string): Promise<Director>;
  findById(id: string): Promise<Director | null>;
  findByEmail(email: string): Promise<Director | null>;
  findAll(): Promise<Director[]>;
  findBySchoolId(schoolId: string): Promise<Director[]>;
  update(director: Director): Promise<Director>;
  delete(id: string): Promise<void>;
}

export const DIRECTOR_REPOSITORY = 'DIRECTOR_REPOSITORY';
