import { Test, TestingModule } from '@nestjs/testing';
import { ClassTestService } from './class-test.service';

describe('ClassTestService', () => {
  let service: ClassTestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassTestService],
    }).compile();

    service = module.get<ClassTestService>(ClassTestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
