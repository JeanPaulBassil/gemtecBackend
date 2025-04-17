// This is a temporary fix to handle missing type declarations

declare module '@nestjs/common' {
  export const Injectable: any;
  export const Controller: any;
  export const Get: any;
  export const Post: any;
  export const Put: any;
  export const Delete: any;
  export const Body: any;
  export const Param: any;
  export const Query: any;
  export const HttpException: any;
  export const HttpStatus: any;
  export const Module: any;
  export const NestModule: any;
  export const MiddlewareConsumer: any;
  export const RequestMethod: any;
  export const Logger: any;
}

declare module '@nestjs/config' {
  export const ConfigModule: any;
}

declare module 'nestjs-prisma' {
  export const PrismaModule: any;
  export const loggingMiddleware: any;
  export interface QueryInfo {
    model: string;
    action: string;
    executionTime: number;
  }
} 