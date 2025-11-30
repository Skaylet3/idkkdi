import { School } from '../entities/school.entity';

export interface ISchoolRepository {
  create(school: School): Promise<School>;
  findById(id: string): Promise<School | null>;
  findAll(): Promise<School[]>;
  update(school: School): Promise<School>;
  delete(id: string): Promise<void>;
}

export const SCHOOL_REPOSITORY = 'SCHOOL_REPOSITORY';
