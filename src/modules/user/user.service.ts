import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "nestjs-prisma";
import { admin } from "../../config/firebase-admin";

// In-memory store for revoked user IDs and their revocation timestamps
// This will be checked by the auth middleware to reject tokens from revoked users
export const revokedUsers = new Map<string, number>();

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async createUser(
    firebaseUid: string,
    email: string,
    name?: string,
  ): Promise<User> {
    return this.prisma.user.upsert({
      where: { firebaseUid },
      update: {}, // Don't update anything on existing users
      create: {
        firebaseUid,
        email,
        name,
      },
    });
  }

  async getUserByUid(firebaseUid: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { firebaseUid },
    });
  }

  async findAllClients(params: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<{
    data: User[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    // Build the where clause based on the provided filters
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get total count for pagination
    const total = await this.prisma.user.count({ where });

    // Get the users with pagination
    const users = await this.prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    });

    return {
      data: users,
      total,
      page,
      limit,
    };
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Revokes a user's session by adding them to the revoked users list
   * and attempting to revoke their Firebase tokens
   */
  async revokeUserSession(firebaseUid: string): Promise<void> {
    // Add the user to the revoked users map with the current timestamp
    // This is the primary mechanism for session invalidation and will work
    // even if Firebase token revocation fails
    revokedUsers.set(firebaseUid, Date.now());
    console.log(`Added user ${firebaseUid} to revoked users list`);

    // Attempt to revoke Firebase tokens, but don't let failures affect our process
    try {
      // Try to revoke all Firebase tokens for this user
      await admin.auth().revokeRefreshTokens(firebaseUid);
      console.log(
        `Successfully revoked Firebase tokens for user: ${firebaseUid}`,
      );
    } catch (error) {
      // Log the error but continue - our custom revocation mechanism will still work
      console.error(
        `Error revoking Firebase tokens for user ${firebaseUid}:`,
        error,
      );
      console.log(`Continuing with custom token revocation mechanism only`);
    }
  }

  /**
   * Cleans up old entries from the revoked users map
   * This should be called periodically, e.g., by a cron job
   */
  cleanupRevokedUsers(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const now = Date.now();
    for (const [uid, timestamp] of revokedUsers.entries()) {
      if (now - timestamp > maxAgeMs) {
        revokedUsers.delete(uid);
      }
    }
  }
}
