import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './entities/session.entity';
import { request } from '../../schuman';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);
  async login(
    createSessionDto: CreateSessionDto,
    requestId: string | string[],
  ): Promise<Session> {
    this.logger.log({ id: requestId });
    const { body: res } = await request(
      'POST',
      '/login',
      {
        emailOrUsername: createSessionDto.username,
        password: createSessionDto.password,
      },
      undefined,
      requestId,
    );
    return res.jwt;
  }

  async getSessionInfo(session: Session, requestId: string | string[]) {
    this.logger.log({ id: requestId });
    const { body: res } = await request(
      'POST',
      '/login-status',
      {},
      session.jwt,
      requestId,
    );
    if (!res.isAuthenticated) throw new UnauthorizedException();
    return res.user;
  }
}
