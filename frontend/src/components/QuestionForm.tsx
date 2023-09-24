import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';

interface FormProps {
  formType: string;
  defTitle?: string;
  defCategory?: string;
  defComplexity?: string;
  defDescription?: string;
  inputTitle: (title: any) => void;
  inputCategory: (category: any) => void;
  inputComplexity: (complexity: any) => void;
  inputDescription: (description: any) => void;
  openForm: boolean;
  closeForm: () => void;
  submitForm: () => void;
}

const categories = [
  { value: 'Algorithms' },
  { value: 'Arrays' },
  { value: 'Bit Manipulation' },
  { value: 'BrainTeaser' },
  { value: 'Databases' },
  { value: 'Data Structures' },
  { value: 'Recursion' },
  { value: 'Strings' },
]; // Need to be able to select multiple

const complexities = [{ value: 'Easy' }, { value: 'Medium' }, { value: 'Hard' }];

export default function QuestionForm({
  formType,
  defTitle,
  defCategory,
  defComplexity,
  defDescription,
  inputTitle,
  inputCategory,
  inputComplexity,
  inputDescription,
  openForm,
  closeForm,
  submitForm,
}: FormProps) {
  return (
    <>
      <Dialog open={openForm} onClose={closeForm}>
        <DialogTitle>{formType}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>Fill in every field below</DialogContentText>
          <TextField
            required
            margin="dense"
            id="name"
            label="Question Title"
            defaultValue={defTitle}
            type="text"
            fullWidth
            variant="filled"
            multiline
            onChange={inputTitle}
          ></TextField>
          <TextField
            required
            margin="dense"
            id="name"
            label="Question Category"
            defaultValue={defCategory}
            fullWidth
            variant="filled"
            select
            onChange={inputCategory}
          >
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            margin="dense"
            id="name"
            label="Question Complexity"
            defaultValue={defComplexity}
            fullWidth
            variant="filled"
            select
            onChange={inputComplexity}
          >
            {complexities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Question Description"
            defaultValue={defDescription}
            type="text"
            fullWidth
            variant="filled"
            multiline
            onChange={inputDescription}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeForm}>Cancel</Button>
          <Button onClick={submitForm}>Done</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
