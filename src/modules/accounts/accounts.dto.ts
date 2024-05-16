import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsNotEmpty, IsOptional } from "class-validator";
import { User } from "@prisma/client";

export class AccountDTO implements Partial<User> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  userRoleId: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  departmentId: number;
}
