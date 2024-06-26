import { Controller, Res, Get, Post, Patch, Delete, Body, Param, HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiParam } from "@nestjs/swagger";
import { Response } from "express";
import { UserRolesService } from "./user-roles.service";
import { UserRoleDTO } from "./user-roles.dto";

@ApiTags("User Roles API")
@Controller({
  path: "user-roles",
  version: "1",
})
@Controller("user-roles")
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @ApiResponse({
    status: 200,
    description: "Get list of user roles",
  })
  @Get("/")
  async getRolesHandler(@Res() response: Response) {
    const data = await this.userRolesService.getRoles();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Create new user role",
  })
  @Post("/")
  async createRoleHandler(@Body() userRoleDTO: UserRoleDTO, @Res() response: Response) {
    const data = await this.userRolesService.createRole(userRoleDTO);

    return response.status(HttpStatus.CREATED).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update user role",
  })
  @Patch("/:id")
  async updateRoleHandler(@Param("id") id: number, @Body() userRoleDTO: UserRoleDTO, @Res() response: Response) {
    const data = await this.userRolesService.updateRole(+id, userRoleDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 204,
    description: "Delete user role",
  })
  @Delete("/:id")
  async deleteRoleHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.userRolesService.deleteRole(+id);

    return response.status(HttpStatus.NO_CONTENT).json(data);
  }
}
