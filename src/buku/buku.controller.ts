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
@Controller('buku')
// @UseGuards(JwtAuthGuard)  <-- HAPUS ATAU KOMENTARI BARIS INI
export class BukuController {
  constructor(private readonly bukuService: BukuService) {}

  @Post()
  @ApiBearerAuth('access-token') // Pindahkan ini ke sini agar gembok di Swagger muncul hanya di fungsi ini
  @UseGuards(JwtAuthGuard, RolesGuard) // Pasang Guard di sini saja
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  @ApiOperation({ summary: 'Tambah buku baru (ADMIN & PETUGAS)' })
  create(@Body() dto: CreateBukuDto) {
    return this.bukuService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Tampilkan semua data buku' })
  // @Get sekarang bebas akses tanpa Guard
  findAll() {
    return this.bukuService.findAll();
  }

  @Get('judul/:title')
  @ApiOperation({ summary: 'Cari buku berdasarkan judul' })
  // @Get ini juga jadi bebas akses publik
  findByTitle(@Param('title') title: string) {
    return this.bukuService.findByTitle(title);
  }

  // ... dst untuk findOne, biarkan tanpa guard ...

  @Put(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard) // Tetap amankan proses update
  @Roles(UserRole.ADMIN, UserRole.PETUGAS)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateBukuDto) {
    return this.bukuService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard, RolesGuard) // Tetap amankan proses delete
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bukuService.remove(id);
  }
}