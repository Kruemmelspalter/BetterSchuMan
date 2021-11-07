import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  Req,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Request } from 'express';
import { checkAuth } from '../../schuman/checkAuth';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  private readonly logger = new Logger(ScheduleController.name);

  @Get()
  getSchedule(@Query() query, @Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    if (query['start'] === null || query['end'] === null) {
      throw new BadRequestException();
    }
    const token = checkAuth(req.headers['authorization'] as string);

    return this.scheduleService.getSchedule(
      {
        jwt: token,
        start: query['start'],
        end: query['end'],
      },
      requestId,
    );
  }

  @Get('/hours')
  getHours(@Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
  }
}
