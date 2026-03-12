// src/auth/strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private prisma: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
        });
    }

    async validate(payload: any) {
        // Payload berisi data dari JWT yang di-sign saat login
        const student = await this.prisma.student.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                nis: true,
                name: true,
                email: true,
                role: true,
            },
        });

        if (!student) {
            throw new UnauthorizedException('User tidak ditemukan');
        }

        // Data ini akan tersimpan di request.user
        return student;
    }
}