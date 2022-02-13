import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from './schedule/schedule.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    SessionModule,
    ScheduleModule,
    ChatModule,
    RouterModule.register([
      {
        path: 'api',
        module: SessionModule,
      },
      {
        path: 'api',
        module: ScheduleModule,
      },
      {
        path: 'api',
        module: ChatModule,
      },
    ]),
  ],
})
export class ApiModule {}
