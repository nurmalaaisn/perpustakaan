import { Module } from '@nestjs/common';
import { PengembalianService } from './pengembalian_buku.service';
import { PengembalianController } from './pengembalian_buku.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PengembalianController],
  providers: [PengembalianService],
  exports: [PengembalianService],
})
export class PengembalianModule {}