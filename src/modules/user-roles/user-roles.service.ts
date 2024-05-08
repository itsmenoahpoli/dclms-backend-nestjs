import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { UserRole } from "./user-roles.dto";

@Injectable()
export class UserRolesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRoles() {
    const roles = await this.prismaService.userRole.findMany({
      include: {
        users: true,
      },
    });

    return roles;
  }

  async getRole(id: number) {
    const role = await this.prismaService.userRole.findUnique({
      where: { id },
    });

    return role;
  }

  async updateRole(id: number, userRole: Partial<UserRole>) {
    const role = await this.prismaService.userRole.update({
      where: { id },
      data: { ...userRole },
    });

    return role;
  }

  async deleteRole(id: number) {
    const role = await this.prismaService.userRole.delete({
      where: {
        id,
      },
    });

    return role;
  }

  async createRole(userRole: UserRole) {
    userRole.abilities = JSON.stringify(userRole.abilities);

    const role = await this.prismaService.userRole.create({
      data: {
        ...userRole,
      },
    });

    return role;
  }
}
