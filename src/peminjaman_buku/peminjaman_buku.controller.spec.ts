import { Test, TestingModule } from '@nestjs/testing';
import { PeminjamanBukuController } from './peminjaman_buku.controller';

describe('PeminjamanBukuController', () => {
  let controller: PeminjamanBukuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeminjamanBukuController],
    }).compile();

    controller = module.get<PeminjamanBukuController>(PeminjamanBukuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
