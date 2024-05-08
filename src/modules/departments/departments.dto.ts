import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty } from "class-validator";
import { Department } from "@prisma/client";

export class DepartmentDTO implements Partial<Department> {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
}
