import { IsString, IsEmail, IsOptional, IsEnum, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class CreateStudentDto {
  @ApiPropertyOptional({ description: 'NIS siswa' })
  @IsString()
  @IsOptional()
  nis?: string;

  @ApiProperty({ description: 'Nama lengkap siswa' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Email siswa' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ description: 'Kelas siswa' })
  @IsString()
  @IsOptional()
  kelas?: string;

  @ApiPropertyOptional({ description: 'Jurusan siswa' })
  @IsString()
  @IsOptional()
  jurusan?: string;

  @ApiPropertyOptional({ description: 'Password minimal 6 karakter', minLength: 6 })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional({ enum: UserRole, description: 'Role pengguna' })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}