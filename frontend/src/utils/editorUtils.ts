import * as ts from 'typescript';
import { editor as MonacoEditor } from 'monaco-editor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { BACKEND_WEBSOCKET_HOST, COLLAB_ROOM_NAME } from './constants';
import { MonacoBinding } from 'y-monaco';

// This function transpiles TypeScript to JavaScript, allowing users to write TypeScript in the code editor
export function tsCompile(source: string): string {
  const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
  return ts.transpileModule(source, options).outputText;
}

export const bindYjsToMonacoEditor = (
  wsTicket: string,
  editor: MonacoEditor.IStandaloneCodeEditor,
) => {
  const ydocument = new Y.Doc();
  const provider = new WebsocketProvider(BACKEND_WEBSOCKET_HOST, COLLAB_ROOM_NAME, ydocument, {
    params: {
      ticket: wsTicket,
    },
  });
  const type = ydocument.getText('monaco');
  const model = editor?.getModel();
  if (model) {
    new MonacoBinding(type, model, new Set([editor]), provider.awareness);
  }
};
