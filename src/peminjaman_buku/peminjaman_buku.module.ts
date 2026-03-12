// src/peminjaman_buku/peminjaman_buku.module.ts
import { Module } from '@nestjs/common';
import { PeminjamanService } from './peminjaman_buku.service';
import { PeminjamanController } from './peminjaman_buku.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PeminjamanController],
  providers: [PeminjamanService],
  exports: [PeminjamanService],
})
export class PeminjamanModule {}