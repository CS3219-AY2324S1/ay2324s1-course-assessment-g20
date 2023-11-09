import { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Grid, Typography } from '@mui/material';
import { CodeEvaluator } from '../utils/codeEvaluator';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useParams } from 'react-router-dom';
import { IQuestion } from '../@types/question';
import { ICodeEvalOutput } from '../@types/codeEditor';
import { editor as MonacoEditor } from 'monaco-editor';
import {
  bindMessageHandlersToProvider,
  bindYjsToMonacoEditor,
  tsCompile,
  YjsWebsocketEvent,
  YjsWebsocketServerMessage,
} from '../utils/editorUtils';
import { getSession, getSessionTicket } from '../api/collaborationServiceApi';
import { useThrowAsyncError } from '../hooks/useThrowAsyncError';
import TextContent from '../components/TextContent';
import { WebsocketProvider } from 'y-websocket';
import ChatbotPopup from '../components/Chatbot/ChatbotPopup';
import { Language } from '../@types/language';
import { getAllLanguages } from '../api/userApi';
import { formatLanguage } from '../utils/stringUtils';
import { HttpStatusCode } from 'axios';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';

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
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(placeholderLanguage);

  // Editor states
  /**
   * We are unable to use refs directly on '@monaco-editor/react' Editor component as it is not exposed.
   * However, we are able to access the instance via the onMount prop and call setEditor, in so doing,
   * trigger the binding of Yjs to the Editor instance.
   */
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState('');
  const [codeEvalOutput, setCodeEvalOutput] = useState<ICodeEvalOutput>(placeholderCodeEvalOutput);
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

  const handleCompile = () => {
    const codeEvaluator = new CodeEvaluator();

    const transpiledCode = selectedLanguage?.name === 'typescript' ? tsCompile(code) : code;

    codeEvaluator
      .evalAsync(transpiledCode)
      .then((output) => {
        setCodeEvalOutput(output);
      })
      .catch((output) => {
        setCodeEvalOutput(output);
      });
  };

  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor: MonacoEditor.IStandaloneCodeEditor) => {
    setEditor(editor);
  };

  if (!sessionId) {
    throw new Error('No session ID specified!');
  }

  return (
    <Grid container sx={{ p: 2 }}>
      <Grid item sm={6} xs={12}>
        <Typography variant="h4">{question?.title}</Typography>
        <Box sx={{ typography: 'body1', overflow: 'scroll' }} color="text.primary">
          <TextContent content={question?.description ?? ''} />
        </Box>
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 10 }}>
        <Box sx={{ position: { xs: 'static', sm: 'fixed' }, width: { xs: 'auto', sm: '55%' } }}>
          <FormControl sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Language</InputLabel>
            <Select
              disabled={selectedLanguage === placeholderLanguage}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectedLanguage === placeholderLanguage ? '' : selectedLanguage?.id}
              onChange={handleLanguageChange}
              autoWidth
              label="Language"
            >
              {Object.values(languages).map((language) => {
                return (
                  <MenuItem key={language.name} value={language.id}>
                    {formatLanguage(language.name!)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Editor
            height="40vh"
            width={'100%'}
            defaultValue={''}
            onChange={handleCodeChange}
            language={selectedLanguage?.name.toLowerCase()}
            onMount={handleEditorDidMount}
          />
          <Button onClick={handleCompile} variant="contained" sx={{ textTransform: 'none' }}>
            Execute
          </Button>

          <OutputBlock label="Debug output" output={codeEvalOutput.logs} />
          <OutputBlock label="Your output" output={codeEvalOutput.result} />
          <OutputBlock label="Error" output={codeEvalOutput.error} />
        </Box>

        <ChatbotPopup sessionId={sessionId} language={selectedLanguage.name} userSolution={code} />
      </Grid>
    </Grid>
  );
};

const OutputBlock = ({ label, output }: { label: string; output: string }) => {
  return output ? (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{label}</Typography>
      <Typography variant="body1">{output}</Typography>
    </Box>
  ) : (
    <></>
  );
};

const placeholderLanguage: Language = {
  id: 0,
  name: '',
};

const placeholderCodeEvalOutput = {
  error: '',
  logs: '',
  result: '',
};

export default CodeEditor;
