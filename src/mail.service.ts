import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export class MailService {
  private mailerSend: MailerSend;

  constructor(private readonly configService: ConfigService) {
    this.mailerSend = new MailerSend({ apiKey: this.configService.get<string>("MAILERSEND_API_KEY") });
  }

  public sendMail() {
    //
  }
}
