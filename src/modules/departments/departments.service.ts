import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import type { DepartmentDTO } from "./departments.dto";

@Injectable()
export class DepartmentsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getDepartments() {
    const departments = await this.prismaService.department.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return departments;
  }

  async getDepartment(id: number) {
    const department = await this.prismaService.department.findUnique({
      where: {
        id,
      },
    });

    return department;
  }

  async updateDepartment(id: number, departmentData: DepartmentDTO) {
    const department = await this.prismaService.department.update({
      where: {
        id,
      },
      data: {
        ...departmentData,
      },
    });

    return department;
  }

  async deleteDepartment(id: number) {
    const department = await this.prismaService.department.delete({
      where: {
        id,
      },
    });

    return department;
  }

  async createDepartment(departmentData: DepartmentDTO) {
    const department = await this.prismaService.department.create({
      data: {
        ...departmentData,
      },
    });

    return department;
  }
}
