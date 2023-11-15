import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  addQuestion,
  getCategories,
  getDifficulties,
  updateQuestionWithId,
} from '../api/questionBankApi';
import { EMPTY_QUESTION, ICategory, IDifficulty, IQuestion } from '../@types/question';
import { PeerprepBackendError } from '../@types/PeerprepBackendError';

interface FormProps {
  openForm: boolean;
  closeForm: () => void;
  fetchAndSet: () => void;
  updateQuestion: IQuestion;
}

export default function QuestionForm({
  openForm,
  closeForm,
  fetchAndSet,
  updateQuestion,
}: FormProps) {
  const { palette } = useTheme();
  const { enqueueSnackbar } = useSnackbar();

  const addQnsHeader = 'Add a new question';
  const updateQnsHeader = 'Update this question';

  // Usestates and useeffect to handle the list of categories and difficulties available
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [difficulties, setDifficulties] = useState<IDifficulty[]>([]);

  const [isFormDisabled, setIsFormDisabled] = useState(true);

  useEffect(() => {
    // Fetch categories from API
    getCategories()
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Fetch difficulties from API
    getDifficulties()
      .then((response) => {
        setDifficulties(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  // Usestates and useeffect to handle the current question creation/update status
  const [currTitle, setCurrTitle] = useState('');
  const handleTitleInputChange = (event: any) => {
    setCurrTitle(event.target.value);
  };

  const [currDifficulty, setCurrDifficulty] = useState('');
  const handleDiffInputChange = (event: any) => {
    setCurrDifficulty(event.target.value);
  };

  const [currDescription, setCurrDescription] = useState('');
  const handleDescInputChange = (event: any) => {
    setCurrDescription(event.target.value);
  };

  const [currCategory, setCurrCategory] = useState<string[]>([]);
  const handleCatInputChange = (event: any) => {
    setCurrCategory(event.target.value);
  };

  useEffect(() => {
    if (updateQuestion != EMPTY_QUESTION) {
      setCurrTitle(updateQuestion.title);
      setCurrCategory(updateQuestion.categories);
      setCurrDifficulty(updateQuestion.difficulty);
      setCurrDescription(updateQuestion.description);
    }
  }, [updateQuestion]);

  useEffect(() => {
    setIsFormDisabled(
      !(currTitle.trim().length > 0) ||
        !(currCategory.length > 0) ||
        !(currDifficulty.trim().length > 0) ||
        !(currDescription.trim().length > 0),
    );
  }, [currTitle, currCategory, currDifficulty, currDescription]);

  // Functions to handle form submission
  const handleFormSubmission = async () => {
    const questionInput: IQuestion = {
      title: currTitle.trim(),
      categories: currCategory,
      difficulty: currDifficulty,
      description: currDescription,
    };

    try {
      if (updateQuestion != EMPTY_QUESTION) {
        questionInput._id = updateQuestion._id;
        await updateQuestionWithId(questionInput).then(() => {
          fetchAndSet();
        });
      } else {
        await addQuestion(questionInput).then(() => {
          fetchAndSet();
        });
      }
    } catch (error) {
      if (error instanceof PeerprepBackendError) {
        enqueueSnackbar(error.details.message, { variant: 'error' });
      } else {
        console.error('Error:', error);
      }
    }

    closeForm();
  };

  return (
    <Dialog open={openForm} onClose={closeForm} fullWidth>
      <DialogTitle sx={{ backgroundColor: palette.primary.main, color: 'white' }}>
        {updateQuestion != EMPTY_QUESTION ? updateQnsHeader : addQnsHeader}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Fill in the question's title, category, complexity and description.
        </DialogContentText>
        <br />
        <InputLabel id="title-label">Question Title</InputLabel>
        <TextField
          required
          margin="dense"
          id="title"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          value={currTitle}
          onChange={handleTitleInputChange}
        ></TextField>
        <InputLabel id="category-label">Question Category</InputLabel>
        <Select
          sx={{ marginBottom: '4px', marginTop: '8px', maxWidth: '100%' }}
          required
          margin="dense"
          id="category"
          fullWidth
          variant="outlined"
          multiple
          value={currCategory}
          onChange={handleCatInputChange}
          renderValue={(selected) => selected.join(', ')}
        >
          {categories.map((availableCategories) => (
            <MenuItem key={availableCategories._id} value={availableCategories.name}>
              <Checkbox checked={currCategory.indexOf(availableCategories.name) > -1} />
              {availableCategories.name}
            </MenuItem>
          ))}
        </Select>
        <InputLabel id="complexity-label">Question Complexity</InputLabel>
        <TextField
          required
          margin="dense"
          id="complexity"
          fullWidth
          variant="outlined"
          select
          value={currDifficulty}
          onChange={handleDiffInputChange}
        >
          {difficulties.map((difficulty) => (
            <MenuItem key={difficulty._id} value={difficulty.name}>
              {difficulty.name}
            </MenuItem>
          ))}
        </TextField>
        <InputLabel id="description-label">Question Description</InputLabel>
        <TextField
          required
          margin="dense"
          id="description"
          type="text"
          fullWidth
          variant="outlined"
          multiline
          value={currDescription}
          onChange={handleDescInputChange}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeForm}>Cancel</Button>
        <Button type="submit" onClick={handleFormSubmission} disabled={isFormDisabled}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
