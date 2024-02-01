import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { RumsanUserModule } from '@rumsan/user';
// import { PrismaModule } from '@rumsan/prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '@rumsan/prisma';
import { QueueModule } from '@rumsan/queue';
import { RumsanUsersModule } from '@rumsan/user';
import { ListenerModule } from '../listener/listener.module';
import { ProjectModule } from '../projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventEmitterModule.forRoot({ maxListeners: 10, ignoreErrors: false }),
    ListenerModule,
    RumsanUsersModule,
    PrismaModule,
    QueueModule.forRoot({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST'),
          port: +configService.get<number>('REDIS_PORT'),
          password: configService.get<string>('REDIS_PASSWORD'),
          // retryStrategy: (times) => {
          //   // reconnect after
          //   return Math.min(times * 50, 2000);
          // },
          // // might need to change on producttion
          // maxRetriesPerRequest: 1000,
        },
      }),
      inject: [ConfigService],
    }),
    // BullModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     redis: {
    //       host: configService.get<string>('REDIS_HOST'),
    //       port: +configService.get<number>('REDIS_PORT'),
    //       password: configService.get<string>('REDIS_PASSWORD'),
    //       retryStrategy: (times) => {
    //         // reconnect after
    //         return Math.min(times * 50, 2000);
    //       },
    //       // might need to change on producttion
    //       maxRetriesPerRequest: 1000,
    //     },
    //   }),
    //   inject: [ConfigService],
    // }),
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
