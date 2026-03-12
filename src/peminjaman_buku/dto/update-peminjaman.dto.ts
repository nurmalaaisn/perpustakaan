import { PartialType } from '@nestjs/swagger';
import { CreatePeminjamanDto } from './create-peminjaman.dto';

export class UpdatePeminjamanDto extends PartialType(CreatePeminjamanDto) {}