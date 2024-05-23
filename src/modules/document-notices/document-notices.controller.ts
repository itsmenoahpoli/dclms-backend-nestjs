import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DocumentNoticesService } from "./document-notices.service";
import { DocumentNoticeDTO } from "./document-notices.dto";

@ApiTags("Document Notices API")
@Controller({
  path: "document-notices",
  version: "1",
})
export class DocumentNoticesController {
  constructor(private readonly documentNoticesService: DocumentNoticesService) {}

  @ApiResponse({
    status: 200,
    description: "Get document notices list",
  })
  @Get("/")
  async getDocumentNoticesHandler(@Res() response: Response) {
    const data = await this.documentNoticesService.getDocumentNotices();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created document notice",
  })
  @Post("/")
  async createDocumentNoticeHandler(@Body() documentNoticeDTO: DocumentNoticeDTO, @Res() response: Response) {
    const data = await this.documentNoticesService.createDocumentNotice(documentNoticeDTO);

    return response.status(HttpStatus.OK).json(data);
  }
}
