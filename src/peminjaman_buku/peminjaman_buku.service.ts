import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePeminjamanDto } from './dto/create-peminjaman.dto';

@Injectable()
export class PeminjamanService {
  constructor(private prisma: PrismaService) { }

  async create(dto: CreatePeminjamanDto) {
    const student = await this.prisma.student.findUnique({
      where: { nis: dto.nis },
    });
    if (!student) {
      throw new NotFoundException('Student dengan NIS tersebut tidak ditemukan');
    }

    const buku = await this.prisma.buku.findUnique({
      where: { id: dto.id_buku },
    });
    if (!buku) {
      throw new NotFoundException('Buku tidak ditemukan');
    }
    if (buku.stok <= 0) {
      throw new BadRequestException('Stok buku habis');
    }

    const existingPeminjaman = await this.prisma.peminjamanBuku.findFirst({
      where: {
        nis: dto.nis,
        id_buku: dto.id_buku,
        pengembalians: {
          none: {}, // Belum ada pengembalian
        },
      },
    });
    if (existingPeminjaman) {
      throw new BadRequestException('Student masih memiliki peminjaman aktif untuk buku ini');
    }

    const tenggat = dto.tenggat_kembali
      ? new Date(dto.tenggat_kembali)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 hari

    const peminjaman = await this.prisma.peminjamanBuku.create({
      data: {
        nis: dto.nis,
        id_buku: dto.id_buku,
        tenggat_kembali: tenggat,
      },
      include: {
        student: {
          select: {
            name: true,
            kelas: true,
            jurusan: true,
          },
        },
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
      },
    });

    await this.prisma.buku.update({
      where: { id: dto.id_buku },
      data: { stok: { decrement: 1 } },
    });

    return peminjaman;
  }

  async findAll() {
    return this.prisma.peminjamanBuku.findMany({
      orderBy: { tanggal_pinjam: 'desc' },
      include: {
        student: {
          select: {
            name: true,
            kelas: true,
            jurusan: true,
          },
        },
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
        pengembalians: true,
      },
    });
  }

  async findActive() {
    return this.prisma.peminjamanBuku.findMany({
      where: {
        pengembalians: {
          none: {}, // Belum ada pengembalian
        },
      },
      orderBy: { tanggal_pinjam: 'desc' },
      include: {
        student: {
          select: {
            name: true,
            kelas: true,
            jurusan: true,
          },
        },
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
      },
    });
  }

  async findOverdue() {
    const now = new Date();
    return this.prisma.peminjamanBuku.findMany({
      where: {
        tenggat_kembali: {
          lt: now,
        },
        pengembalians: {
          none: {},
        },
      },
      orderBy: { tenggat_kembali: 'asc' },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            kelas: true,
          },
        },
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
      },
    });
  }

  async findByStudent(nis: string) {
    return this.prisma.peminjamanBuku.findMany({
      where: { nis },
      orderBy: { tanggal_pinjam: 'desc' },
      include: {
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
        pengembalians: true,
      },
    });
  }

  async findOne(id: number) {
    const peminjaman = await this.prisma.peminjamanBuku.findUnique({
      where: { id_peminjaman: id },
      include: {
        student: {
          select: {
            name: true,
            email: true,
            kelas: true,
            jurusan: true,
          },
        },
        buku: {
          select: {
            title: true,
            author: true,
          },
        },
        pengembalians: true,
      },
    });

    if (!peminjaman) {
      throw new NotFoundException('Peminjaman tidak ditemukan');
    }

    return peminjaman;
  }

  async remove(id: number) {
    const peminjaman = await this.findOne(id);

    // Cek apakah sudah ada pengembalian
    if (peminjaman.pengembalians.length > 0) {
      throw new BadRequestException('Peminjaman sudah dikembalikan, tidak bisa dihapus');
    }

    // Kembalikan stok buku
    await this.prisma.buku.update({
      where: { id: peminjaman.id_buku },
      data: { stok: { increment: 1 } },
    });

    return this.prisma.peminjamanBuku.delete({
      where: { id_peminjaman: id },
    });
  }
}