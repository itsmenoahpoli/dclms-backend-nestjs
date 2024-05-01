import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentNoticeDTO } from "./document-notices.dto";

@Injectable()
export class DocumentNoticesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDocumentNotices() {
    const documentNotices = await this.prismaService.documentNotice.findMany();

    return documentNotices;
  }

  async createDocumentNotice(documentNoticeData: DocumentNoticeDTO) {
    const revisionNumber = 0;

    const documentNotice = await this.prismaService.documentNotice.create({
      data: {
        revisionNumber,
        ...documentNoticeData,
      },
    });

    return documentNotice;
  }
}
