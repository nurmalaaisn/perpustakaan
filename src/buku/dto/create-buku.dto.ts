import { IsString, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBukuDto {
  @ApiProperty({ example: 'Harry Potter', description: 'Judul buku' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'J.K. Rowling', description: 'Nama pengarang' })
  @IsString()
  author: string;

  @ApiProperty({ example: 1997, description: 'Tahun terbit', minimum: 1900 })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({ example: 5, description: 'Jumlah stok buku', minimum: 0 })
  @IsInt()
  @Min(0)
  stok: number;
}