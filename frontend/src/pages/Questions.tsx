import {
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Icon,
  useTheme,
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import QuestionForm from '../components/QuestionForm';
import Popup from '../components/Popup';
import { useEffect, useState } from 'react';
import { deleteQuestionWithId, getQuestions } from '../api/questionBankApi';
import { EMPTY_QUESTION, IQuestion } from '../@types/question';
import { useProfile } from '../hooks/useProfile';
import { StyledTableCell, StyledTableRow, getDifficultyColor } from '../utils/styleUtils';

export default function Dashboard() {
  const { isMaintainer } = useProfile();
  const { palette } = useTheme();

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

  // Usestate and functions to handle the Add Question button's form
  const [openForm, setOpenForm] = useState(false);
  const handleButtonFormClick = () => {
    setUpdateRowInfo(EMPTY_QUESTION);
    setOpenForm(true);
  };
  const handleFormClose = () => {
    setOpenForm(false);
    setUpdateRowInfo(EMPTY_QUESTION);
  };

  // Functions to handle the Delete Question button
  const [deletePopupVisibility, setDeletePopupVisibility] = useState(false);

  const handleDeletePopupOnClose = () => {
    setDeletePopupVisibility(false);
  };

  const handleDeleteOnClick = (num: number) => {
    setRowIndex(num);
    setDeletePopupVisibility(true);
  };

  const handleDeleteButtonSubmit = (id: string | undefined) => {
    if (id == undefined) return;

    deleteQuestionWithId(id)
      .catch((error) => {
        console.error('Error:', error);
      })
      .then(() => {
        fetchAndSetQuestions();
      });

    setDeletePopupVisibility(false);
  };

  // Usestates and functions to handle the Update Question button
  const [updateRowInfo, setUpdateRowInfo] = useState<IQuestion>(EMPTY_QUESTION);
  const handleUpdateOnClick = (row: IQuestion | undefined) => {
    if (row == undefined) return;

    setUpdateRowInfo(row);
    setOpenForm(true);
  };

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

                  <Popup
                    title={row.title}
                    children={row.description}
                    openPopup={rowIndex == index && popupVisibility}
                    closePopup={handlePopupOnClose}
                  ></Popup>
                </StyledTableCell>
                <StyledTableCell align="left">{row.categories.join(', ')}</StyledTableCell>
                <StyledTableCell align="left">
                  <Typography
                    variant="subtitle2"
                    color={getDifficultyColor(palette, row.difficulty)}
                  >
                    {row.difficulty}
                  </Typography>
                </StyledTableCell>
                {isMaintainer && (
                  <StyledTableCell align="center">
                    <Stack
                      justifyContent={'center'}
                      alignItems={'center'}
                      spacing={2}
                      direction={{ xs: 'column', sm: 'row' }}
                    >
                      <Button
                        variant={'contained'}
                        onClick={() => handleDeleteOnClick(index)}
                        sx={{
                          width: 80,
                          height: 35,
                          backgroundColor: palette.error.main,
                          '&:hover': {
                            backgroundColor: palette.error.light,
                          },
                        }}
                      >
                        DELETE
                      </Button>

                      <Popup
                        TitleIcon={
                          <Icon style={{ marginRight: '16px', color: palette.warning.main }}>
                            <ReportProblemIcon />
                          </Icon>
                        }
                        title={'ARE YOU SURE?'}
                        children={`Do you really want to delete the question:\n${row.title.toUpperCase()}?`}
                        openPopup={rowIndex == index && deletePopupVisibility}
                        closePopup={handleDeletePopupOnClose}
                        showButton={true}
                        buttonBackgroundColor={palette.error.main}
                        buttonHoverColor={palette.error.light}
                        buttonFontColor={'white'}
                        buttonText={'DELETE'}
                        buttonOnClick={() => handleDeleteButtonSubmit(row._id)}
                      ></Popup>
                      <Button
                        variant={'contained'}
                        onClick={() => handleUpdateOnClick(row)}
                        sx={{
                          width: 80,
                          height: 35,
                          backgroundColor: palette.info.main,
                          '&:hover': {
                            backgroundColor: palette.info.light,
                          },
                        }}
                      >
                        UPDATE
                      </Button>
                    </Stack>
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
            openForm={openForm}
            closeForm={handleFormClose}
            fetchAndSet={fetchAndSetQuestions}
            updateQuestion={updateRowInfo}
          ></QuestionForm>
        )}
      </Typography>
    </Box>
  );
}
