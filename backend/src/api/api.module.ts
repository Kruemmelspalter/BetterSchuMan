import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    SessionModule,
    RouterModule.register([
      {
        path: 'api',
        module: SessionModule,
      },
    ]),
  ],
})
export class ApiModule {}
