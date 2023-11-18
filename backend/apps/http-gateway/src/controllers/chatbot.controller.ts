import {
  CHATBOT_SERVICE_NAME,
  ChatbotServiceClient,
} from '@app/microservice/interfaces/chatbot';
import { Service } from '@app/microservice/services';
import {
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('chatbot')
export class ChatbotController implements OnModuleInit {
  private chatbotService: ChatbotServiceClient;

  constructor(
    @Inject(Service.CHATBOT_SERVICE)
    private chatbotServiceClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.chatbotService =
      this.chatbotServiceClient.getService<ChatbotServiceClient>(
        CHATBOT_SERVICE_NAME,
      );
  }

  @Post('query/:sessionId')
  getSessionAndWsTicket(@Req() req, @Param('sessionId') sessionId) {
    const body = req.body;
    const { query, language, userSolution } = body;
    const userId = req.user.id;

    if (query !== null && language !== null) {
      return this.chatbotService.createChatQuery({
        sessionId,
        query,
        userId,
        language,
        userSolution,
      });
    }
  }

  @Get('history/:sessionId')
  getChatHistory(@Req() req, @Param('sessionId') sessionId) {
    const userId = req.user.id;

    if (sessionId !== null) {
      return this.chatbotService.getChatHistory({ sessionId, userId });
    }
  }
}
