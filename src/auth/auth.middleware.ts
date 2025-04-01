import * as admin from "firebase-admin";
import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { PrismaService } from "nestjs-prisma";
import { revokedUsers } from "../modules/user/user.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      this.logger.log(`Verifying token: ${token.substring(0, 10)}...`);
      const decodedToken = await admin.auth().verifyIdToken(token);
      this.logger.log(
        `Token verified successfully for user: ${decodedToken.uid}`,
      );

      // Check if the user's token has been revoked
      if (revokedUsers.has(decodedToken.uid)) {
        this.logger.warn(
          `Rejecting request from revoked user: ${decodedToken.uid}`,
        );
        return res.status(401).json({
          message: "Token revoked",
          error: "Your account has been deactivated.",
          code: "AUTH_USER_DEACTIVATED",
        });
      }

      const user = await this.prisma.user.findUnique({
        where: { firebaseUid: decodedToken.uid },
      });

      if (!user) {
        this.logger.warn(
          `User not found for Firebase UID: ${decodedToken.uid}`,
        );
        return res.status(403).json({ message: "User not found" });
      }

      req["user"] = user;
      next();
    } catch (error) {
      this.logger.error(
        `Token verification failed: ${error.message}`,
        error.stack,
      );

      // Check for specific Firebase auth errors
      if (error.code === "auth/id-token-expired") {
        return res.status(401).json({
          message: "Token expired",
          error:
            "Your authentication token has expired. Please refresh the page to get a new token.",
        });
      } else if (error.code === "auth/id-token-revoked") {
        return res.status(401).json({
          message: "Token revoked",
          error:
            "Your authentication token has been revoked. Please log in again.",
        });
      } else if (error.code === "auth/invalid-id-token") {
        return res.status(401).json({
          message: "Invalid token",
          error: "Your authentication token is invalid. Please log in again.",
        });
      }

      // Generic error for other cases
      return res
        .status(401)
        .json({ message: "Invalid token", error: error.message });
    }
  }
}
