import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsEnum, IsNotEmpty } from "class-validator";
import type { DocumentNotice } from "@prisma/client";

export enum DocumentNoticeNature {
  CREATION = "creation",
  REVISION = "revision",
  ADDITION = "addition",
  DELETION = "deletion",
}

export class DocumentNoticeDTO implements Partial<DocumentNotice> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(DocumentNoticeNature)
  nature: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  approvalDate: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  approvedBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  requestedBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  originatorUserId: string;
}
