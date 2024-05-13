import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DepartmentsService } from "./departments.service";
import { DepartmentDTO } from "./departments.dto";

@ApiTags("Departments API")
@Controller({
  path: "departments",
  version: "1",
})
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @ApiResponse({
    status: 200,
    description: "List of departments",
  })
  @Get("/")
  async getDepartmentsHandler(@Res() response: Response) {
    const data = await this.departmentsService.getDepartments();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Get department by id",
  })
  @Get("/:id")
  async getDepartmentHandler(@Param() id: number, @Res() response: Response) {
    const data = await this.departmentsService.getDepartment(id);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update department by id",
  })
  @Patch("/:id")
  async updateDepartmentHandler(@Param("id") id: number, @Body() departmentDTO: DepartmentDTO, @Res() response: Response) {
    const data = await this.departmentsService.updateDepartment(id, departmentDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 204,
    description: "Delete department by id",
  })
  @Delete("/:id")
  async deleteDepartmentHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.departmentsService.deleteDepartment(id);

    return response.status(HttpStatus.NO_CONTENT).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created department",
  })
  @Post("/")
  async createDepartmentHandler(@Body() departmentDTO: DepartmentDTO, @Res() response: Response) {
    const data = await this.departmentsService.createDepartment(departmentDTO);

    return response.status(HttpStatus.CREATED).json(data);
  }
}
