import * as moment from "moment";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentNoticesService } from "@/modules/document-notices/document-notices.service";
import { DocumentDTO, SourceDocument } from "./documents.dto";
import { DocumentNoticeDTO, DocumentNoticeNature } from "@/modules/document-notices/document-notices.dto";
import { DepartmentsService } from "@/modules/departments/departments.service";
import { makeAcronyms } from "@/utilities";

@Injectable()
export class DocumentsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly documentNoticesService: DocumentNoticesService,
    private readonly departmentsService: DepartmentsService
  ) {}

  private formatSeriesCount(value: number) {
    if (value < 1000 && value > 100) {
      return Number.parseInt(`0${value}`);
    }

    if (value < 100 && value > 10) {
      return Number.parseInt(`00${value}`);
    }

    if (value < 10) {
      return Number.parseInt(`000${value}`);
    }

    return value;
  }

  private async getSourceDocumentCount(sourceDoc: string) {
    const sourceDocCount = await this.prismaService.document.count({
      where: {
        sourceDocument: sourceDoc,
      },
    });

    return sourceDocCount;
  }

  private async createSeriesNumber(department: string, sourceDoc: string) {
    /** Format: {sourceDoc-department-0000(fileCount by document sourceDocument type)} (example: FM-SOC-0002) */
    const departmentAcronym = makeAcronyms(department);
    const sourceDocAcronym = makeAcronyms(sourceDoc);
    const seriesNumber = this.formatSeriesCount((await this.getSourceDocumentCount(sourceDoc)) + 1);

    return `${sourceDocAcronym}-${departmentAcronym}-${seriesNumber}`;
  }

  async getDocuments() {
    const documents = await this.prismaService.document.findMany({
      include: {
        originator: true,
        department: true,
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
    const department = await this.departmentsService.getDepartment(documentData.departmentId);
    const seriesNumber = await this.createSeriesNumber(department.name, documentData.sourceDocument);

    const document = await this.prismaService.document.create({
      // @ts-ignore
      data: {
        seriesNumber,
        ...documentData,
      },
      include: {
        department: true,
        originator: true,
      },
    });

    const documentNotice = await this.documentNoticesService.createDocumentNotice({
      details: `Document was created this date: ${moment().format("MMMM Do YYYY, h:mm:ss a")}`,
      nature: DocumentNoticeNature.CREATION,
      requestedBy: department.name,
    } as DocumentNoticeDTO);

    return { document, documentNotice };
  }
}
