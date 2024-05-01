import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/healtcheck")
  getHello(@Res() response: Response) {
    return response.status(HttpStatus.OK).json({ message: "UP_AND_RUNNING" });
  }
}
