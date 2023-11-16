import { SelectChangeEvent } from '@mui/material';
import { Language } from '../@types/language';
import EditorScreen from '../components/Editor/EditorScreen';
import { useThrowAsyncError } from '../hooks/useThrowAsyncError';
import { useEffect, useState } from 'react';
import { getAllLanguages } from '../api/userApi';
import { useParams } from 'react-router-dom';
import { getSessionAttempt } from '../api/collaborationServiceApi';
import { IAttempt } from '../@types/history';

function SoloCodeEditor() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [attempt, setAttempt] = useState<IAttempt | undefined>(undefined);
  const [selectedLanguage, setSelectedLanguage] = useState<Language | undefined>(undefined);
  const [languages, setLanguages] = useState<Language[]>([]);

  const throwAsyncError = useThrowAsyncError();

  useEffect(() => {
    getAllLanguages()
      .then((resp) => {
        if (languages.length === 0) {
          setLanguages(resp.data);
        }
        return resp.data;
      })
      .catch(() => {
        throwAsyncError('Error getting supported languages');
        return [];
      })
      .then(async (languages) => {
        const { data: attempt } = await getSessionAttempt(sessionId!);
        const language = languages.filter((l) => l.id === attempt.languageId)[0];
        setSelectedLanguage(language);
        setAttempt(attempt);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLanguageFromId = (id: number) => {
    return languages.filter((language) => language.id === id)[0];
  };

  const handleLanguageChange = async (event: SelectChangeEvent<number>) => {
    setSelectedLanguage(getLanguageFromId(Number(event.target.value)));
  };

  return (
    <>
      {selectedLanguage != undefined && attempt?.question != undefined && (
        <EditorScreen
          key={selectedLanguage.id}
          question={attempt?.question}
          selectedLanguage={selectedLanguage}
          languages={languages}
          handleLanguageChange={handleLanguageChange}
          initialCode={attempt?.attemptTextByLanguageId[selectedLanguage.id] ?? ''}
        />
      )}
    </>
  );
}

export default SoloCodeEditor;
