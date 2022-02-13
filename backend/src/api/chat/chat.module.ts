import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [ChatController],
  providers: [ChatService],
  imports: [MulterModule],
})
export class ChatModule {}
