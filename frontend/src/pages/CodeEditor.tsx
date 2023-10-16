import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Grid } from '@mui/material';
import { CodeEvaluator } from '../utils/codeEvaluator';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { languages } from '../utils/constants';
import { useParams } from 'react-router-dom';
import { IQuestion } from '../@types/question';
import { ICodeEvalOutput } from '../@types/codeEditor';
import { editor as MonacoEditor } from 'monaco-editor';
import { bindYjsToMonacoEditor, tsCompile } from '../utils/editorUtils';
import { getSessionAndWsTicket } from '../api/collaborationServiceApi';
import { useThrowAsyncError } from '../utils/hooks';
import TextContent from '../components/TextContent';

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
  const [language, setLanguage] = useState('javascript');
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
    if (editor && wsTicket) {
      // Handles websocket disconnection when unauthorized (e.g. invalid ws ticket)
      bindYjsToMonacoEditor(wsTicket, editor, throwAsyncError);
    }
  }, [editor, wsTicket, throwAsyncError]);

  const handleLanguageChange = (event: SelectChangeEvent) => {
    setLanguage(event.target.value as string);
  };

  const handleCompile = () => {
    const codeEvaluator = new CodeEvaluator();

    const transpiledCode = language === languages.typescript ? tsCompile(code) : code;

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
    <Grid container>
      <Grid item sm={6} xs={12}>
        <h2>{question?.title}</h2>
        <TextContent content={question?.description ?? ''} />
      </Grid>
      <Grid item sm={6} xs={12} style={{ padding: 10 }}>
        <FormControl sx={{ m: 1, minWidth: 200 }}>
          <InputLabel id="demo-simple-select-autowidth-label">Language</InputLabel>
          <Select
            labelId="demo-simple-select-autowidth-label"
            id="demo-simple-select-autowidth"
            value={language}
            onChange={handleLanguageChange}
            autoWidth
            label="Language"
          >
            {Object.values(languages).map((language) => {
              return (
                <MenuItem key={language} value={language}>
                  {language}
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
          language={language}
          onMount={handleEditorDidMount}
        />
        <button onClick={handleCompile}>Execute</button>

        <OutputBlock label="Debug output" output={codeEvalOutput.logs} />
        <OutputBlock label="Your output" output={codeEvalOutput.result} />
        <OutputBlock label="Error" output={codeEvalOutput.error} />
      </Grid>
    </Grid>
  );
};

const OutputBlock = ({ label, output }: { label: string; output: string }) => {
  return output ? (
    <div>
      <h3>{label}</h3>
      <pre>{output}</pre>
    </div>
  ) : (
    <></>
  );
};

export default CodeEditor;
