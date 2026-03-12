import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePengembalianDto } from './dto/create-pengembalian.dto';

@Injectable()
export class PengembalianService {
    constructor(private prisma: PrismaService) { }

    private hitungDenda(tanggalKembali: Date, tenggat: Date): number {
        const diffTime = tanggalKembali.getTime() - tenggat.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays <= 0) return 0;

        return diffDays * 1000;
    }

    async create(dto: CreatePengembalianDto) {
        const peminjaman = await this.prisma.peminjamanBuku.findUnique({
            where: { id_peminjaman: dto.id_peminjaman },
            include: {
                student: true,
                buku: true,
                pengembalians: true,
            },
        });

        if (!peminjaman) {
            throw new NotFoundException('Peminjaman tidak ditemukan');
        }

        if (peminjaman.pengembalians.length > 0) {
            throw new BadRequestException('Buku sudah dikembalikan sebelumnya');
        }

        const tanggalKembali = dto.tanggal_kembali
            ? new Date(dto.tanggal_kembali)
            : new Date();

        const denda = this.hitungDenda(tanggalKembali, peminjaman.tenggat_kembali);

        const pengembalian = await this.prisma.pengembalian.create({
            data: {
                id_peminjaman: dto.id_peminjaman,
                tanggal_kembali: tanggalKembali,
                denda: denda,
            },
            include: {
                peminjamanBuku: {
                    include: {
                        student: {
                            select: {
                                name: true,
                                nis: true,
                                email: true,
                            },
                        },
                        buku: {
                            select: {
                                title: true,
                                author: true,
                            },
                        },
                    },
                },
            },
        });

        await this.prisma.buku.update({
            where: { id: peminjaman.id_buku },
            data: { stok: { increment: 1 } },
        });

        return pengembalian;
    }

    async findAll() {
        return this.prisma.pengembalian.findMany({
            orderBy: { tanggal_kembali: 'desc' },
            include: {
                peminjamanBuku: {
                    include: {
                        student: {
                            select: {
                                name: true,
                                nis: true,
                            },
                        },
                        buku: {
                            select: {
                                title: true,
                                author: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findWithDenda() {
        return this.prisma.pengembalian.findMany({
            where: {
                denda: {
                    gt: 0,
                },
            },
            orderBy: { denda: 'desc' },
            include: {
                peminjamanBuku: {
                    include: {
                        student: {
                            select: {
                                name: true,
                                nis: true,
                                email: true,
                            },
                        },
                        buku: {
                            select: {
                                title: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        const pengembalian = await this.prisma.pengembalian.findUnique({
            where: { id_pengembalian: id },
            include: {
                peminjamanBuku: {
                    include: {
                        student: true,
                        buku: true,
                    },
                },
            },
        });

        if (!pengembalian) {
            throw new NotFoundException('Pengembalian tidak ditemukan');
        }

        return pengembalian;
    }

    async remove(id: number) {
        const pengembalian = await this.findOne(id);

        await this.prisma.buku.update({
            where: { id: pengembalian.peminjamanBuku.id_buku },
            data: { stok: { decrement: 1 } },
        });

        return this.prisma.pengembalian.delete({
            where: { id_pengembalian: id },
        });
    }
}