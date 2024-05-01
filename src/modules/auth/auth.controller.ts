import { Controller, Res, Post, Body, HttpStatus } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AuthService } from "./auth.service";
import type { CredentialsDTO } from "./auth.dto";

@ApiTags("Auth API")
@Controller({
  path: "auth",
  version: "1",
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: "Successfully authenticated user credentials (email, password)",
  })
  @ApiResponse({
    status: 401,
    description: "Credentials (email, password) that were provided was invalid",
  })
  @Post("/login")
  async loginHandler(@Body() credentialsDTO: CredentialsDTO, @Res() response: Response) {
    const data = await this.authService.authenticateCredentials(credentialsDTO);

    if (!data) {
      return response.status(HttpStatus.UNAUTHORIZED).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }
}
