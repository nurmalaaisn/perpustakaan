import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBukuDto } from './dto/create-buku.dto';
import { UpdateBukuDto } from './dto/update-buku.dto';

@Injectable()
export class BukuService {
  constructor(private readonly prisma: PrismaService) { }

  async create(dto: CreateBukuDto) {
    return this.prisma.buku.create({ data: dto });
  }

  async findAll() {
    return this.prisma.buku.findMany({ orderBy: { id: 'desc' } });
  }

  async findOne(id: number) {
    const buku = await this.prisma.buku.findUnique({
      where: { id },
    });

    if (!buku) throw new NotFoundException('Buku tidak ditemukan');
    return buku;
  }

  async findByTitle(title: string) {
    const buku = await this.prisma.buku.findMany({
      where: {
        title: {
          contains: title
        },
      },
    });
    if (buku.length === 0) {
      throw new NotFoundException('Judul buku tidak ditemukan');
    }
    return buku;
  }

  async update(id: number, dto: UpdateBukuDto) {
    await this.findOne(id);
    return this.prisma.buku.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.buku.delete({
      where: { id },
    });
  }
}
