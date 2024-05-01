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
    const { email, password } = credentials;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        userRole: true,
      },
    });

    if (!user || verifyHashedPassword(user.password, password)) {
      return {
        message: "INVALID_ACCOUNT",
      };
    }

    delete user.password;

    const payload = { sub: user.id, data: user };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: "AUTHENTICATED",
      accessToken,
      user,
    };
  }
}
