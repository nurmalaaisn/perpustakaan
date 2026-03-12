import { Test, TestingModule } from '@nestjs/testing';
import { WalasController } from './walas.controller';

describe('WalasController', () => {
  let controller: WalasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WalasController],
    }).compile();

    controller = module.get<WalasController>(WalasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
