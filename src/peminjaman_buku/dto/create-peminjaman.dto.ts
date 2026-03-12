import { IsString, IsInt, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePeminjamanDto {
    @ApiProperty({ example: '12345', description: 'NIS siswa peminjam' })
    @IsString()
    nis: string;

    @ApiProperty({ example: 1, description: 'ID buku yang dipinjam' })
    @IsInt()
    id_buku: number;

    @ApiPropertyOptional({ example: '2026-04-01T00:00:00.000Z', description: 'Tenggat waktu pengembalian (ISO 8601)' })
    @IsDateString()
    @IsOptional()
    tenggat_kembali?: string;
}