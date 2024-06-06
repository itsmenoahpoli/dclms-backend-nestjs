import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsEnum, IsNotEmpty, IsOptional } from "class-validator";
import { Document } from "@prisma/client";

export enum SourceDocument {
  QM = "Quality Management",
  PM = "Procedures Manual",
  FM = "Forms Manual",
  RM = "Records Management Manual",
  DI = "Document Information",
}

export enum DocumentStatus {
  PENDING = "pending",
  ONGOING = "ongoing",
  APPROVED = "approved",
  FINISHED = "finished",
}

export class DocumentDTO implements Partial<Document> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEnum(SourceDocument)
  sourceDocument: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  externalUrl: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  totalPages: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  remarks: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  originatorUserId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;
}
