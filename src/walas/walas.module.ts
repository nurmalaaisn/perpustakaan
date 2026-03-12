import { Module } from '@nestjs/common';
import { WalasService } from './walas.service';
import { WalasController } from './walas.controller';

@Module({
  providers: [WalasService],
  controllers: [WalasController]
})
export class WalasModule {}
