// import { MailerService } from '@nestjs-modules/mailer';
import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Processor,
} from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import { PROJECT_QUEUE } from '../../constants';

/**
 * TODO:
 * first we need to create a docker image
 * then we need to create a container from that image
 * get env template from github, and replace the env variables based on the project type run the specific compose, and create the container
 */

@Injectable()
@Processor(PROJECT_QUEUE)
export class ProjectProcessor {
  private readonly _logger = new Logger(ProjectProcessor.name);

  constructor() {} // private readonly _configService: ConfigService, // private readonly _mailerService: MailerService,

  @OnQueueActive()
  public onActive(job: Job) {
    this._logger.debug(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueCompleted()
  public onComplete(job: Job) {
    this._logger.debug(`Completed job ${job.id} of type ${job.name}`);
  }

  @OnQueueFailed()
  public onError(job: Job<any>, error: any) {
    this._logger.error(
      `Failed job ${job.id} of type ${job.name}: ${error.message}`,
      error.stack
    );
  }

  // @Process(ADD_PROJECT)
  // public async addProject(job: Job<any>) {
  //   this._logger.log(`Add Project '${job.data}'`);

  //   const envConfig = {
  //     IMAGE_NAME: job.data.projectType,
  //     ...job.data,
  //   };

  //   console.log('ADD_PROJECT', envConfig);

  //   const createdContainer = await createContainer(envConfig);
  //   console.log(createdContainer);
  //   return createdContainer;
  // }
}
