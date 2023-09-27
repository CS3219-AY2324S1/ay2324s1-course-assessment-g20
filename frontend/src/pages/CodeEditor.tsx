import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Grid } from '@mui/material';
import { CodeEvaluator } from '../utils/codeEvaluator';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as ts from 'typescript';
import { languages } from '../utils/constants';
import { ICodeEvalOutput, IQuestion } from '../interfaces';
import { exampleQuestion1 } from '../mocks';
import { pingProtectedBackend } from '../api/questionBankApi';

// component built with reference to online guide: https://www.freecodecamp.org/news/how-to-build-react-based-code-editor/

// This function transpiles TypeScript to JavaScript, allowing users to write TypeScript in the code editor
function tsCompile(source: string): string {
  const options = { compilerOptions: { module: ts.ModuleKind.CommonJS } };
  return ts.transpileModule(source, options).outputText;
}

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

const CodeEditor = () => {
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('// some comment');
  const [codeEvalOutput, setCodeEvalOutput] = useState<ICodeEvalOutput>({
    error: '',
    logs: '',
    result: '',
  });

  useEffect(() => {
    // TODO: Replace below with a real API call to fetch a question
    pingProtectedBackend().then((response) => {
      console.log('protected response', response);
      setQuestion(exampleQuestion1);
    });
  }, []);

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

  return (
    <Grid container>
      <Grid item sm={6} xs={12}>
        <h2>{question?.title}</h2>
        {question?.description}
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
        />
        <button onClick={handleCompile}>Execute</button>

        <OutputBlock label="Debug output" output={codeEvalOutput.logs} />
        <OutputBlock label="Your output" output={codeEvalOutput.result} />
        <OutputBlock label="Error" output={codeEvalOutput.error} />
      </Grid>
    </Grid>
  );
};

export default CodeEditor;
