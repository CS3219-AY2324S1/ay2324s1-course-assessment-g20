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
import QuestionForm from '../components/QuestionForm';
import Popup from '../components/Popup';
import { BACKEND_API_HOST, backendServicesPaths } from '../utils/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { EMPTY_QUESTION, Question } from '../interfaces';

export default function Dashboard() {
  const QUESTIONS_ROUTE = BACKEND_API_HOST + backendServicesPaths.question.root;
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

  const getQuestions = () => {
    axios
      .get(QUESTIONS_ROUTE)
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const [rows, setRows] = useState<Question[]>([]);
  useEffect(() => {
    // Fetch questions from API
    getQuestions();
  }, []);

  // Usestate for the current selected row
  const [rowIndex, setRowIndex] = useState(-1);

  // Usestate and functions to handle the description's popup
  const [popupVisibility, setPopupVisibility] = useState(false);
  const handlePopupOnClick = (num: number) => {
    setRowIndex(num);
    setPopupVisibility(true);
  };
  const handlePopupOnClose = () => setPopupVisibility(false);

  // Usestate and functions to handle the change in record of a question
  const [questionInput, setQuestionInput] = useState<Question>(EMPTY_QUESTION);

  const handleTitleInputChange = (event: any) => {
    setQuestionInput({
      ...questionInput,
      title: event.target.value,
    });
  };

  const handleCatInputChange = (event: any) => {
    setQuestionInput({
      ...questionInput,
      categories: event.target.value,
    });
  };

  const handleComplexInputChange = (event: any) => {
    setQuestionInput({
      ...questionInput,
      difficulty: event.target.value,
    });
  };

  const handleDescInputChange = (event: any) => {
    setQuestionInput({
      ...questionInput,
      description: event.target.value,
    });
  };

  // Usestate and functions to handle the Add Question button's form
  const [openForm, setOpenForm] = useState(false);
  const handleButtonFormClick = () => {
    setOpenForm(true);
  };
  const handleFormClose = () => {
    setOpenForm(false);
  };
  const handleFormSubmit = () => {
    axios
      .post(QUESTIONS_ROUTE, {
        question: questionInput,
      })
      .then(() => {
        getQuestions();
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    setOpenForm(false);

    // Reset the useStates of the fields of the form
    setQuestionInput(EMPTY_QUESTION);
  };

  // Functions to handle the Delete Question button
  const handleDeleteOnClick = (id: string | undefined) => {
    if (id == undefined) return;

    axios
      .delete(QUESTIONS_ROUTE + id)
      .catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        getQuestions();
      });
  };

  const validateForm = () => {
    return (
      !questionInput.title ||
      !questionInput.categories.toString() ||
      !questionInput.difficulty ||
      !questionInput.description
    );
  };
  const isValidated = validateForm();

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
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Category</StyledTableCell>
              <StyledTableCell align="left">Complexity</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell component="th" scope="row">
                  {row.title}
                </StyledTableCell>
                <StyledTableCell align="left">{row.categories.join(', ')}</StyledTableCell>
                <StyledTableCell align="left">{row.difficulty}</StyledTableCell>
                <StyledTableCell align="left">
                  {popupVisibility && rowIndex == index && (
                    <Popup
                      title={row.title}
                      children={row.description}
                      openPopup={true}
                      setOpenPopup={handlePopupOnClose}
                    ></Popup>
                  )}
                  <Button
                    variant="contained"
                    onClick={() => handlePopupOnClick(index)}
                    sx={{
                      width: 30,
                      height: 35,
                    }}
                  >
                    READ
                  </Button>
                </StyledTableCell>
                <StyledTableCell align="left">
                  {popupVisibility && rowIndex == index && (
                    <Popup
                      title={row.title}
                      children={row.description}
                      openPopup={true}
                      setOpenPopup={handlePopupOnClose}
                    ></Popup>
                  )}
                  <Button
                    variant={'contained'}
                    onClick={() => handleDeleteOnClick(row._id)}
                    sx={{
                      width: 80,
                      height: 35,
                      backgroundColor: 'red',
                    }}
                  >
                    DELETE
                  </Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Typography align="right">
        {openForm && (
          <QuestionForm
            formType="Add a new question"
            category={questionInput.categories}
            inputTitle={handleTitleInputChange}
            inputCategory={handleCatInputChange}
            inputComplexity={handleComplexInputChange}
            inputDescription={handleDescInputChange}
            openForm={openForm}
            closeForm={handleFormClose}
            submitForm={handleFormSubmit}
            isValidated={isValidated}
          ></QuestionForm>
        )}
        <Button
          variant={'contained'}
          onClick={handleButtonFormClick}
          style={{ fontSize: '18px' }}
          sx={{
            width: 180,
            height: 50,
          }}
        >
          Add Question
        </Button>
      </Typography>
    </Box>
  );
}
