import { useEffect, useRef, useState } from 'react';

import { SelectChangeEvent } from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import { IQuestion } from '../@types/question';
import { editor as MonacoEditor } from 'monaco-editor';
import {
  bindMessageHandlersToProvider,
  bindYjsToMonacoEditor,
  YjsWebsocketEvent,
  YjsWebsocketServerMessage,
} from '../utils/editorUtils';
import { getSession, getSessionTicket } from '../api/collaborationServiceApi';
import { useThrowAsyncError } from '../hooks/useThrowAsyncError';
import { WebsocketProvider } from 'y-websocket';
import { Language, PLACEHOLDER_LANGUAGE } from '../@types/language';
import { getAllLanguages } from '../api/userApi';
import { HttpStatusCode } from 'axios';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';

import EditorScreen from '../components/Editor/EditorScreen';

/**
 * This component abstracts the CodeEditor workspace page in a collaborative session.
 *
 * Outline of websocket connection logic:
 * - Using sessionId in the URL, query the backend (with JWT) to retrieve the question information and a single-use websocket ticket to this session
 * - Use the websocket ticket to initiate and authenticate a websocket connection to the collaboration service abstracting over Yjs
 *
 * Original code execution logic built with reference to online guide: https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/
 */
const CodeEditor = () => {
  // Session states
  const { sessionId } = useParams<{ sessionId: string }>();
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(PLACEHOLDER_LANGUAGE);

  // Editor states
  /**
   * We are unable to use refs directly on '@monaco-editor/react' Editor component as it is not exposed.
   * However, we are able to access the instance via the onMount prop and call setEditor, in so doing,
   * trigger the binding of Yjs to the Editor instance.
   */
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const provider = useRef<WebsocketProvider>();

  const throwAsyncError = useThrowAsyncError();

  // Fetch question information and editor languages
  useEffect(() => {
    getAllLanguages()
      .then((resp) => {
        setLanguages(resp.data);
      })
      .catch(() => {
        throwAsyncError('Error getting supported languages');
      });

    if (sessionId) {
      getSession(sessionId)
        .then((resp) => {
          const { question } = resp.data;
          setQuestion(question);
        })
        .catch((e: PeerprepBackendError) => {
          if (e.details.statusCode === HttpStatusCode.Forbidden) {
            return throwAsyncError('User does not belong in this session!');
          }
          return throwAsyncError('Invalid session!');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize websocket connection to Yjs service
  useEffect(() => {
    if (editor && sessionId) {
      getSessionTicket(sessionId)
        .then((resp) => {
          const { ticket } = resp.data;

          const { provider: yjsProvider, bindEditor } = bindYjsToMonacoEditor(
            ticket,
            editor,
            throwAsyncError,
          );
          bindMessageHandlersToProvider(yjsProvider, [
            onGetSessionLanguageWebsocketHandler(bindEditor),
          ]);

          provider.current = yjsProvider;
        })
        .catch(() => {
          throwAsyncError('Invalid session');
        });
    }

    return () => {
      if (provider.current) {
        provider.current.destroy();
      }
    };
  }, [editor, throwAsyncError]);

  const onGetSessionLanguageWebsocketHandler =
    (bindEditor: (languageId: number) => void) => (event: MessageEvent) => {
      try {
        const deserialized = JSON.parse(event.data);
        if (deserialized.event === YjsWebsocketServerMessage.CURRENT_LANGUAGE) {
          bindEditor(deserialized.language.id);
          setSelectedLanguage(deserialized.language);
        }
      } catch (e) {
        // No implementation: ignore
      }
    };

  const handleLanguageChange = async (event: SelectChangeEvent<number>) => {
    return provider.current?.ws?.send(
      JSON.stringify({
        event: YjsWebsocketEvent.LANGUAGE_CHANGE,
        data: event.target.value,
      }),
    );
  };

  const handleEditorDidMount = (editor: MonacoEditor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  if (!sessionId) {
    throw new Error('No session ID specified!');
  }

  return (
    <EditorScreen
      question={question}
      selectedLanguage={selectedLanguage}
      languages={languages}
      handleLanguageChange={handleLanguageChange}
      handleEditorDidMount={handleEditorDidMount}
      sessionId={sessionId}
    />
  );
};

export default CodeEditor;
