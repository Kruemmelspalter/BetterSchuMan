import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { checkAuth } from '../../schuman/checkAuth';
import { SendMessageDto } from './dto/send-message.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  create(
    @Body() createChatDto: CreateChatDto,
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    return this.chatService.create(
      createChatDto,
      files,
      checkAuth(req.headers['authorization']),
      requestId,
    );
  }

  @Post(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async sendMessage(
    @Param('id') threadId: string,
    @Body() sendMessageDto: SendMessageDto,
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    return await this.chatService.sendMessage(
      sendMessageDto.text,
      +threadId,
      files,
      checkAuth(req.headers['authorization']),
      requestId,
    );
  }

  @Get()
  findAll(@Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    const token = checkAuth(req.headers['authorization']);
    return this.chatService.findAll(token, requestId);
  }

  @Get('users')
  async findAllUsers(@Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    return await this.chatService.findAllUsers(
      checkAuth(req.headers['authorization']),
      requestId,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: Request) {
    const requestId = req.headers['X-BetterSchuMan-ID'];
    this.logger.log({ id: requestId });
    if (isNaN(parseInt(id))) throw new BadRequestException();
    return await this.chatService.findOne(
      +id,
      checkAuth(req.headers['authorization']),
      requestId,
    );
  }
}
