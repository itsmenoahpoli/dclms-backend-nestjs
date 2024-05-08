import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentsController } from "./documents.controller";
import { DocumentsService } from "./documents.service";
import { DocumentNoticesService } from "@/modules/document-notices/document-notices.service";
import { DepartmentsService } from "@/modules/departments/departments.service";

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaService, DocumentNoticesService, DepartmentsService],
})
export class DocumentsModule {}
