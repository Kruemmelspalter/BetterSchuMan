import {
  Body,
  Controller,
  Get,
  HttpException,
  Logger,
  Post,
  Req,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  private readonly logger = new Logger(SessionController.name);

  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Req() req: Request,
  ) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    return await this.sessionService.login(createSessionDto, requestId);
  }

  @Get()
  async getSessionInfo(@Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });

    const authString = req.headers['authorization'] as string;
    if (authString == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const tokenMatches = authString.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
    if (tokenMatches == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = tokenMatches[1];

    return await this.sessionService.getSessionInfo({ jwt: token }, requestId);
  }
}
