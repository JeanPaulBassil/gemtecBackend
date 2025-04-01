import {
  Controller,
  Post,
  Req,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @ApiOperation({ summary: "Login with Firebase token" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  async login(@Req() req, @Body() body: { name: string; email: string }) {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      throw new HttpException("No token provided", HttpStatus.UNAUTHORIZED);
    }

    try {
      return await this.authService.login(token, body);
    } catch (error) {
      console.error("Authentication Error:", error);
      throw new HttpException(
        error.message || "Authentication failed",
        error.status || HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
