import { Controller, Get, HttpException, Query, Req } from '@nestjs/common';
import { ScheduleService } from './schedule.service';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  getSchedule(@Query() query, @Req() req) {
    if (query['start'] === null || query['end'] === null)
      throw new HttpException('Bad Request', 400);
    const authString = req.headers['authorization'] as string;
    if (authString == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const tokenMatches = authString.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
    if (tokenMatches == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = tokenMatches[1];
    return this.scheduleService.getSchedule({
      jwt: token,
      start: query['start'],
      end: query['end'],
    });
  }
}
