import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import * as uuid from 'uuid';
import { DateTime } from 'luxon';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const begin = DateTime.now();
    const id = uuid
      .v1({
        msecs: Math.floor(begin.toMillis()),
      })
      .replaceAll('-', '');
    const request = context.switchToHttp().getRequest();

    request.headers['X-BetterSchuMan-ID'] = id;
    this.logger.log({
      id: id,
      time: begin.toMillis(),
      type: 'request',
      path: request.url,
    });

    const { statusCode } = context.switchToHttp().getResponse();

    return next.handle().pipe(
      tap((_) => {
        this.logger.log({
          id: id,
          time: DateTime.now().toMillis(),
          type: 'response',
          status: statusCode,
          path: request.url,
        });
      }),
    );
  }
}
