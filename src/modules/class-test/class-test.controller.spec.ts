import { Test, TestingModule } from '@nestjs/testing';
import { ClassTestController } from './class-test.controller';
import { ClassTestService } from './class-test.service';

describe('ClassTestController', () => {
  let controller: ClassTestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassTestController],
      providers: [ClassTestService],
    }).compile();

    controller = module.get<ClassTestController>(ClassTestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
