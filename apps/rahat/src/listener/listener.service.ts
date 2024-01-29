import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS as APP_EVENTS } from '../constants/events';
import { CreateProjectDto } from '../projects/dto/create-project.dto';

@Injectable()
export class ListenerService {
  constructor() {}
  // @OnEvent(EVENTS.OTP_CREATED)
  // sendOTPEmail(data: any) {
  //   console.log('Use your messenger service!', data);
  // }

  @OnEvent(APP_EVENTS.PROJECT_CREATED)
  onProjectCreated(data: CreateProjectDto) {
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
    console.log('Project created!', data);
  }
}
