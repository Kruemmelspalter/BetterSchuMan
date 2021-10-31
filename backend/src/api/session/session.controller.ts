import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Res() response: Response,
  ) {
    const data = await this.sessionService.login(createSessionDto);
    response
      .status(200)
      .header({ 'X-New-Bearer-Token': data['jwt'] })
      .send(data);
  }

  @Get()
  async getSessionInfo(@Req() req: Request, @Res() res: Response) {
    const authString = req.headers['authorization'] as string;
    if (authString == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const tokenMatches = authString.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
    if (tokenMatches == undefined) {
      throw new HttpException('Unauthorized', 401);
    }
    const token = tokenMatches[1];
    const data = await this.sessionService.getSessionInfo({ jwt: token });
    res.send(data);
  }
}
