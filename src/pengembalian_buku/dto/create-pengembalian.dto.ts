import { IsInt, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePengembalianDto {
  @ApiProperty({ example: 1, description: 'ID data peminjaman yang dikembalikan' })
  @IsInt()
  id_peminjaman: number;

  @ApiPropertyOptional({ example: '2026-03-07T00:00:00.000Z', description: 'Tanggal kembali (default: sekarang)' })
  @IsDateString()
  @IsOptional()
  tanggal_kembali?: string;
}