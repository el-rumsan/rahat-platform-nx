import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '@rumsan/prisma';
import { EVENTS } from '../constants/events';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    // const project = await  this.prisma.project.create({
    //   data: {
    //   },
    // });

    this.eventEmitter.emit(EVENTS.PROJECT_CREATED, createProjectDto);
  }
}
