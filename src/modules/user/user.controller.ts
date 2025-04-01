import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  HttpStatus,
  HttpException,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { QueryUsersDto, UpdateUserDto } from "./dto";

@ApiTags("users")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("create")
  @ApiOperation({ summary: "Create a new user" })
  @ApiResponse({ status: 201, description: "User created successfully" })
  async createUser(
    @Body() body: { firebaseUid: string; email: string; name?: string },
  ) {
    return this.userService.createUser(body.firebaseUid, body.email, body.name);
  }

  @Get(":uid")
  @ApiOperation({ summary: "Get user by Firebase UID" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUser(@Param("uid") firebaseUid: string) {
    const user = await this.userService.getUserByUid(firebaseUid);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Get()
  @ApiOperation({ summary: "Get all clients with pagination and search" })
  @ApiResponse({ status: 200, description: "Return clients with pagination" })
  async findAllClients(@Query() query: QueryUsersDto) {
    return this.userService.findAllClients({
      page: query.page,
      limit: query.limit,
      search: query.search,
    });
  }

  @Get("id/:id")
  @ApiOperation({ summary: "Get user by ID" })
  @ApiResponse({ status: 200, description: "User found" })
  @ApiResponse({ status: 404, description: "User not found" })
  async getUserById(@Param("id") id: string) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a user" })
  @ApiResponse({ status: 200, description: "User updated successfully" })
  @ApiResponse({ status: 404, description: "User not found" })
  async updateUser(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    try {
      return await this.userService.updateUser(id, updateUserDto);
    } catch (error) {
      if (error.code === "P2025") {
        throw new HttpException("User not found", HttpStatus.NOT_FOUND);
      }
      throw error;
    }
  }
}
