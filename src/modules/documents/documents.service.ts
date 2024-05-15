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
    console.log("formatSeriesCount", value);
    if (value < 10) {
      console.log("value < 10");
      return `000${value}`;
    }

    if (value < 100 && value > 10) {
      return `00${value}`;
    }

    if (value < 1000 && value > 100) {
      return `0${value}`;
    }
  }

  private async getSourceDocumentCount(sourceDoc: string, departmentId: number) {
    const sourceDocCount = await this.prismaService.document.count({
      where: {
        sourceDocument: sourceDoc,
        departmentId,
      },
    });

    return sourceDocCount;
  }

  private async createSeriesNumber(departmentId: number, department: string, sourceDoc: string) {
    /** Format: {sourceDoc-department-0000(fileCount by document sourceDocument type)} (example: FM-SOC-0002) */
    const departmentAcronym = makeAcronyms(department);
    const sourceDocAcronym = makeAcronyms(sourceDoc);
    const seriesNumber = this.formatSeriesCount((await this.getSourceDocumentCount(sourceDoc, departmentId)) + 1);

    return `${sourceDocAcronym}-${departmentAcronym}-${seriesNumber}`;
  }

  async getDocuments() {
    const documents = await this.prismaService.document.findMany({
      orderBy: {
        id: "desc",
      },
      include: {
        originator: true,
        department: true,
      },
    });

    return documents;
  }

  async getDocumentsByDepartment(departmentId: number) {
    const documents = await this.prismaService.document.findMany({
      where: {
        departmentId,
      },
      orderBy: {
        id: "desc",
      },
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
    const checkDocumentName = await this.prismaService.document.findUnique({
      where: {
        name: documentData.name,
      },
    });

    const checkDocumentUrl = await this.prismaService.document.findUnique({
      where: {
        externalUrl: documentData.externalUrl,
      },
    });

    if (checkDocumentName || checkDocumentUrl) {
      return {
        hasValidationError: true,
        message: "DOCUMENT_NAME_OR_URL_ALREADY_USED",
        document: null,
        department: null,
      };
    }

    const department = await this.departmentsService.getDepartment(documentData.departmentId);
    const seriesNumber = await this.createSeriesNumber(documentData.departmentId, department.name, documentData.sourceDocument);

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
