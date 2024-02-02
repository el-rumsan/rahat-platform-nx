import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AuthsService, EVENTS } from '@rumsan/user';
import { Queue } from 'bull';
import { JOBS, QUEUE } from '../constants';
import { EVENTS as APP_EVENTS } from '../constants/events';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
@Injectable()
export class ListenerService {
  private otp: string;
  constructor(
    private authService: AuthsService,
    @InjectQueue(QUEUE.RAHAT) private readonly queue: Queue,
    @InjectQueue(QUEUE.DEBUG) private readonly debug: Queue,
    @InjectQueue(QUEUE.HOST) private readonly _hostQueue: Queue
  ) {}

  @OnEvent(EVENTS.OTP_CREATED)
  async sendOTPEmail(data: any) {
    console.log('OTP: ' + data.otp);
    this.otp = data.otp;
    await this.queue.add(JOBS.EMAIL, { test: 'test' });
    await this._hostQueue.add(JOBS.OTP, { otp: data.otp });
  }

  //TODO PLEASE REMOVE THIS
  @OnEvent(EVENTS.CHALLENGE_CREATED)
  async TEMP_createJwt(data: any) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const auth = await this.authService.loginByOtp(
      {
        challenge: data.challenge.challenge,
        service: 'EMAIL',
        otp: this.otp,
      },
      {
        ip: '::1',
        userAgent: 'na',
      }
    );
    await this.debug.add(JOBS.OTP, {
      otp: this.otp,
      access_token: auth.accessToken,
    });
    console.log(auth);
  }

  @OnEvent(APP_EVENTS.PROJECT_CREATED)
  async onProjectCreated(data: CreateProjectDto) {
    this._hostQueue.add(JOBS.PROJECT_CREATE, data, {
      attempts: 3,
      removeOnComplete: true,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
    });
    // const test = await this.queueService.sendMessage(PROJECT_QUEUE, data);
    // console.log({
    //   'EVENTS.PROJECT_CREATED': test,
    // });
  }
}
