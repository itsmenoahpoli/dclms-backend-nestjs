import { Module } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { DocumentNoticesController } from "./document-notices.controller";
import { DocumentNoticesService } from "./document-notices.service";

@Module({
  controllers: [DocumentNoticesController],
  providers: [DocumentNoticesService, PrismaService],
})
export class DocumentNoticesModule {}
