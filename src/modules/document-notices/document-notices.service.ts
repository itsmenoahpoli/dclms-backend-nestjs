import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentNoticeDTO } from "./document-notices.dto";

@Injectable()
export class DocumentNoticesService {
  constructor(private readonly prismaService: PrismaService) {}

  private async getRevisionDocumentRevisionNumber(documentId: number) {
    const { documentNotices } = await this.prismaService.document.findUnique({
      where: {
        id: documentId,
      },
      include: {
        documentNotices: true,
      },
    });

    return documentNotices.length;
  }

  async getDocumentNotices() {
    const documentNotices = await this.prismaService.documentNotice.findMany();

    return documentNotices;
  }

  async approveDocumentNotice(id: number) {
    const documentNotices = await this.prismaService.documentNotice.update({
      where: {
        id,
      },
      data: {
        approvedBy: "DOCUMENT-CONTROLLER",
        approvalDate: new Date().toISOString(),
      },
    });

    return documentNotices;
  }

  async createDocumentNotice(documentNoticeData: DocumentNoticeDTO) {
    const revisionNumber = await this.getRevisionDocumentRevisionNumber(documentNoticeData.documentId);
    const documentNotice = await this.prismaService.documentNotice.create({
      data: {
        revisionNumber,
        nature: documentNoticeData.nature.toLowerCase(),
        ...documentNoticeData,
      },
    });

    return documentNotice;
  }
}
