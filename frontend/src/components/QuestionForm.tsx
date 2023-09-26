import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  //OutlinedInput,
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
    <FormControl>
      <InputLabel id="category-label">Question Category</InputLabel>
      <Dialog open={openForm} onClose={closeForm}>
        <DialogTitle>{formType}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Fill in the question's title, category, complexity and description
          </DialogContentText>
          <TextField
            required
            margin="dense"
            id="title"
            label="Question Title"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            onChange={inputTitle}
          ></TextField>
          <Select
            required
            margin="dense"
            labelId="category-label"
            id="category"
            label="Question Category"
            fullWidth
            variant="outlined"
            multiple
            value={category}
            onChange={inputCategory}
            //input={<OutlinedInput label="Question Category" />}
          >
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.name}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
          <TextField
            required
            margin="dense"
            id="complexity"
            label="Question Complexity"
            fullWidth
            variant="outlined"
            select
            onChange={inputComplexity}
          >
            {difficulties.map((difficulty) => (
              <MenuItem key={difficulty.id} value={difficulty.name}>
                {difficulty.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            margin="dense"
            id="description"
            label="Question Description"
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
    </FormControl>
  );
}
