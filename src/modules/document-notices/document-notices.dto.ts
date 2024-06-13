import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import type { DocumentNotice, DocumentNoticeComply } from "@prisma/client";

export enum DocumentNoticeNature {
  CREATION = "creation",
  REVISION = "revision",
  ADDITION = "addition",
  ARCHIVE = "archive",
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
  type: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  externalUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pageNumber: string;

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
  complyBy: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  requestedBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  documentId: number;
}

export class DocumentNoticeComplyDTO implements Partial<DocumentNoticeComply> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  details: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  externalUrl?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pageNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  complyBy: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  documentId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  documentNoticeId: number;
}
