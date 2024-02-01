import { Module } from '@nestjs/common';
import { QueueModule, QueueService } from '@rumsan/queue';
import { PROJECT_QUEUE } from '../constants';
import { ListenerService } from './listener.service';

@Module({
  imports: [
    QueueModule.registerQueue({
      name: PROJECT_QUEUE,
    }),
  ],
  providers: [ListenerService, QueueService],
})
export class ListenerModule {}
