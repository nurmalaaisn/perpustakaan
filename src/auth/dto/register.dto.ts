import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'Budi Santoso', description: 'Nama lengkap' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: '12345', description: 'NIS siswa' })
    @IsString()
    @IsNotEmpty()
    nis: string;

    @ApiProperty({ example: 'budi@sekolah.com', description: 'Email siswa' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'password123', description: 'Password minimal 6 karakter', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}