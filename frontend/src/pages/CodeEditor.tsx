import { useEffect, useState } from 'react';
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
import { bindYjsToMonacoEditor, tsCompile } from '../utils/editorUtils';
import { getSessionAndWsTicket } from '../api/collaborationServiceApi';
import { useThrowAsyncError } from '../hooks/useThrowAsyncError';
import TextContent from '../components/TextContent';
import { WebsocketProvider } from 'y-websocket';
import ChatbotPopup from '../components/Chatbot/ChatbotPopup';
import { Language } from '../@types/language';
import { getAllLanguages } from '../api/userApi';
import { formatLanguage } from '../utils/stringUtils';

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
  const { sessionId } = useParams<{ sessionId: string }>();
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);

  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [languages, setLanguages] = useState<string[]>([]);
  const [code, setCode] = useState('// some comment');
  const [codeEvalOutput, setCodeEvalOutput] = useState<ICodeEvalOutput>({
    error: '',
    logs: '',
    result: '',
  });

  /**
   * We are unable to use refs directly on '@monaco-editor/react' Editor component as it is not exposed.
   * However, we are able to access the instance via the onMount prop and call setEditor, in so doing,
   * trigger the binding of Yjs to the Editor instance.
   */
  const [editor, setEditor] = useState<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const [wsTicket, setWsTicket] = useState<string | null>(null);

  const throwAsyncError = useThrowAsyncError();

  // Fetch question information and get single-use websocket ticket to this session
  useEffect(() => {
    getAllLanguages()
      .then((resp) => {
        setLanguages(resp.data.map((language: Language) => language.name.toLowerCase()));
      })
      .catch(() => {
        throwAsyncError('Error getting supported languages');
      });

    if (sessionId) {
      getSessionAndWsTicket(sessionId)
        .then((resp) => {
          const { question, ticket } = resp.data;
          setQuestion(question);
          setWsTicket(ticket);
        })
        .catch(() => {
          throwAsyncError('Invalid session');
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize websocket connection to Yjs service
  useEffect(() => {
    let provider: WebsocketProvider | null = null;
    if (editor && wsTicket) {
      // Handles websocket disconnection when unauthorized (e.g. invalid ws ticket)
      provider = bindYjsToMonacoEditor(wsTicket, editor, throwAsyncError);
    }

    return () => {
      if (provider) {
        provider.disconnect();
      }
    };
  }, [editor, wsTicket, throwAsyncError]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setSelectedLanguage(event.target.value as string);
  };

  const handleCompile = () => {
    const codeEvaluator = new CodeEvaluator();

    const transpiledCode = selectedLanguage === 'typescript' ? tsCompile(code) : code;

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
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectedLanguage}
              onChange={handleLanguageChange}
              autoWidth
              label="Language"
            >
              {Object.values(languages).map((language) => {
                return (
                  <MenuItem key={language} value={language}>
                    {formatLanguage(language)}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <Editor
            height="40vh"
            width={'100%'}
            value={code}
            onChange={handleCodeChange}
            language={selectedLanguage}
            onMount={handleEditorDidMount}
          />
          <Button onClick={handleCompile} variant="contained" sx={{ textTransform: 'none' }}>
            Execute
          </Button>

          <OutputBlock label="Debug output" output={codeEvalOutput.logs} />
          <OutputBlock label="Your output" output={codeEvalOutput.result} />
          <OutputBlock label="Error" output={codeEvalOutput.error} />
        </Box>

        <ChatbotPopup sessionId={sessionId} language={selectedLanguage} userSolution={code} />
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

export default CodeEditor;
