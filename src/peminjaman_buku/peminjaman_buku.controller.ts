import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseIntPipe, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PeminjamanService } from './peminjaman_buku.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Peminjaman Buku')
@ApiBearerAuth('access-token')
@Controller('peminjaman-buku')
@UseGuards(JwtAuthGuard)
export class PeminjamanController {
  constructor(private readonly peminjamanService: PeminjamanService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Buat data peminjaman buku (ADMIN & PETUGAS)' })
  @ApiBody({ type: CreatePeminjamanDto })
  @ApiResponse({ status: 201, description: 'Peminjaman berhasil dibuat' })
  create(@Body() dto: CreatePeminjamanDto) {
    return this.peminjamanService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan semua data peminjaman (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar semua peminjaman' })
  findAll() {
    return this.peminjamanService.findAll();
  }

  @Get('active')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan peminjaman yang masih aktif (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar peminjaman aktif' })
  findActive() {
    return this.peminjamanService.findActive();
  }

  @Get('overdue')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan peminjaman yang terlambat (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar peminjaman overdue' })
  findOverdue() {
    return this.peminjamanService.findOverdue();
  }

  @Get('me')
  @ApiOperation({ summary: 'Tampilkan peminjaman milik siswa yang sedang login' })
  @ApiResponse({ status: 200, description: 'Daftar peminjaman siswa login' })
  findMyPeminjaman(@Request() req) {
    return this.peminjamanService.findByStudent(req.user.nis);
  }

  @Get('student/:nis')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan peminjaman berdasarkan NIS siswa (ADMIN & PETUGAS)' })
  @ApiParam({ name: 'nis', description: 'NIS siswa', example: '12345' })
  @ApiResponse({ status: 200, description: 'Daftar peminjaman siswa' })
  findByStudent(@Param('nis') nis: string) {
    return this.peminjamanService.findByStudent(nis);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tampilkan detail peminjaman berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID peminjaman', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail peminjaman' })
  @ApiResponse({ status: 404, description: 'Peminjaman tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.peminjamanService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Hapus data peminjaman (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID peminjaman', example: 1 })
  @ApiResponse({ status: 200, description: 'Peminjaman berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.peminjamanService.remove(id);
  }
}