import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { RouterModule } from '@nestjs/core';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    SessionModule,
    ScheduleModule,
    RouterModule.register([
      {
        path: 'api',
        module: SessionModule,
      },
      {
        path: 'api',
        module: ScheduleModule,
      },
    ]),
  ],
})
export class ApiModule {}
