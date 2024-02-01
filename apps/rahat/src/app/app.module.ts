import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from '@rumsan/prisma';
import { SettingsModule } from '@rumsan/settings';
import { RumsanUsersModule } from '@rumsan/user';
import { ListenerModule } from '../listener/listener.module';
import { DebugProcessor, RahatProcessor } from '../processors';
import { ProjectModule } from '../projects/projects.module';
import { EmailService } from '../utils/email.service';
import { SlackService } from '../utils/slack.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ConfigModule.forRoot({ isGlobal: true }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({ maxListeners: 10, ignoreErrors: false }),
    ListenerModule,
    RumsanUsersModule,
    SettingsModule,
    PrismaModule,
    ProjectModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DebugProcessor,
    RahatProcessor,
    EmailService,
    SlackService,
  ],
})
export class AppModule {}
