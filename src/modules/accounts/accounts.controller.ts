import { Controller, Res, Get, Post, Patch, Delete, Body, HttpStatus, Param } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { AccountsService } from "./accounts.service";
import { AccountDTO } from "./accounts.dto";

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
  @Post("/:id")
  async getAccountHandler(@Param() id: number, @Res() response: Response) {
    const data = await this.accountsService.getAccount(id);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 200,
    description: "Update account by id",
  })
  @Patch("/:id")
  async updateAccountHandler(@Param() id: number, @Body() accountDTO: AccountDTO, @Res() response: Response) {
    const data = await this.accountsService.updateAccount(id, accountDTO);

    return response.status(HttpStatus.OK).json(data);
  }

  @ApiResponse({
    status: 201,
    description: "Successfully created user account",
  })
  @Post("/")
  async createAccountHandler(@Body() accountDTO: AccountDTO, @Res() response: Response) {
    const data = await this.accountsService.createAccount(accountDTO);

    if (data.message === "EMAIL_ALREADY_USED") {
      return response.status(HttpStatus.BAD_REQUEST).json(data);
    }

    return response.status(HttpStatus.CREATED).json(data);
  }
}
