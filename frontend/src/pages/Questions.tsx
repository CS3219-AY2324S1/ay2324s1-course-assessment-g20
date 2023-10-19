import {
  Box,
  Button,
  Grid,
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
  useTheme,
} from '@mui/material';
import QuestionForm from '../components/QuestionForm';
import Popup from '../components/Popup';
import { useEffect, useState } from 'react';
import { addQuestion, deleteQuestionWithId, getQuestions } from '../api/questionBankApi';
import { EMPTY_QUESTION, IQuestion } from '../@types/question';
import { useProfile } from '../hooks/useProfile';

export default function Dashboard() {
  const { isMaintainer } = useProfile();
  const { palette } = useTheme();

  // Styling for dashboard table
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const [rows, setRows] = useState<IQuestion[]>([]);
  const fetchAndSetQuestions = () => {
    getQuestions()
      .then((response) => {
        setRows(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    // Fetch questions from API
    fetchAndSetQuestions();
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
  const [questionInput, setQuestionInput] = useState<IQuestion>(EMPTY_QUESTION);

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
    addQuestion(questionInput)
      .then(() => {
        fetchAndSetQuestions();
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

    deleteQuestionWithId(id)
      .catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        fetchAndSetQuestions();
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
      <Grid container spacing={2} pb={3}>
        <Grid item xs={0} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h4" color="black" align="center" mb={2}>
            Questions
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} textAlign={{ xs: 'center', sm: 'right' }}>
          {isMaintainer && (
            <Button
              variant={'contained'}
              onClick={handleButtonFormClick}
              style={{ fontSize: '18px' }}
              sx={{
                height: 50,
                // mr: 'auto',
                whiteSpace: 'nowrap',
                minWidth: 'max-content',
              }}
            >
              Add a question
            </Button>
          )}
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">ID</StyledTableCell>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Category</StyledTableCell>
              <StyledTableCell align="left">Difficulty</StyledTableCell>
              {isMaintainer && (
                <StyledTableCell align="left" colSpan={2}>
                  Actions
                </StyledTableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <StyledTableRow key={index}>
                <StyledTableCell align="left">{index + 1}</StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  <Typography
                    variant="subtitle2"
                    onClick={() => handlePopupOnClick(index)}
                    sx={{ '&:hover': { cursor: 'pointer', color: palette.secondary.main } }}
                  >
                    {row.title}
                  </Typography>
                  {popupVisibility && rowIndex == index && (
                    <Popup
                      questionId={row._id}
                      title={row.title}
                      children={row.description}
                      openPopup={true}
                      setOpenPopup={handlePopupOnClose}
                    ></Popup>
                  )}
                </StyledTableCell>
                <StyledTableCell align="left">{row.categories.join(', ')}</StyledTableCell>
                <StyledTableCell align="left">{row.difficulty}</StyledTableCell>
                {isMaintainer && (
                  <StyledTableCell align="center">
                    <Button
                      variant={'contained'}
                      onClick={() => handleDeleteOnClick(row._id)}
                      sx={{
                        width: 80,
                        height: 35,
                        backgroundColor: palette.error.main,
                        '&:hover': {
                          backgroundColor: palette.error.dark,
                        },
                      }}
                    >
                      DELETE
                    </Button>
                  </StyledTableCell>
                )}
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
      </Typography>
    </Box>
  );
}
