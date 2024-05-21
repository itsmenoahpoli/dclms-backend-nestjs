import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AccountsService } from "./accounts.service";
import { AccountDTO, AccountProfileDTO, AccountPasswordDTO } from "./accounts.dto";

@ApiTags("Accounts API")
@Controller({
  path: "accounts",
  version: "1",
})
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @ApiResponse({
    status: 200,
    description: "List of accounts",
  })
  @Get("/")
  async getAccountsHandler(@Res() response: Response) {
    const data = await this.accountsService.getAccounts();

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Get account by id",
  })
  @Get("/:id")
  async getAccountHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.accountsService.getAccount(+id);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update account by id",
  })
  @Patch("/:id")
  async updateAccountHandler(@Param("id") id: number, @Body() accountDTO: AccountDTO, @Res() response: Response) {
    const data = await this.accountsService.updateAccount(+id, accountDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update account profile by id",
  })
  @Patch("/:id/profile")
  async updateAccountProfileHandler(@Param("id") id: number, @Body() accountProfileDTO: AccountProfileDTO, @Res() response: Response) {
    const data = await this.accountsService.updateAccountProfile(+id, accountProfileDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update account password by id",
  })
  @Patch("/:id/password")
  async updateAccountPasswordHandler(@Param("id") id: number, @Body() accountPasswordDTO: AccountPasswordDTO, @Res() response: Response) {
    const data = await this.accountsService.updateAccountPassword(+id, accountPasswordDTO);

    if (!data) {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 204,
    description: "Update account by id",
  })
  @Delete("/:id")
  async deleteAccountHandler(@Param("id") id: number, @Res() response: Response) {
    const data = await this.accountsService.deleteAccount(+id);

    return response.status(HttpStatus.NO_CONTENT).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created user account",
  })
  @ApiResponse({
    status: 400,
    description: "Email may have already been used | Form data is incorrect",
  })
  @Post("/")
  async createAccountHandler(@Body() accountDTO: AccountDTO, @Res() response: Response) {
    const data = await this.accountsService.createAccount(accountDTO);

    if (data.message === "EMAIL_USED_ALREADY") {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }
}
