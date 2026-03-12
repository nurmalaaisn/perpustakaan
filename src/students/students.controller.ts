import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Students')
@ApiBearerAuth('access-token')
@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tambah siswa baru (ADMIN only)' })
  @ApiBody({ type: CreateStudentDto })
  @ApiResponse({ status: 201, description: 'Siswa berhasil ditambahkan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan semua data siswa (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar semua siswa' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get('name/:name')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Cari siswa berdasarkan nama' })
  @ApiParam({ name: 'name', description: 'Nama siswa', example: 'Budi' })
  @ApiResponse({ status: 200, description: 'Hasil pencarian siswa' })
  findByName(@Param('name') name: string) {
    return this.studentsService.findByName(name);
  }

  @Get('nis/:nis')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Cari siswa berdasarkan NIS' })
  @ApiParam({ name: 'nis', description: 'NIS siswa', example: '12345' })
  @ApiResponse({ status: 200, description: 'Data siswa ditemukan' })
  findByNIS(@Param('nis') nis: string) {
    return this.studentsService.findByNIS(nis);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tampilkan detail siswa berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID siswa', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail siswa' })
  @ApiResponse({ status: 404, description: 'Siswa tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update data siswa (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID siswa', example: 1 })
  @ApiBody({ type: UpdateStudentDto })
  @ApiResponse({ status: 200, description: 'Siswa berhasil diupdate' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Hapus data siswa (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID siswa', example: 1 })
  @ApiResponse({ status: 200, description: 'Siswa berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }
}