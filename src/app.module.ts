import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { StudentsModule } from './students/students.module';
import { BukuModule } from './buku/buku.module';
import { WalasModule } from './walas/walas.module';
import { PeminjamanModule } from './peminjaman_buku/peminjaman_buku.module';
import { PengembalianModule } from './pengembalian_buku/pengembalian_buku.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
    }),
    PrismaModule,
    StudentsModule,
    BukuModule,
    WalasModule,
    PeminjamanModule,
    PengembalianModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}