// src/students/students.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) { }

  private async generateNIS(role: string): Promise<string> {
    const prefix = role === 'ADMIN' ? 'ADM' : 'PTG';

    const lastStudent = await this.prisma.student.findFirst({
      where: {
        nis: {
          startsWith: prefix,
        },
      },
      orderBy: {
        nis: 'desc',
      },
    });

    let nextNumber = 1;
    if (lastStudent?.nis) {
      const lastNumber = parseInt(lastStudent.nis.replace(prefix, ''));
      nextNumber = lastNumber + 1;
    }

    return `${prefix}${nextNumber.toString().padStart(3, '0')}`;
  }

  async create(dto: CreateStudentDto) {
    const role = dto.role || 'MEMBER';

    if (role === 'MEMBER') {
      if (!dto.nis) {
        throw new BadRequestException('NIS wajib diisi untuk role MEMBER');
      }
      if (!dto.kelas || !dto.jurusan) {
        throw new BadRequestException('Kelas dan Jurusan wajib diisi untuk role MEMBER');
      }
    }

    if (role === 'ADMIN' || role === 'PETUGAS') {
      if (!dto.email) {
        throw new BadRequestException('Email wajib diisi untuk role ADMIN/PETUGAS');
      }
    }

    let nis = dto.nis;
    if (!nis && (role === 'ADMIN' || role === 'PETUGAS')) {
      nis = await this.generateNIS(role);
    }

    // Password default: NIS (untuk MEMBER) atau email (untuk ADMIN/PETUGAS)
    const defaultPassword = nis || dto.email?.split('@')[0] || 'default123';
    const password = dto.password || defaultPassword;
    const hashedPassword = await bcrypt.hash(password, 10);

    const kelas = (role === 'ADMIN' || role === 'PETUGAS') && !dto.kelas
      ? null
      : dto.kelas;

    const jurusan = (role === 'ADMIN' || role === 'PETUGAS') && !dto.jurusan
      ? null
      : dto.jurusan;

    return this.prisma.student.create({
      data: {
        nis: nis,
        name: dto.name,
        email: dto.email,
        kelas: kelas,
        jurusan: jurusan,
        password: hashedPassword,
        role: role,
      },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findAll() {
    return this.prisma.student.findMany({
      orderBy: { id: 'desc' },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async findOne(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByName(name: string) {
    const students = await this.prisma.student.findMany({
      where: {
        name: {
          contains: name
        },
      },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (students.length === 0) {
      throw new NotFoundException('Student dengan nama tersebut tidak ditemukan');
    }

    return students;
  }

  async findByNIS(nis: string) {
    const student = await this.prisma.student.findUnique({
      where: { nis },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!student) {
      throw new NotFoundException('NIS tidak ditemukan');
    }

    return student;
  }

  async update(id: number, dto: UpdateStudentDto) {
    await this.findOne(id);

    const data: any = { ...dto };
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    if (dto.role === 'MEMBER') {
      const currentStudent = await this.prisma.student.findUnique({
        where: { id }
      });

      const finalNIS = dto.nis || currentStudent.nis;
      const finalKelas = dto.kelas || currentStudent.kelas;
      const finalJurusan = dto.jurusan || currentStudent.jurusan;

      if (!finalNIS) {
        throw new BadRequestException('NIS wajib diisi untuk role MEMBER');
      }
      if (!finalKelas || !finalJurusan) {
        throw new BadRequestException('Kelas dan Jurusan wajib diisi untuk role MEMBER');
      }
    }

    return this.prisma.student.update({
      where: { id },
      data,
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.student.delete({
      where: { id },
      select: {
        id: true,
        nis: true,
        name: true,
        email: true,
        kelas: true,
        jurusan: true,
        role: true,
      }
    });
  }
}