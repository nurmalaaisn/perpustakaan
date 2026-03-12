import { Body, Controller, Delete, Get, Param, Post, Put, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { BukuService } from './buku.service';
import { CreateBukuDto } from './dto/create-buku.dto';
import { UpdateBukuDto } from './dto/update-buku.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Buku')
@ApiBearerAuth('access-token')
@Controller('buku')
@UseGuards(JwtAuthGuard)
export class BukuController {
  constructor(private readonly bukuService: BukuService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tambah buku baru (ADMIN & PETUGAS)' })
  @ApiBody({ type: CreateBukuDto })
  @ApiResponse({ status: 201, description: 'Buku berhasil ditambahkan' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  create(@Body() dto: CreateBukuDto) {
    return this.bukuService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Tampilkan semua data buku' })
  @ApiResponse({ status: 200, description: 'Daftar semua buku' })
  findAll() {
    return this.bukuService.findAll();
  }

  @Get('judul/:title')
  @ApiOperation({ summary: 'Cari buku berdasarkan judul' })
  @ApiParam({ name: 'title', description: 'Judul buku (bisa sebagian)', example: 'Harry Potter' })
  @ApiResponse({ status: 200, description: 'Hasil pencarian buku' })
  findByTitle(@Param('title') title: string) {
    return this.bukuService.findByTitle(title);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Tampilkan detail buku berdasarkan ID' })
  @ApiParam({ name: 'id', description: 'ID buku', example: 1 })
  @ApiResponse({ status: 200, description: 'Detail buku ditemukan' })
  @ApiResponse({ status: 404, description: 'Buku tidak ditemukan' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bukuService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Update data buku (ADMIN & PETUGAS)' })
  @ApiParam({ name: 'id', description: 'ID buku', example: 1 })
  @ApiBody({ type: UpdateBukuDto })
  @ApiResponse({ status: 200, description: 'Buku berhasil diupdate' })
  @ApiResponse({ status: 404, description: 'Buku tidak ditemukan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBukuDto) {
    return this.bukuService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Hapus buku (ADMIN only)' })
  @ApiParam({ name: 'id', description: 'ID buku', example: 1 })
  @ApiResponse({ status: 200, description: 'Buku berhasil dihapus' })
  @ApiResponse({ status: 403, description: 'Akses ditolak' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bukuService.remove(id);
  }
}