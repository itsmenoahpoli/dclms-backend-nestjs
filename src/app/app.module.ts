import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { JWT_CONSTANTS } from "@/modules/auth/auth.constants";
import { PrismaService } from "@/prisma.service";
import { AppController } from "@/app/app.controller";
import { AppService } from "@/app/app.service";
import { AuthModule } from "@/modules/auth/auth.module";
import { DepartmentsModule } from "@/modules/departments/departments.module";
import { UserRolesModule } from "@/modules/user-roles/user-roles.module";
import { AccountsModule } from "@/modules/accounts/accounts.module";
import { DocumentsModule } from "@/modules/documents/documents.module";
import { DocumentNoticesModule } from "@/modules/document-notices/document-notices.module";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env", isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: JWT_CONSTANTS.secret,
      signOptions: {
        expiresIn: "48h", // expires in 2 days
      },
    }),
    AuthModule,
    DepartmentsModule,
    UserRolesModule,
    AccountsModule,
    DocumentsModule,
    DocumentNoticesModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
