import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule, QueryInfo, loggingMiddleware } from "nestjs-prisma";
import { LoggerMiddleware, RealIpMiddleware } from "src/common/middleware";
import { UserModule } from "../user/user.module";
// import { AuthMiddleware } from "src/auth/auth.middleware";
import { validateConfig } from "../config/config.schema";
import { JobModule } from "../job/job.module";
import { QuoteModule } from "../quote/quote.module";
import { ContactModule } from "../contact/contact.module";
import { application } from "express";
// import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: (config: Record<string, any>) => {
        return validateConfig(config);
      },
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        explicitConnect: true,
        middlewares: [
          loggingMiddleware({
            logger: new Logger("PrismaMiddleware"),
            logLevel: "log",
            logMessage: (query: QueryInfo) =>
              `[Prisma Query] ${query.model}.${query.action} - ${query.executionTime}ms`,
          }),
        ],
      },
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: "redis", // or localhost if not using Docker
    //     port: 6379,
    //   },
    // }),
    // BullModule.registerQueue({
    //   name: "sms-validation-queue",
    // }),
    // AuthModule,
    // AuthModule,
    UserModule,
    JobModule,
    QuoteModule,
    ContactModule,
    ApplicationModule,
  ],
  controllers: [AppController],
  // providers: [
  //   {
  //     provide: APP_GUARD,
  //     useClass: JwtAuthGuard,
  //   },
  //   {
  //     provide: APP_INTERCEPTOR,
  //     useClass: ClassSerializerInterceptor,
  //   },
  // ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, RealIpMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });

    // Temporarily disabled authentication
    // consumer
    //   .apply(AuthMiddleware)
    //   .exclude(
    //     { path: "auth/login", method: RequestMethod.POST },
    //     { path: "auth/register", method: RequestMethod.POST },
    //     { path: "auth/refresh", method: RequestMethod.POST },
    //   )
    //   .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
