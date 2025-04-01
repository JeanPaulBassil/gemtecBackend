import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserService } from "../user/user.service";
import { PrismaService } from "nestjs-prisma";
import { AuthService } from "./auth.service";

@Module({
  controllers: [AuthController],
  providers: [UserService, PrismaService, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
