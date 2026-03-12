import { Test, TestingModule } from '@nestjs/testing';
import { PengembalianBukuService } from './pengembalian_buku.service';

describe('PengembalianBukuService', () => {
  let service: PengembalianBukuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PengembalianBukuService],
    }).compile();

    service = module.get<PengembalianBukuService>(PengembalianBukuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
