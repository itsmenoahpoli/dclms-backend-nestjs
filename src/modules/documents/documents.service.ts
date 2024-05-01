import moment from "moment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentNoticesService } from "@/modules/document-notices/document-notices.service";
import { makeArcronyms } from "@/utilities";
import { DocumentDTO, SourceDocument } from "./documents.dto";
import { DocumentNoticeDTO, DocumentNoticeNature } from "@/modules/document-notices/document-notices.dto";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentNoticesService: DocumentNoticesService
  ) {}

  private async getSourceDocumentCount(sourceDoc: string) {
    const sourceDocCount = await this.prismaService.document.count({
      where: {
        sourceDocument: sourceDoc,
      },
    });

    return sourceDocCount;
  }

  private async getSeriesCode(department: string, sourceDoc: string) {
    /** Format: {sourceDoc-department-0000(fileCount by document sourceDocument type)} (example: FM-SOC-0002) */
    const departmentAcronym = makeArcronyms(department);

    return departmentAcronym;
  }

  async getDocuments() {
    const documents = await this.prismaService.document.findMany({
      include: {
        originator: true,
      },
    });

    return documents;
  }

  async getDocument(id: number) {
    const document = await this.prismaService.document.findUnique({
      where: { id },
    });

    return document;
  }

  async createDocument(documentData: DocumentDTO) {
    const seriesNumber = await this.getSeriesCode("school of med", SourceDocument.QM);

    const document = await this.prismaService.document.create({
      // @ts-ignore
      data: {
        ...documentData,
      },
      include: {
        originator: true,
      },
    });

    const documentNotice = await this.documentNoticesService.createDocumentNotice({
      details: `Document was created this date: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
      nature: DocumentNoticeNature.CREATION,
    } as DocumentNoticeDTO);

    return { document, documentNotice };
  }
}
