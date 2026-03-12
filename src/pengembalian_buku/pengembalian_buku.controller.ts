import { Body, Controller, Get, Param, ParseIntPipe, Post, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { PengembalianService } from './pengembalian_buku.service';
import { CreatePengembalianDto } from './dto/create-pengembalian.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Pengembalian Buku')
@ApiBearerAuth('access-token')
@Controller('pengembalian-buku')
@UseGuards(JwtAuthGuard)
export class PengembalianController {
  constructor(private readonly pengembalianService: PengembalianService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Catat pengembalian buku (ADMIN & PETUGAS)' })
  @ApiBody({ type: CreatePengembalianDto })
  @ApiResponse({ status: 201, description: 'Pengembalian berhasil dicatat' })
  create(@Body() dto: CreatePengembalianDto) {
    return this.pengembalianService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan semua data pengembalian (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar semua pengembalian' })
  findAll() {
    return this.pengembalianService.findAll();
  }

  @Get('denda')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan pengembalian yang terkena denda (ADMIN & PETUGAS)' })
  @ApiResponse({ status: 200, description: 'Daftar pengembalian dengan denda' })
  findWithDenda() {
    return this.pengembalianService.findWithDenda();
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tampilkan detail pengembalian berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID pengembalian', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail pengembalian' })
  @ApiResponse({ status: 404, description: 'Data tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pengembalianService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Hapus data pengembalian (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID pengembalian', example: 1 })
  @ApiResponse({ status: 200, description: 'Pengembalian berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pengembalianService.remove(id);
  }
}