import { InjectQueue } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from '@rumsan/user';
import { Queue } from 'bull';
import { JOBS } from '../constants';
import { EVENTS as APP_EVENTS } from '../constants/events';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { DevService } from '../utils/develop.service';
import { Project } from '@prisma/client';
import { ClientProxy } from '@nestjs/microservices';
import { BQUEUE } from '@rahat/sdk';
@Injectable()
export class ListenersService {
  private otp: string;
  private dev: DevService;
  constructor(
    @InjectQueue(BQUEUE.RAHAT) private readonly rahatQueue: Queue,
    @InjectQueue(BQUEUE.HOST) private readonly hostQueue: Queue,
    @InjectQueue(BQUEUE.RAHAT_PROJECT) private readonly projectQueue: Queue,
    private readonly devService: DevService
  ) {}

  @OnEvent(EVENTS.OTP_CREATED)
  async sendOTPEmail(data: any) {
    this.otp = data.otp;
    this.projectQueue.add('beneficiary.sync', { otp: data.otp });
    await this.rahatQueue.add(JOBS.EMAIL, { test: 'test' });
  }

  @OnEvent(EVENTS.CHALLENGE_CREATED)
  async sendChallengeToDev(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    this.devService.otp({
      otp: this.otp,
      challenge: data.challenge.challenge,
    });
  }

  @OnEvent(APP_EVENTS.PROJECT_CREATED)
  async onProjectCreated(data: Project) {
    this.hostQueue.add(JOBS.PROJECT_CREATE, data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
  }
}
