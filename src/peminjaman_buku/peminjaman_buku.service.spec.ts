import { Test, TestingModule } from '@nestjs/testing';
import { PeminjamanBukuService } from './peminjaman_buku.service';

describe('PeminjamanBukuService', () => {
  let service: PeminjamanBukuService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PeminjamanBukuService],
    }).compile();

    service = module.get<PeminjamanBukuService>(PeminjamanBukuService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
