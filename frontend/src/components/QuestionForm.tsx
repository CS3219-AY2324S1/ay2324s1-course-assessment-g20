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

interface FormProps {
  formType: string;
  category: never[];
  inputTitle: (title: any) => void;
  inputCategory: (category: any) => void;
  inputComplexity: (complexity: any) => void;
  inputDescription: (description: any) => void;
  openForm: boolean;
  closeForm: () => void;
  submitForm: () => void;
  isValidated: boolean;
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
];

const complexities = [{ value: 'Easy' }, { value: 'Medium' }, { value: 'Hard' }];

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
            {categories.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
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
            {complexities.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.value}
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
