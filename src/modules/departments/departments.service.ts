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
      include: {
        users: true,
        documents: true,
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
    const departmentExists = await this.prismaService.department.count({
      where: {
        OR: [
          {
            name: departmentData.name,
          },
          {
            title: departmentData.title,
          },
          {
            seriesPrefix: departmentData.seriesPrefix,
          },
        ],
      },
    });

    if (departmentExists) {
      return {
        message: "DEPARTMENT_ALREADY_EXISTS",
      };
    }

    const department = await this.prismaService.department.create({
      data: {
        ...departmentData,
      },
    });

    return department;
  }
}
