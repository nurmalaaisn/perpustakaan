import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWalasDto } from './dto/create-walas.dto';
import { UpdateWalasDto } from './dto/update-walas.dto';

@Injectable()
export class WalasService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateWalasDto) {
    return this.prisma.walas.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.walas.findMany();
  }

  findOne(id: number) {
    return this.prisma.walas.findUnique({
      where: { id_walas: id },
    });
  }

  update(id: number, dto: UpdateWalasDto) {
    return this.prisma.walas.update({
      where: { id_walas: id },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prisma.walas.delete({
      where: { id_walas: id },
    });
  }
}
