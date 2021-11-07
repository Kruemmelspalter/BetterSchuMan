import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as uuid from 'uuid';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const begin = new Date();
    const id = uuid
      .v1({
        msecs: Math.floor(begin.getTime() / 1000),
        nsecs: begin.getTime() % 1000,
      })
      .replaceAll('-', '');
    const request = context.switchToHttp().getRequest() as Request;

    request.headers['X-BetterSchuMan-ID'] = id;
    this.logger.log({
      id: id,
      time: begin.getTime(),
      type: 'request',
    });
    return next.handle().pipe(
      tap((_) => {
        const end = new Date();
        this.logger.log({ id: id, time: end.getTime(), type: 'response' });
      }),
    );
  }
}
