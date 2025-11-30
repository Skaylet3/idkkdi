/* eslint-disable prettier/prettier */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { LoginDto } from './dtos/login.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../infrastructure/auth/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Get schoolId based on role
    let schoolId: string | undefined;

    if (user.role === 'DIRECTOR') {
      const directorSchool = await this.prisma.directorSchool.findFirst({
        where: { userId: user.id },
      });
      schoolId = directorSchool?.schoolId;
    } else if (user.role === 'TEACHER') {
      const teacherSchool = await this.prisma.teacherSchool.findFirst({
        where: { userId: user.id },
      });
      schoolId = teacherSchool?.schoolId;
    }

    // Generate JWT payload
    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role as 'ADMIN' | 'DIRECTOUR' | 'TEACHER',
      schoolId,
    };

    // Generate JWT token
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        schoolId,
      },
    };
  }
}
