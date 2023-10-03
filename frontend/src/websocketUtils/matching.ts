import { backendServicesPaths, BACKEND_WEBSOCKET_HOST } from '../utils/constants';

export function getMatchingWebSocket(ticket: string) {
  return new WebSocket(
    `${BACKEND_WEBSOCKET_HOST}${backendServicesPaths.matching.root}?ticket=${ticket}`,
  );
}
