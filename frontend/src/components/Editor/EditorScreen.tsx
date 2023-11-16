import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { IQuestion } from '../../@types/question';
import TextContent from '../TextContent';
import { formatLanguage } from '../../utils/languageUtils';
import { editor as MonacoEditor } from 'monaco-editor';
import { ICodeEvalOutput } from '../../@types/codeEditor';
import { CodeEvaluator } from '../../utils/codeEvaluator';
import { tsCompile } from '../../utils/editorUtils';
import Editor from '@monaco-editor/react';
import { Language, PLACEHOLDER_LANGUAGE } from '../../@types/language';
import ChatbotPopup from '../Chatbot/ChatbotPopup';
import './Editor.css';

interface EditorScreenProps {
  question: IQuestion | undefined;
  selectedLanguage: Language;
  languages: Language[];
  handleLanguageChange: (event: SelectChangeEvent<number>) => Promise<void | undefined>;
  handleEditorDidMount?: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
  initialCode?: string;
  sessionId?: string;
}

const EditorScreen = ({
  question,
  selectedLanguage,
  languages,
  handleLanguageChange,
  handleEditorDidMount,
  initialCode = '',
  sessionId = undefined,
}: EditorScreenProps) => {
  const [code, setCode] = useState(initialCode ?? '');
  const [codeEvalOutput, setCodeEvalOutput] = useState<ICodeEvalOutput>(placeholderCodeEvalOutput);
  const handleCodeChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleCompile = () => {
    const codeEvaluator = new CodeEvaluator();

    const transpiledCode =
      selectedLanguage?.name.toLowerCase() === 'typescript' ? tsCompile(code) : code;

    codeEvaluator
      .evalAsync(transpiledCode)
      .then((output) => {
        setCodeEvalOutput(output);
      })
      .catch((output) => {
        setCodeEvalOutput(output);
      });
  };

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
              disabled={selectedLanguage === PLACEHOLDER_LANGUAGE}
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={selectedLanguage === PLACEHOLDER_LANGUAGE ? '' : selectedLanguage?.id}
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
            defaultValue={code}
            onChange={handleCodeChange}
            options={{
              padding: {
                top: 15,
              },
            }}
            language={selectedLanguage?.name.toLowerCase() ?? ''}
            onMount={handleEditorDidMount ?? (() => {})}
          />
          <Button onClick={handleCompile} variant="contained" sx={{ textTransform: 'none' }}>
            Execute
          </Button>

          <OutputBlock label="Debug output" output={codeEvalOutput.logs} />
          <OutputBlock label="Your output" output={codeEvalOutput.result} />
          <OutputBlock label="Error" output={codeEvalOutput.error} />
        </Box>

        {sessionId != undefined && (
          <ChatbotPopup
            sessionId={sessionId}
            language={selectedLanguage.name}
            userSolution={code}
          />
        )}
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

const placeholderCodeEvalOutput = {
  error: '',
  logs: '',
  result: '',
};
export default EditorScreen;
