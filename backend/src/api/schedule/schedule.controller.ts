import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Request } from 'express';

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
    const authString = req.headers['authorization'] as string;
    if (authString == undefined) {
      throw new UnauthorizedException();
    }
    const tokenMatches = authString.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
    if (tokenMatches == undefined) {
      throw new UnauthorizedException();
    }
    const token = tokenMatches[1];
    return this.scheduleService.getSchedule(
      {
        jwt: token,
        start: query['start'],
        end: query['end'],
      },
      requestId,
    );
  }
}
