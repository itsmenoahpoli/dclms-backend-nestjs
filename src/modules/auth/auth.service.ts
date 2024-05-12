import * as moment from "moment";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "@/prisma.service";
import { verifyHashedPassword } from "@/utilities";
import type { CredentialsDTO } from "./auth.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async authenticateCredentials(credentials: CredentialsDTO) {
    const { username, password } = credentials;

    const user = await this.prismaService.user.findUnique({
      where: {
        username,
      },
    });

    if (!user || verifyHashedPassword(user.password, password)) {
      return {
        message: "INVALID_ACCOUNT",
      };
    }

    const lastSignin = moment().format("MMMM Do YYYY, h:mm:ss a").toString();

    const updateUser = await this.prismaService.user.update({
      where: { username },
      data: { lastSignin },
      include: {
        userRole: true,
        department: true,
      },
    });

    delete updateUser.password;

    const payload = { sub: user.id, data: user };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: "AUTHENTICATED",
      accessToken,
      user: updateUser,
    };
  }
}
