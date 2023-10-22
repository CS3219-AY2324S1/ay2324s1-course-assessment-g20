import { ChatMessage } from '@app/microservice/interfaces/chatbot';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ChatHistoryDocument = HydratedDocument<ChatHistory>;

@Schema()
export class ChatHistory {
  _id: string;

  @Prop({ required: true })
  sessionId: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  messages: ChatMessage[];
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
ChatHistorySchema.index({ sessionId: 1, userId: 1 }, { unique: true });
