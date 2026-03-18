import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async register(name: string, nis: string, email: string, password: string) {
        const existingEmail = await this.prisma.student.findUnique({
            where: { email },
        });
        if (existingEmail) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const existingNis = await this.prisma.student.findUnique({
            where: { nis },
        });
        if (existingNis) {
            throw new ConflictException('NIS sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await this.prisma.student.create({
            data: {
                name,
                nis,
                email,
                password: hashedPassword,
                role: 'MEMBER',
            },
        });

        const payload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            role: student.role,
            nis: student.nis,
        };

        return {
            message: 'Registrasi berhasil',
            access_token: this.jwtService.sign(payload),
        };
    }


    async registerAdmin(email: string, password: string) {
        const existingEmail = await this.prisma.student.findUnique({
            where: { email },
        });
        if (existingEmail) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await this.prisma.student.create({
            data: {
                name: 'Admin',
                nis: `ADM-${Date.now()}`, // auto-generate NIS
                email,
                password: hashedPassword,
                role: 'ADMIN',
            },
        });

        const payload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            role: student.role,
            nis: student.nis,
        };

        return {
            message: 'Registrasi Admin berhasil',
            access_token: this.jwtService.sign(payload),
        };
    }

    async registerPetugas(email: string, password: string) {
        const existingEmail = await this.prisma.student.findUnique({
            where: { email },
        });
        if (existingEmail) {
            throw new ConflictException('Email sudah terdaftar');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await this.prisma.student.create({
            data: {
                name: 'Petugas',
                nis: `PTG-${Date.now()}`, // auto-generate NIS
                email,
                password: hashedPassword,
                role: 'PETUGAS',
            },
        });

        const payload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            role: student.role,
            nis: student.nis,
        };

        return {
            message: 'Registrasi Petugas berhasil',
            access_token: this.jwtService.sign(payload),
        };
    }

    async login(email: string, password: string) {
        const student = await this.prisma.student.findUnique({
            where: { email },
        });

        if (!student) {
            throw new UnauthorizedException('Email tidak ditemukan');
        }

        const passwordValid = await bcrypt.compare(password, student.password);
        if (!passwordValid) {
            throw new UnauthorizedException('Password salah');
        }

        const payload = {
            sub: student.id,
            email: student.email,
            name: student.name,
            role: student.role,
            nis: student.nis,
        };

        return {
            message: 'Login berhasil',
            access_token: this.jwtService.sign(payload),
        };
    }
}