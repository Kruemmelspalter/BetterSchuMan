import {
  BadGatewayException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { calls } from '../../schuman';
import { uploadFile } from '../../schuman/request';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  async create(
    createChatDto: CreateChatDto,
    files: Array<Express.Multer.File>,
    token: string,
    requestId: string | string[],
  ) {
    this.logger.log({ id: requestId });
    const attach_strs = await Promise.all(
      files.map((x) => {
        return uploadFile(x, token);
      }),
    );
    const allUsers = await this.findAllUsers(token, requestId);
    const possibleUsers = allUsers.filter(
      (x) => x.id === +createChatDto.recipientId,
    );
    if (possibleUsers.length !== 1) throw new InternalServerErrorException();
    const user = possibleUsers[0];
    const { body: body } = await calls(
      'messenger',
      'create-thread',
      {
        subject: createChatDto.threadName,
        users: [{ id: +createChatDto.recipientId }],
        allowAnswers: true,
        recipientOptions: [
          {
            name: user.name,
            subtext: user.subtext,
            type: 'user',
            user: user,
          },
        ],
        firstMessage: { text: createChatDto.text, attachments: attach_strs },
      },
      token,
      requestId,
    );
    return +body.thread.id;
  }

  async findAll(token: string, requestId: string | string[]) {
    this.logger.log({ id: requestId });
    const { body: threads } = await calls(
      'messenger',
      'get-subscriptions',
      {},
      token,
      requestId,
    );
    return threads.map((x) => {
      const thread = x.thread;
      return {
        id: +x.id,
        threadId: +x.thread.id,
        subject: thread.subject,
        sender: thread.senderString,
        recipients: thread.recipientString,
        privateChat: thread.isPrivateChat,
        allowsAnswers: thread.allowAnswers,
        unread: x.unreadCount,
        lastMessage: thread.lastMessageTimestamp,
      };
    });
  }

  async findOne(id: number, token: string, requestId: string | string[]) {
    this.logger.log({ id: requestId });
    const { body: messages } = await calls(
      'messenger',
      'get-messages-by-subscription',
      { subscriptionId: id },
      token,
      requestId,
    );
    if (!messages.messages) {
      throw new BadGatewayException();
    }
    return messages.messages.map((x) => {
      return {
        id: +x.id,
        text: x.text,
        sentTimestamp: x.createdAt,
        sender: {
          firstname: x.sender.firstname,
          lastname: x.sender.lastname,
        },
        attachments: x.attachments.map((x) => {
          const data = JSON.parse(x.file);
          return {
            url: `https://login.schulmanager-online.de/download-file/${Buffer.from(
              x.file,
            ).toString('base64')}`,
            mime: data[4],
            filename: data[6],
          };
        }),
      };
    });
  }

  async sendMessage(
    text: string,
    subscriptionId: number,
    attachments: Array<Express.Multer.File>,
    token: string,
    requestId: string | string[],
  ) {
    this.logger.log({ id: requestId });

    const allSubscriptions = await this.findAll(token, requestId);
    const possibleSubscriptions = allSubscriptions.filter(
      (x) => x.id === subscriptionId,
    );
    if (possibleSubscriptions.length === 0) throw new NotFoundException();
    const subscription = possibleSubscriptions[0];
    const threadId = subscription.threadId;

    const attach_strs = await Promise.all(
      attachments.map((x) => {
        return uploadFile(x, token);
      }),
    );
    await calls(
      'messenger',
      'send-message',
      {
        thread: { id: threadId },
        text: text,
        attachments: attach_strs,
      },
      token,
      requestId,
    );
    return;
  }
  async findAllUsers(token: string, requestId: string | string[]) {
    const { body } = await calls(
      'messenger',
      'get-chat-users',
      {},
      token,
      requestId,
    );
    return body;
  }
}
