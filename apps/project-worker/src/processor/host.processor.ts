import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { JOBS, QUEUE } from '../constants';

@Processor(QUEUE.HOST)
export class HostProcessor {
  private readonly logger = new Logger(HostProcessor.name);
  constructor() {}

  @Process(JOBS.OTP)
  async processOTP(job: Job<any>) {
    console.log('HOST:::OTP sent', job.data);
    // this.emailService.sendEmail(
    //   job.data.address,
    //   'OTP for login',
    //   'OTP for login',
    //   `<h1>OTP for login</h1><p>${job.data.otp}</p>`
    // );
  }
}
