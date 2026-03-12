import { Test, TestingModule } from '@nestjs/testing';
import { PengembalianBukuController } from './pengembalian_buku.controller';

describe('PengembalianBukuController', () => {
  let controller: PengembalianBukuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PengembalianBukuController],
    }).compile();

    controller = module.get<PengembalianBukuController>(PengembalianBukuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
