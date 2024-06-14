import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DocumentNoticesService } from "./document-notices.service";
import { DocumentNoticeDTO, DocumentNoticeComplyDTO } from "./document-notices.dto";

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

  @ApiResponse({
    status: 200,
    description: "Successfully approved document notice",
  })
  @Post("/approve/:id")
  async approveDocumentNoticeHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.documentNoticesService.approveDocumentNotice(+id);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully created document comply notice",
  })
  @Post("/comply/add")
  async addDocumentComplyNoticeHandler(@Body() documentNoticeComplyDTO: DocumentNoticeComplyDTO, @Res() response: Response) {
    const data = await this.documentNoticesService.addDocumentComplyNotice(documentNoticeComplyDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully approved document comply notice",
  })
  @Patch("comply-notice/:noticeComplyId/approve")
  async approveDocumentComplyNoticeStatusHandler(@Param("noticeComplyId") noticeComplyId: number, @Res() response: Response) {
    const data = await this.documentNoticesService.updateDocumentNoticeComplyStatus(+noticeComplyId, "approved");

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Successfully declined document comply notice",
  })
  @Patch("comply-notice/:noticeComplyId/decline")
  async declineDocumentComplyNoticeStatusHandler(@Param("noticeComplyId") noticeComplyId: number, @Res() response: Response) {
    const data = await this.documentNoticesService.updateDocumentNoticeComplyStatus(+noticeComplyId, "declined");

    return response.status(HttpStatus.OK).json(data);
  }
}
