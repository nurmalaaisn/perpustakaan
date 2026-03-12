import { PartialType } from '@nestjs/swagger';
import { CreatePengembalianDto } from './create-pengembalian.dto';

export class UpdatePengembalianDto extends PartialType(CreatePengembalianDto) {}