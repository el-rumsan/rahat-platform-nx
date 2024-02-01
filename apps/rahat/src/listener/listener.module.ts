import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AuthsModule } from '@rumsan/user';
import { QUEUE } from '../constants';
import { ListenerService } from './listener.service';

@Module({
  imports: [
    AuthsModule,
    BullModule.registerQueue({
      name: QUEUE.RAHAT,
    }),
    BullModule.registerQueue({
      name: QUEUE.DEBUG,
    }),
    BullModule.registerQueue({
      name: QUEUE.HOST,
    }),
  ],
  providers: [ListenerService],
})
export class ListenerModule {}
