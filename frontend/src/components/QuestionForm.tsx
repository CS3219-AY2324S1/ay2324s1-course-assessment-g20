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
import { useEffect, useState } from 'react';
import { ICategory, IDifficulty } from '../interfaces';
import { getCategories, getDifficulties } from '../api/questionBankApi';

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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [difficulties, setDifficulties] = useState<IDifficulty[]>([]);

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
