import { SelectChangeEvent } from '@mui/material';
import { Language } from '../@types/language';
import EditorScreen from '../components/EditorScreen';
import { useThrowAsyncError } from '../hooks/useThrowAsyncError';
import { useEffect, useState } from 'react';
import { getAllLanguages } from '../api/userApi';
import { useLocation, useParams } from 'react-router-dom';
import { IQuestion } from '../@types/question';
import { getQuestionWithId } from '../api/questionBankApi';
import { getQuestionIdAndLanguageIdFromIdentifier } from '../utils/editorUtils';

// Get language and question from params

function SoloCodeEditor() {
  const { identifier } = useParams<{ identifier: string }>();
  const { state } = useLocation();
  const [question, setQuestion] = useState<IQuestion | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(undefined);
  const [languages, setLanguages] = useState<Language[]>([]);

  const throwAsyncError = useThrowAsyncError();

  useEffect(() => {
    getAllLanguages()
      .then((resp) => {
        if (languages.length === 0) {
          setLanguages(resp.data);
        }
      })
      .catch(() => {
        throwAsyncError('Error getting supported languages');
      })
      .then(() => {
        if (identifier && selectedLanguage == undefined) {
          const { questionId, languageId } = getQuestionIdAndLanguageIdFromIdentifier(identifier);

          getQuestionWithId(questionId)
            .then((response) => response.data)
            .then((question) => setQuestion(question));

          setSelectedLanguage(getLanguageFromId(parseInt(languageId)));
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languages, selectedLanguage]);

  const getLanguageFromId = (id: number) => {
    return languages.filter((language) => language.id === id)[0];
  };

  const handleLanguageChange = async (event: SelectChangeEvent<number>) => {
    setSelectedLanguage(getLanguageFromId(Number(event.target.value)));
  };

  return (
    <>
      {selectedLanguage != undefined && question != undefined && (
        <EditorScreen
          question={question}
          selectedLanguage={selectedLanguage}
          languages={languages}
          handleLanguageChange={handleLanguageChange}
          initialCode={state?.attemptText ?? ''}
        />
      )}
    </>
  );
}

export default SoloCodeEditor;
