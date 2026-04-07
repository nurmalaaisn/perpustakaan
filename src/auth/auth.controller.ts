import { Controller, Post, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { StudentsService } from '../students/students.service';
import { LoginDto } from './dto/login.dto';
import { CreateStudentDto } from '../students/dto/create-student.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { RegisterStaffDto } from './dto/register-staff.dto';


@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private studentsService: StudentsService,
    ) { }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login dan dapatkan JWT token' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login berhasil, token dikembalikan' })
    @ApiResponse({ status: 401, description: 'Email atau password salah' })
    login(@Body() dto: LoginDto) {
        return this.authService.login(dto.email, dto.password);
    }

    @Post('register')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Registrasi siswa baru (ADMIN only)' })
    @ApiBody({ type: CreateStudentDto })
    @ApiResponse({ status: 201, description: 'Siswa berhasil didaftarkan' })
    @ApiResponse({ status: 403, description: 'Akses ditolak' })
    register(@Body() dto: CreateStudentDto) {
        return this.studentsService.create(dto);
    }

    @Post('register-admin')
    // @ApiBearerAuth('access-token') <--- Komentari dulu
    // @UseGuards(JwtAuthGuard, RolesGuard) <--- Komentari dulu
    // @Roles(UserRole.ADMIN) <--- Komentari dulu
    @ApiOperation({ summary: 'Registrasi Admin baru' })
    @ApiBody({ type: RegisterStaffDto })
    registerAdmin(@Body() dto: RegisterStaffDto) {
        return this.authService.registerAdmin(dto.email, dto.password);
    }

    @Post('register-petugas')
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Registrasi Petugas baru (ADMIN only) - hanya email & password' })
    @ApiBody({ type: RegisterStaffDto })
    registerPetugas(@Body() dto: RegisterStaffDto) {
        return this.authService.registerPetugas(dto.email, dto.password);
    }
}