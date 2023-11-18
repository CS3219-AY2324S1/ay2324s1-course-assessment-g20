import { getMatchingTicket } from '../api/matchingApi';
import { backendServicesPaths, BACKEND_WEBSOCKET_HOST } from './constants';

export async function getMatchingWebSocket() {
  const ticketId = await (await getMatchingTicket()).data.id;

  return new WebSocket(
    `${BACKEND_WEBSOCKET_HOST}${backendServicesPaths.matching.root}?ticket=${ticketId}`,
  );
}

export function sendWsMessage<T>(ws: WebSocket, data: T, event: string) {
  ws.send(
    JSON.stringify({
      event: event,
      data: data,
    }),
  );
}
