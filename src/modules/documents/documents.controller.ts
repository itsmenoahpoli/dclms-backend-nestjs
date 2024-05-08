import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DocumentsService } from "./documents.service";
import { DocumentDTO } from "./documents.dto";
import { AuthGuard } from "@/guards";

@ApiTags("Documents API")
@Controller({
  path: "documents",
  version: "1",
})
// @UseGuards(AuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @ApiResponse({
    status: 200,
    description: "List of documents",
  })
  @Get("/")
  async getDocumentsHandler(@Res() response: Response) {
    const data = await this.documentsService.getDocuments();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Get document by id",
  })
  @Get("/")
  async getDocumentHandler(@Param() id: number, @Res() response: Response) {
    const data = await this.documentsService.getDocument(id);

    if (!data) {
      return response.status(HttpStatus.NOT_FOUND).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created document",
  })
  @Post("/")
  async createDocumentsHandler(@Body() documentDTO: DocumentDTO, @Res() response: Response) {
    const data = await this.documentsService.createDocument(documentDTO);

    return response.status(HttpStatus.OK).json(data);
  }
}
