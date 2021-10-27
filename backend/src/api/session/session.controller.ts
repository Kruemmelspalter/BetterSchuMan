import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { Request, Response } from 'express';
import { Session } from './entities/session.entity';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Res() response: Response,
  ): Promise<Session> {
    const data = await this.sessionService.login(createSessionDto);
    if (!isNaN(data)) {
      response.status(data).send();
      return;
    }
    response
      .status(200)
      .header({ 'X-New-Bearer-Token': data })
      .send({ jwt: data });
  }

  @Get()
  async getSessionInfo(@Req() req: Request, @Res() res: Response) {
    const authString = req.headers['authorization'] as string;
    if (authString == undefined) {
      res.status(401).send();
      return;
    }
    const tokenMatches = authString.match(/Bearer ([a-zA-Z0-9.\-_]+)/);
    if (tokenMatches == undefined) {
      res.status(401).send();
      return;
    }
    const token = tokenMatches[1];
    const data = await this.sessionService.getSessionInfo({ jwt: token });
    if (!isNaN(data)) {
      res.status(data).send();
      return;
    }

    res.send(data);
  }
}
