import { Test, TestingModule } from '@nestjs/testing';
import { DocumentNoticesController } from './document-notices.controller';

describe('DocumentNoticesController', () => {
  let controller: DocumentNoticesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentNoticesController],
    }).compile();

    controller = module.get<DocumentNoticesController>(DocumentNoticesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
