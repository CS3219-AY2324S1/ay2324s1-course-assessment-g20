import { Controller } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import {
  ChatbotRequest,
  ChatbotServiceController,
  ChatbotServiceControllerMethods,
  ChatHistoryRequest,
  ChatMessagesResponse,
} from '@app/microservice/interfaces/chatbot';

@Controller()
@ChatbotServiceControllerMethods()
export class ChatbotController implements ChatbotServiceController {
  constructor(private readonly chatbotService: ChatbotService) {}

  async createChatQuery(
    request: ChatbotRequest,
  ): Promise<ChatMessagesResponse> {
    const { messages } = await this.chatbotService.createQuery(request);
    return { messages };
  }

  async getChatHistory(
    request: ChatHistoryRequest,
  ): Promise<ChatMessagesResponse> {
    return this.chatbotService.getChatHistoryForFrontend(
      request.sessionId,
      request.userId,
    );
  }
}
