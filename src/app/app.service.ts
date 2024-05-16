import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class AppService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDashboardStatistics() {
    const documents = await this.prismaService.document.findMany();
    const totalDocumentsCount = documents.length;
    const totalPendingDocumentsCount = documents.filter((d) => d.status === "pending").length;
    const totalFormsSubmittedCount = documents.length;
    const totalDepartmentsCount = await this.prismaService.department.count();

    return {
      totalDocumentsCount,
      totalPendingDocumentsCount,
      totalFormsSubmittedCount,
      totalDepartmentsCount,
    };
  }
}
