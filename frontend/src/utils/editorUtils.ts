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
  const bindEditorOnAuthenticate = (ydoc: Y.Doc, provider: WebsocketProvider) => {
    const type = ydoc.getText('monaco');
    const model = editor?.getModel();
    if (model) {
      new MonacoBinding(type, model, new Set([editor]), provider.awareness);
    }
  };

  authenticatedYjsWebsocketProvider(wsTicket, bindEditorOnAuthenticate, onError);
};

const ROOM_NAME = 'yjs';
enum YjsWebsocketServerMessage {
  SESSION_INITIALIZED = 'session_initialized',
  WS_UNAUTHORIZED = 'unauthorized',
}
const authenticatedYjsWebsocketProvider = (
  wsTicket: string,
  onAuthenticateCallback: (ydoc: Y.Doc, provider: WebsocketProvider) => void,
  onError?: (error: Error | string) => void,
) => {
  const ydocument = new Y.Doc();
  const provider = new WebsocketProvider(BACKEND_WEBSOCKET_HOST, ROOM_NAME, ydocument, {
    params: {
      ticket: wsTicket,
    },
  });

  const ws = provider.ws!;
  const yjsDefaultOnOpen = ws.onopen;
  const yjsDefaultOnMessage = ws.onmessage;

  const dummyOnOpen = () => {};
  const customOnMessage = (event: MessageEvent) => {
    // Waits for connection to be authenticated and Yjs session to be initialized before starting client Yjs sync
    const { data } = event;
    if (data === YjsWebsocketServerMessage.SESSION_INITIALIZED) {
      // @ts-expect-error
      yjsDefaultOnOpen();
      ws.onmessage = yjsDefaultOnMessage;
      onAuthenticateCallback(ydocument, provider);
    } else if (data === YjsWebsocketServerMessage.WS_UNAUTHORIZED) {
      provider.disconnect();
      onError && onError('Websocket authentication failed!');
    }
  };

  ws.onopen = dummyOnOpen;
  ws.onmessage = customOnMessage;
};
