import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { QueueService } from '@rumsan/queue';
import { PROJECT_QUEUE } from '../constants';
import { EVENTS as APP_EVENTS } from '../constants/events';
import { CreateProjectDto } from '../projects/dto/create-project.dto';

@Injectable()
export class ListenerService {
  constructor(private readonly queueService: QueueService) {}

  @OnEvent(APP_EVENTS.PROJECT_CREATED)
  async onProjectCreated(data: CreateProjectDto) {
    // this._projectQueue.add(
    //   ADD_PROJECT,
    //   {
    //     ...createProjectDto,
    //   },
    //   {
    //     attempts: 3,
    //     removeOnComplete: true,
    //     backoff: {
    //       type: 'exponential',
    //       delay: 1000,
    //     },
    //   }
    // );
    const test = await this.queueService.sendMessage(PROJECT_QUEUE, data);
    console.log({
      'EVENTS.PROJECT_CREATED': test,
    });
    // this.queueService.sendMessage(APP_EVENTS.PROJECT_CREATED, data);
    // console.log('Project created!', data);
  }
}
