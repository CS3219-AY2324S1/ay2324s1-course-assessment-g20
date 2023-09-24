import {
  Box,
  Button,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import FunctionalityButton from '../components/FunctionalityButton';
import QuestionForm from '../components/QuestionForm';
import Popup from '../components/Popup';

// TODO: Replace this with a real table
function createData(
  id: number,
  title: string,
  category: string,
  complexity: string,
  description: string,
) {
  return { id, title, category, complexity, description };
}

const rows = [
  createData(1, 'Reverse a String', 'Strings, Algorithms', 'Easy', 'Description 1'),
  createData(2, 'Repeated DNA Sequences', 'Data Structures, Algorithms', 'Medium', 'Description 2'),
  createData(3, 'Sliding Window Maximum', 'Arrays, Algorithms', 'Hard', 'Description 3'),
];

export default function Dashboard() {
  // Styling for dashboard table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  // Usestate for the current selected row
  const [rowIndex, setRowIndex] = useState(-1);
  const handleSelectedItem = (item: string) => {
    console.log(item);
  };

  // Usestate and functions to handle the description's popup
  const [popupVisibility, setPopupVisibility] = useState(false);
  const handlePopupOnClick = (num: number) => {
    setRowIndex(num);
    setPopupVisibility(true);
  };
  const handlePopupOnClose = () => setPopupVisibility(false);

  // Usestate and functions to handle the change in record of a question
  const [titleInput, setTitleInput] = useState('');
  const handleTitleInputChange = (event: any) => {
    setTitleInput(event.target.value);
  };
  const [catInput, setCatInput] = useState('');
  const handleCatInputChange = (event: any) => {
    setCatInput(event.target.value);
  };
  const [complexInput, setComplexInput] = useState('');
  const handleComplexInputChange = (event: any) => {
    setComplexInput(event.target.value);
  };
  const [descInput, setDescInput] = useState('');
  const handleDescInputChange = (event: any) => {
    setDescInput(event.target.value);
  };

  // Usestate and functions to handle the Add Question button's form
  const [openForm, setOpenForm] = useState(false);
  const handleButtonFormClick = () => {
    setOpenForm(true);
    console.log('Add Question'); //Remove later
  };
  const handleFormClose = () => {
    setOpenForm(false);
    console.log('Press Cancel'); //Remove later
  };
  const handleFormSubmit = () => {
    //Todo create new record
    rows.push(createData(rows.length + 1, titleInput, catInput, complexInput, descInput));
    setOpenForm(false);
    console.log('Press Add'); //Remove later
  };

  // Handle the scenario where the question bank database is empty
  if (rows.length == 0) {
    return (
      <Box>
        <Typography
          variant="h2"
          color="white"
          align="center"
          sx={{
            backgroundColor: 'red',
          }}
        >
          NO QUESTIONS AVAILABLE!
        </Typography>
        <h1></h1>
        <Typography align="right">
          {openForm && (
            <QuestionForm
              formType="Add a new question"
              inputTitle={handleTitleInputChange}
              inputCategory={handleCatInputChange}
              inputComplexity={handleComplexInputChange}
              inputDescription={handleDescInputChange}
              openForm={openForm}
              closeForm={handleFormClose}
              submitForm={handleFormSubmit}
            ></QuestionForm>
          )}
          <FunctionalityButton
            children="+ Add Question"
            handleOnClick={handleButtonFormClick}
          ></FunctionalityButton>
        </Typography>
      </Box>
    );
  }

  // Else handle the scenario where the question bank database is not empty
  return (
    <Box>
      <Typography
        variant="h2"
        color="white"
        align="center"
        sx={{
          backgroundColor: 'success.light',
        }}
      >
        Questions
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">No.</StyledTableCell>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Category</StyledTableCell>
              <StyledTableCell align="left">Complexity</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <StyledTableRow
                key={row.id}
                onClick={() => {
                  handleSelectedItem(row.title);
                }}
              >
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell align="left">{row.title}</StyledTableCell>
                <StyledTableCell align="left">{row.category}</StyledTableCell>
                <StyledTableCell align="left">{row.complexity}</StyledTableCell>
                <StyledTableCell align="left">
                  {popupVisibility && rowIndex == row.id && (
                    <Popup
                      title={row.title}
                      children={row.description}
                      openPopup={true}
                      setOpenPopup={handlePopupOnClose}
                    ></Popup>
                  )}
                  <Button onClick={() => handlePopupOnClick(row.id)}>READ</Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <h1></h1>
      <Typography align="right">
        {openForm && (
          <QuestionForm
            formType="Add a new question"
            inputTitle={handleTitleInputChange}
            inputCategory={handleCatInputChange}
            inputComplexity={handleComplexInputChange}
            inputDescription={handleDescInputChange}
            openForm={openForm}
            closeForm={handleFormClose}
            submitForm={handleFormSubmit}
          ></QuestionForm>
        )}
        <FunctionalityButton
          children="+ Add Question"
          handleOnClick={handleButtonFormClick}
        ></FunctionalityButton>
      </Typography>
    </Box>
  );
}
