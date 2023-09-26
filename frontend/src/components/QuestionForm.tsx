import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  // InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { BACKEND_API_HOST, backendServicesPaths } from '../utils/constants';
import { Category, Difficulty } from '../interfaces';

interface FormProps {
  formType: string;
  category: string[];
  inputTitle: (event: any) => void;
  inputCategory: (event: any) => void;
  inputComplexity: (event: any) => void;
  inputDescription: (event: any) => void;
  openForm: boolean;
  closeForm: () => void;
  submitForm: () => void;
  isValidated: boolean;
}

export default function QuestionForm({
  formType,
  category,
  inputTitle,
  inputCategory,
  inputComplexity,
  inputDescription,
  openForm,
  closeForm,
  submitForm,
  isValidated,
}: FormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [difficulties, setDifficulties] = useState<Difficulty[]>([]);

  useEffect(() => {
    // Fetch categories from API
    axios
      .get(BACKEND_API_HOST + backendServicesPaths.question.categories)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    // Fetch difficulties from API
    axios
      .get(BACKEND_API_HOST + backendServicesPaths.question.difficulties)
      .then((response) => {
        setDifficulties(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (
    <Dialog open={openForm} onClose={closeForm}>
      <DialogTitle>{formType}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          Fill in the question's title, category, complexity and description
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
          onChange={inputTitle}
        ></TextField>
        <InputLabel id="category-label">Question Category</InputLabel>
        <Select
          sx={{ marginBottom: '4px', marginTop: '8px' }}
          required
          margin="dense"
          id="category"
          fullWidth
          variant="outlined"
          multiple
          value={category}
          onChange={inputCategory}
        >
          {categories.map((category) => (
            <MenuItem key={category._id} value={category.name}>
              {category.name}
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
          onChange={inputComplexity}
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
          onChange={inputDescription}
        ></TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeForm}>Cancel</Button>
        <Button type="submit" onClick={submitForm} disabled={isValidated}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
