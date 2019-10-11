import { Test, TestingModule } from '@nestjs/testing';
import { FrontController } from './front.controller';

describe('Front Controller', () => {
  let controller: FrontController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FrontController],
    }).compile();

    controller = module.get<FrontController>(FrontController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
