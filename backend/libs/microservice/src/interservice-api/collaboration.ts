export type CreateSessionInfo = {
  userIds: string[];
  questionId: string;
};

export type GetSessionAndTicketInfo = {
  sessionId: string;
  userId: string;
};
