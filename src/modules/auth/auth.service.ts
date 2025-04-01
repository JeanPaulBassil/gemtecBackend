import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { admin } from "../../config/firebase-admin";

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async verifyToken(token: string) {
    if (!token) {
      throw new UnauthorizedException("No token provided");
    }

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException("Invalid token");
    }
  }

  async login(token: string, userData: { name: string; email: string }) {
    const decodedToken = await this.verifyToken(token);
    const firebaseUid = decodedToken.uid;
    const email = userData.email.toLowerCase();

    // Create or update user
    const user = await this.userService.createUser(
      firebaseUid,
      email,
      userData.name,
    );

    return {
      message: "Login successful",
      user: {
        ...user,
        isAllowed: true, // Add isAllowed flag for frontend compatibility
      },
    };
  }
}
