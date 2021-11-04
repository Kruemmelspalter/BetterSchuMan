import { LoggerService } from '@nestjs/common';

export class SchuManLogger implements LoggerService {
  log(message: any, context: string): any {
    this.writeLogMessage('log', context, message);
  }

  writeLogMessage(level: string, context: string, message: any) {
    const data = {
      level,
      context,
      ...(typeof message === 'string' || message instanceof String
        ? { message: message }
        : message),
    };
    process.stdout.write(JSON.stringify(data) + '\n');
  }

  error(message: string, context: string): any {
    this.writeLogMessage('error', context, message);
  }

  warn(message: string, context: string): any {
    this.writeLogMessage('warn', context, message);
  }
}
