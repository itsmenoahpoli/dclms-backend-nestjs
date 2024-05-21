import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma.service";
import { hashPassword, verifyHashedPassword } from "@/utilities";
import type { AccountDTO, AccountProfileDTO, AccountPasswordDTO } from "./accounts.dto";

@Injectable()
export class AccountsService {
  constructor(private readonly prismaService: PrismaService) {}

  private async checkEmailExistence(email: string) {
    const emailFound = (await this.prismaService.user.count({ where: { email } })) > 0;

    return emailFound;
  }

  async getAccounts() {
    const accounts = await this.prismaService.user.findMany({
      where: {
        userRoleId: {
          not: 1,
        },
      },
      include: {
        department: true,
        userRole: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return accounts;
  }

  async getAccount(id: number) {
    const account = await this.prismaService.user.findUnique({
      where: {
        id,
      },
      include: {
        userRole: true,
      },
    });

    return account;
  }

  async updateAccount(id: number, accountData: AccountDTO) {
    if (!accountData.departmentId) {
      accountData.departmentId = null;
    }

    const account = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...accountData,
        username: accountData.username.toLowerCase(),
      },
      include: {
        userRole: true,
      },
    });

    return account;
  }

  async updateAccountPassword(id: number, accountPasswordData: AccountPasswordDTO) {
    const { password: userPassword } = await this.prismaService.user.findUnique({ where: { id } });

    if (verifyHashedPassword(accountPasswordData.old_password, userPassword)) {
      const account = await this.prismaService.user.update({
        where: {
          id,
        },
        data: {
          password: hashPassword(accountPasswordData.new_password),
        },
        include: {
          userRole: true,
        },
      });

      return account;
    }

    return null;
  }

  async updateAccountProfile(id: number, accountProfileData: AccountProfileDTO) {
    const account = await this.prismaService.user.update({
      where: {
        id,
      },
      data: {
        ...accountProfileData,
        username: accountProfileData.username.toLowerCase(),
      },
      include: {
        userRole: true,
      },
    });

    return account;
  }

  async deleteAccount(id: number) {
    const account = await this.prismaService.user.delete({
      where: {
        id,
      },
    });

    return account;
  }

  async createAccount(accountData: AccountDTO) {
    if (await this.checkEmailExistence(accountData.email)) {
      return {
        message: "EMAIL_USED_ALREADY",
      };
    }

    if (!accountData.departmentId) {
      accountData.departmentId = null;
    }

    const account = await this.prismaService.user.create({
      data: {
        ...accountData,
        username: accountData.username.toLowerCase(),
        password: hashPassword(accountData.password),
      },
      include: {
        userRole: true,
      },
    });

    return {
      message: "ACCOUNT_CREATED",
      account,
    };
  }
}
