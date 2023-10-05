export enum CollaborationServiceApi {
  CREATE_COLLAB_SESSION = 'create_collab_session',
  GET_SESSION_AND_WS_TICKET = 'get_session_and_ws_ticket',
  GET_SESSION_ID_FROM_TICKET = 'get_session_id_from_ticket',
}

export type CreateSessionInfo = {
  userIds: string[];
  questionId: string;
};

export type GetSessionAndTicketInfo = {
  sessionId: string;
  userId: string;
};

export const COLLABORATION_SERVICE = 'COLLABORATION_SERVICE';
