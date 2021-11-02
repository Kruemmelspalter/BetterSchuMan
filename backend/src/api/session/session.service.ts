import { HttpException, Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import * as superagent from 'superagent';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  async login(createSessionDto: CreateSessionDto): Promise<Session> {
    const res = await superagent
      .post('https://login.schulmanager-online.de/api/login')
      .ok((_) => true)
      .send({
        emailOrUsername: createSessionDto.username,
        password: createSessionDto.password,
      });

    if (!res) throw new HttpException('Bad Gateway', 502);
    if (res.statusCode != 200)
      switch (res.statusCode) {
        case 401:
          throw new HttpException('Unauthorized', 401);
        default:
          throw new HttpException('Error', res.statusCode);
      }

    return res.body['jwt'];
  }

  async getSessionInfo(session: Session) {
    const res = await superagent
      .post('https://login.schulmanager-online.de/api/login-status')
      .auth(session.jwt, { type: 'bearer' })
      .send();
    const data = res.body;

    if (!data['isAuthenticated']) {
      throw new HttpException('Unauthorized', 401);
    }
    if (res.statusCode != 200)
      switch (res.statusCode) {
        case 401:
          throw new HttpException('Unauthorized', 401);
        default:
          throw new HttpException('Error', res.statusCode);
      }
    return data['user'];
  }
}
