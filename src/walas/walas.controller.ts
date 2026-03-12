import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalasService } from './walas.service';
import { CreateWalasDto } from './dto/create-walas.dto';
import { UpdateWalasDto } from './dto/update-walas.dto';

@Controller('walas')
export class WalasController {
  constructor(private readonly walasService: WalasService) {}

  @Post()
  create(@Body() dto: CreateWalasDto) {
    return this.walasService.create(dto);
  }

  @Get()
  findAll() {
    return this.walasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walasService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateWalasDto) {
    return this.walasService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.walasService.remove(+id);
  }
}
