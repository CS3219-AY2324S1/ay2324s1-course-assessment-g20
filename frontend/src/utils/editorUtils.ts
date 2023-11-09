import * as ts from 'typescript';
import { editor as MonacoEditor } from 'monaco-editor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { BACKEND_WEBSOCKET_HOST } from './constants';
import { MonacoBinding } from 'y-monaco';

// This function transpiles TypeScript to JavaScript, allowing users to write TypeScript in the code editor
export function tsCompile(source: string): string {
  const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
  return ts.transpileModule(source, options).outputText;
}

export const bindYjsToMonacoEditor = (
  wsTicket: string,
  editor: MonacoEditor.IStandaloneCodeEditor,
  onError?: (error: Error | string) => void,
) => {
  let binding: MonacoBinding | null = null;

  const ydocument = new Y.Doc();
  const provider = authenticatedYjsWebsocketProvider(wsTicket, ydocument, onError);

  const bindEditor = (languageId: number) => {
    if (binding) {
      // To reuse existing editor, destroy previous collaborative editting handlers
      binding.destroy();
    }

    const model = editor.getModel();
    const ytext = ydocument.getText(languageId.toString());

    if (model) {
      binding = new MonacoBinding(ytext, model, new Set([editor]), provider.awareness);
    }
  };

  return { provider, bindEditor };
};

const ROOM_NAME = 'yjs';
export enum YjsWebsocketServerMessage {
  SESSION_INITIALIZED = 'session_initialized',
  WS_UNAUTHORIZED = 'unauthorized',
  LANGUAGE_CHANGE = 'language-change',
  CURRENT_LANGUAGE = 'current_language',
  SESSION_CLOSED = 'session_closed',
}
const authenticatedYjsWebsocketProvider = (
  wsTicket: string,
  ydoc: Y.Doc,
  onError?: (error: Error | string) => void,
) => {
  const provider = new WebsocketProvider(BACKEND_WEBSOCKET_HOST, ROOM_NAME, ydoc, {
    params: {
      ticket: wsTicket,
    },
    disableBc: true,
  });

  const ws = provider.ws!;
  const yjsDefaultOnOpen = ws.onopen;
  const yjsDefaultOnMessage = ws.onmessage;

  const dummyOnOpen = () => {};
  const customOnMessage = (event: MessageEvent) => {
    // Waits for connection to be authenticated and Yjs session to be initialized before starting client Yjs sync
    const { data } = event;

    if (data === YjsWebsocketServerMessage.SESSION_INITIALIZED) {
      // @ts-expect-error: Yjs provider onOpen does not expect the event to be passed in
      yjsDefaultOnOpen();
      ws.onmessage = yjsDefaultOnMessage;
    } else if (data === YjsWebsocketServerMessage.WS_UNAUTHORIZED) {
      provider.disconnect();
      onError && onError('Websocket authentication failed!');
    } else if (data === YjsWebsocketServerMessage.SESSION_CLOSED) {
      provider.disconnect();
      onError && onError('Session has been closed!');
    }
  };

  ws.onopen = dummyOnOpen;
  ws.onmessage = customOnMessage;

  return provider;
};

export const bindMessageHandlersToProvider = (
  provider: WebsocketProvider,
  handlers: ((this: WebSocket, ev: MessageEvent) => any)[],
) => {
  handlers.forEach((handler) => {
    provider.ws?.addEventListener('message', handler);
  });
};

export enum YjsWebsocketEvent {
  LANGUAGE_CHANGE = 'language_change',
}
