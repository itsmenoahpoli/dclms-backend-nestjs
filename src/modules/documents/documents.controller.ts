import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DocumentsService } from "./documents.service";
import { DocumentDTO } from "./documents.dto";

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
    description: "List of archived documents",
  })
  @Get("/archived")
  async getArchivedDocumentsHandler(@Res() response: Response) {
    const data = await this.documentsService.getArchivedDocuments();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "List of documents by status",
  })
  @Get("/status/:status")
  async getDocumentsByStatusHandler(@Param("status") status: "approved" | "in-progress" | "pending", @Res() response: Response) {
    const data = await this.documentsService.getDocumentsByStatus(status);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "List of documents by department",
  })
  @Get("/department/:departmentId")
  async getDocumentsByDepartmentHandler(@Param("departmentId") departmentId: number, @Res() response: Response) {
    const data = await this.documentsService.getDocumentsByDepartment(+departmentId);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "List of archived documents by department",
  })
  @Get("/archived/department/:departmentId")
  async getArchivedDocumentsByDepartmentHandler(@Param("departmentId") departmentId: number, @Res() response: Response) {
    const data = await this.documentsService.getArchivedDocumentsByDepartment(+departmentId);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Get document by id",
  })
  @Get("/:id")
  async getDocumentHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.documentsService.getDocument(+id);

    if (!data) {
      return response.status(HttpStatus.NOT_FOUND).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Archive document by id",
  })
  @Post("/archive/:id")
  async archiveDocumentHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.documentsService.getDocument(+id);

    if (!data) {
      return response.status(HttpStatus.NOT_FOUND).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Decline document by id",
  })
  @Post("/approve/:id")
  async approveDocumentHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.documentsService.updateStatusDocument(+id, "approved");

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Decline document by id",
  })
  @Post("/decline/:id")
  async declineDocumentHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.documentsService.updateStatusDocument(+id, "declined");

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created document",
  })
  @Post("/")
  async createDocumentsHandler(@Body() documentDTO: DocumentDTO, @Res() response: Response) {
    const data = await this.documentsService.createDocument(documentDTO);

    if (data.hasValidationError) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }
}
