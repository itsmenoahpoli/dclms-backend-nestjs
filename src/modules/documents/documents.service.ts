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

  private formatSeriesCount(value: number, seriesNumber: string) {
    console.log(seriesNumber, typeof seriesNumber);
    if (seriesNumber === "000") {
      console.log(+value.toString().padStart(4, "0"));
      Number(value).toString().padStart(4, "0");
    }

    return +seriesNumber + value;
  }

  private async getSourceDocumentCount(departmentId: number) {
    const sourceDocCount = await this.prismaService.document.count({
      where: {
        departmentId,
      },
    });

    return sourceDocCount;
  }

  private async createSeriesNumber(departmentId: number, department: string, departmentSeriesNumber: string, sourceDoc: string) {
    /** Format: {sourceDoc-department-0000(fileCount by document sourceDocument type)} (example: FM-SOC-0002) */
    const departmentAcronym = makeAcronyms(department);
    const sourceDocAcronym = makeAcronyms(sourceDoc);
    const seriesNumber = this.formatSeriesCount((await this.getSourceDocumentCount(departmentId)) + 1, departmentSeriesNumber);

    return `${sourceDocAcronym}-${departmentAcronym}-${seriesNumber}`;
  }

  async getDocuments() {
    const documents = await this.prismaService.document.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status: "pending",
      },
      include: {
        originator: true,
        department: true,
        documentNotices: true,
      },
    });

    return documents;
  }

  async getDocumentsByStatus(status: "pending" | "approved") {
    const documents = await this.prismaService.document.findMany({
      orderBy: {
        id: "desc",
      },
      where: {
        status,
      },
      include: {
        originator: true,
        department: true,
        documentNotices: true,
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
        documentNotices: true,
      },
    });

    return documents;
  }

  async getDocument(id: number) {
    const document = await this.prismaService.document.findUnique({
      where: { id },
      include: {
        originator: true,
        department: true,
        documentNotices: true,
      },
    });

    return document;
  }

  async archiveDepartment(id: number) {
    const document = await this.prismaService.document.update({
      where: { id },
      data: {
        archivedAt: new Date().toISOString(),
      },
    });
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
    const seriesNumber = await this.createSeriesNumber(
      documentData.departmentId,
      department.name,
      department.seriesPrefix,
      documentData.sourceDocument
    );

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
      documentId: document.id,
      approvalDate: new Date().toISOString(),
      approvedBy: "SYSTEM",
    } as DocumentNoticeDTO);

    return { document, documentNotice };
  }
}
