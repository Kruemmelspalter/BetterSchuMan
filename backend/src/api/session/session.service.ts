import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import * as superagent from 'superagent';
import { Session } from './entities/session.entity';

@Injectable()
export class SessionService {
  async login(createSessionDto: CreateSessionDto) {
    const res = await superagent
      .post('https://login.schulmanager-online.de/api/login')
      .ok((_) => true)
      .send({
        emailOrUsername: createSessionDto.username,
        password: createSessionDto.password,
      });

    if (!res) return 500;
    if (res.statusCode != 200) return res.statusCode;

    const data = res.body;
    return data['jwt'];
  }

  async getSessionInfo(session: Session) {
    const res = await superagent
      .post('https://login.schulmanager-online.de/api/login-status')
      .auth(session.jwt, { type: 'bearer' })
      .send();
    const data = res.body;

    if (!data['isAuthenticated']) {
      return 401;
    }
    if (res.statusCode != 200) return res.statusCode;
    return data['user'];
  }
}
