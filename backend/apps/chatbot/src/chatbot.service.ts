import {
  ChatbotRequest,
  ChatMessage,
  ChatMessagesResponse,
} from '@app/microservice/interfaces/chatbot';
import {
  QuestionServiceClient,
  QUESTION_SERVICE_NAME,
} from '@app/microservice/interfaces/question';
import { Service } from '@app/microservice/services';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatHistory } from './schemas/chatHistory.schema';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config';
import {
  CollaborationServiceClient,
  COLLABORATION_SERVICE_NAME,
} from '@app/microservice/interfaces/collaboration';
import { ChatCompletion } from 'openai/resources';
import { PEERPREP_EXCEPTION_TYPES } from '@app/types/exceptions';
import { PeerprepException } from '@app/utils';

@Injectable()
export class ChatbotService {
  private static greetingMessage: ChatMessage = {
    role: 'assistant',
    content: `Hello! I am an AI powered chatbot that can help you with your coding questions. You can ask me to:
1. Explain the solution provided by your fellow collaboratee, or
2. Provide hints for solving the question, or even
3. Come up with a solution for you`,
  };

  private questionService: QuestionServiceClient;
  private collaborationService: CollaborationServiceClient;
  private openai: OpenAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(ChatHistory.name) private chatHistoryModel: Model<ChatHistory>,
    @Inject(Service.COLLABORATION_SERVICE)
    private readonly collaborationServiceClient: ClientGrpc,
    @Inject(Service.QUESTION_SERVICE)
    private readonly questionServiceClient: ClientGrpc,
  ) {
    this.openai = new OpenAI(configService.get('openAiConfig'));
  }

  onModuleInit() {
    this.questionService =
      this.questionServiceClient.getService<QuestionServiceClient>(
        QUESTION_SERVICE_NAME,
      );
    this.collaborationService =
      this.collaborationServiceClient.getService<CollaborationServiceClient>(
        COLLABORATION_SERVICE_NAME,
      );
  }

  async createQuery(request: ChatbotRequest): Promise<ChatHistory> {
    const { sessionId, userId, query, language, userSolution } = request;
    const questionId = await (
      await firstValueFrom(
        this.collaborationService.getQuestionIdFromSessionId({ id: sessionId }),
      )
    ).questionId;
    const chatHistory = await this.getChatHistory(sessionId, userId);

    let filteredChatHistory: ChatHistory;

    if (chatHistory == null || chatHistory.messages.length == 0) {
      const question = await firstValueFrom(
        this.questionService.getQuestionWithId({ id: questionId }),
      );

      filteredChatHistory = await this.getChatbotReplyForNewSession(
        query,
        userSolution,
        question.description,
        language,
        sessionId,
        userId,
      );
    } else {
      filteredChatHistory = await this.getChatbotReplyForCurrentSession(
        query,
        userSolution,
        chatHistory,
        language,
      );
    }

    return this.filterChatHistory(filteredChatHistory);
  }

  async getChatbotReplyForCurrentSession(
    query: string,
    userSolution: string,
    chatHistory: ChatHistory,
    language: string,
  ): Promise<ChatHistory> {
    const messages = chatHistory.messages;

    // Prompt to update the context of the chatbot
    const languageAndUserSolutionContext: ChatMessage =
      this.generateUserLanguageAndSolutionContext(language, userSolution);

    const userQuery = { role: 'user', content: query };
    messages.push(languageAndUserSolutionContext, userQuery);

    const openaiResponse = await this.getOpenAIResponse(messages);

    return this.pushMessagesToChatHistory(
      chatHistory.sessionId,
      chatHistory.userId,
      [languageAndUserSolutionContext, userQuery, openaiResponse],
    );
  }

  async getChatbotReplyForNewSession(
    query: string,
    userSolution: string,
    description: string,
    language: string,
    sessionId: string,
    userId: string,
  ): Promise<ChatHistory> {
    // Prompt to give context to gpt for our application and what we want to do
    const applicationContext: ChatMessage =
      this.generateApplicationContext(description);
    const languageAndUserSolutionContext: ChatMessage =
      this.generateUserLanguageAndSolutionContext(language, userSolution);
    const messages = [
      applicationContext,
      languageAndUserSolutionContext,
      ChatbotService.greetingMessage,
      { role: 'user', content: query },
    ];

    const openaiResponse = await this.getOpenAIResponse(messages);

    messages.push(openaiResponse);
    return this.addNewChatHistory(sessionId, userId, messages);
  }

  async getChatHistoryForFrontend(
    sessionId: string,
    userId: string,
  ): Promise<ChatMessagesResponse> {
    const chatHistory = await this.getChatHistory(sessionId, userId);
    if (chatHistory === null) {
      return { messages: [ChatbotService.greetingMessage] };
    }

    chatHistory.messages = this.filterChatHistory(chatHistory).messages;
    return { messages: chatHistory.messages };
  }

  // In-place filter that removes all system messages meant for setting up context for gpt3
  private filterChatHistory(chatHistory: ChatHistory): ChatHistory {
    chatHistory.messages = chatHistory.messages.filter(
      (message) => message.role !== 'system',
    );
    return chatHistory;
  }

  private getChatHistory(
    sessionId: string,
    userId: string,
  ): Promise<ChatHistory> {
    return this.chatHistoryModel.findOne({ sessionId, userId }).exec();
  }

  private pushMessagesToChatHistory(
    sessionId: string,
    userId: string,
    messages: ChatMessage[],
  ): Promise<ChatHistory> {
    return this.chatHistoryModel
      .findOneAndUpdate(
        { sessionId, userId },
        { $push: { messages: { $each: messages } } },
        { new: true },
      )
      .exec();
  }

  private addNewChatHistory(
    sessionId: string,
    userId: string,
    messages: ChatMessage[],
  ): Promise<ChatHistory> {
    return this.chatHistoryModel
      .findOneAndUpdate(
        { sessionId, userId },
        { $set: { messages } },
        { upsert: true, new: true },
      )
      .exec();
  }

  private async getOpenAIResponse(
    messages: ChatMessage[],
  ): Promise<ChatMessage> {
    let response: ChatCompletion;

    try {
      response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo-16k',
        messages:
          messages as OpenAI.Chat.Completions.ChatCompletionMessageParam[],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
    } catch (e) {
      throw new PeerprepException(
        'The chatbot service is currently unavailable.',
        PEERPREP_EXCEPTION_TYPES.SERVICE_UNAVAILABLE,
      );
    }

    return response.choices[0].message;
  }

  private generateUserLanguageAndSolutionContext(
    language: string,
    userSolution: string,
  ): ChatMessage {
    return {
      role: 'system',
      content: `Solution Language: \n"""\n${language}\n"""\n Users' solution: \n"""\n${userSolution}\n"""\n`,
    };
  }

  private generateApplicationContext(questionDescription: string): ChatMessage {
    return {
      role: 'system',
      content: `You are a chatbot for a code collaboration environment called PeerPrep, meant to help users prepare for code interviews by doing coding questions.  Users partner with each other to solve questions, so they may need help trying to understand each other's code and working to arrive at the correct solution. When answering, always refer to the Users' solution as "your" solution or "your partner's" solution \n\n\nThe problem statement:\n"""\n${questionDescription}\n"""\nWhen users ask to explain the provided solution: \n\n1. Firstly, try to determine if the user's solution is correct or wrong and inform the user on his correctness.\n\n2. If the provided solution is wrong. Tell the user straight away. Then explain why the provided solution is wrong. And provide some hints to why it may be wrong.\n\n2a. If the provided solution is completely wrong, work out your own solution and explain its logic clearly, without missing steps.\n\n2b:  Provide the solution code in the given language.\n\n3. If it is correct, explain to the user what the code is trying to do in each step and how it arrives at the correct solution\n\nWhen users ask for a solution: \n\nStep 1: Work out your own solution and explain its logic clearly, without missing steps.\n\nStep 2: Provide the solution code in the given language.`,
    };
  }
}
