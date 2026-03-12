import { Test, TestingModule } from '@nestjs/testing';
import { WalasService } from './walas.service';

describe('WalasService', () => {
  let service: WalasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalasService],
    }).compile();

    service = module.get<WalasService>(WalasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
