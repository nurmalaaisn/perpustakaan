import { PartialType } from '@nestjs/swagger';
import { CreateBukuDto } from './create-buku.dto';

export class UpdateBukuDto extends PartialType(CreateBukuDto) {}