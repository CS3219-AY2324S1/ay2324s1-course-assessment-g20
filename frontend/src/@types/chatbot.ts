export interface IChatbotMessage {
  role: string;
  content: string;
}

export interface IChatbotMessageHistory {
  messages: IChatbotMessage[];
}
