import { Test, TestingModule } from '@nestjs/testing';
import { DocumentNoticesService } from './document-notices.service';

describe('DocumentNoticesService', () => {
  let service: DocumentNoticesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DocumentNoticesService],
    }).compile();

    service = module.get<DocumentNoticesService>(DocumentNoticesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
