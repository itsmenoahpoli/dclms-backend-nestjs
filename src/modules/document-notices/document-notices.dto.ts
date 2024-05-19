import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
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
  @IsOptional()
  @IsString()
  approvalDate: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  approvedBy: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  requestedBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}
