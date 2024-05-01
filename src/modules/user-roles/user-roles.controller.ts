import { Controller, Res, Post, Body, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UserRolesService } from './user-roles.service';
import { UserRoleDTO } from './user-roles.dto';

@ApiTags('User Roles API')
@Controller({
  path: 'user-roles',
  version: '1',
})
@Controller('user-roles')
export class UserRolesController {
  constructor(private readonly userRolesService: UserRolesService) {}

  @ApiResponse({
    status: 200,
    description: 'Get list of user roles',
  })
  @Post('/')
  async getRolesHandler(@Res() response: Response) {
    const data = await this.userRolesService.getRoles();

    return response.status(HttpStatus.OK).json(data);
  }
}
