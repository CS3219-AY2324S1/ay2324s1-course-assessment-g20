import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import { StyledTableCell, StyledTableRow, getDifficultyColor } from '../utils/styleUtils';
import { IHistoryTableRow } from '../@types/history';
import { useEffect, useState } from 'react';
import { getQuestionWithId } from '../api/questionBankApi';
import Popup from './Popup';
import { parseISO, format } from 'date-fns';
import { getAllLanguages, getAttemptsByUsername } from '../api/userApi';
import { DEFAULT_LANGUAGE, formatLanguage } from '../utils/languageUtils';
import { useNavigate } from 'react-router-dom';
import { getNavigateToCodeEditorUrl } from '../utils/editorUtils';

function HistoryBox({ username }: { username: string }) {
  const navigate = useNavigate();
  const { palette } = useTheme();

  const [rows, setRows] = useState<IHistoryTableRow[]>([]);

  useEffect(() => {
    // Fetch languages from API
    getAllLanguages().then((languageResponse) => {
      const languages = languageResponse.data;

      // Fetch history from API
      getAttemptsByUsername(username)
        .then((response) => response.data)
        .then((attempts) =>
          attempts.map(async (attempt) => {
            // Fetch question from API
            const question = await getQuestionWithId(attempt.questionId).then(
              (response) => response.data,
            );

            return {
              attempt: {
                ...attempt,
              },
              question: question,
              language:
                languages.filter((language) => language.id === attempt.languageId)[0]?.name ??
                DEFAULT_LANGUAGE,
            };
          }),
        )
        .then((data) => Promise.all(data))
        .then((rows) => setRows(rows));
    });
  }, [username]);

  // Usestate for the current selected row
  const [rowIndex, setRowIndex] = useState(-1);
  // Usestate and functions to handle the description's popup
  const [popupVisibility, setPopupVisibility] = useState(false);
  const handlePopupOnClick = (num: number) => {
    setRowIndex(num);
    setPopupVisibility(true);
  };
  const handlePopupOnClose = () => setPopupVisibility(false);

  // Logic for continue attempt button
  const handleContinueAttempt = () => {
    handlePopupOnClose();
    navigate(
      getNavigateToCodeEditorUrl(
        rows[rowIndex].question._id ?? '',
        rows[rowIndex].attempt.languageId.toString(),
      ),
      {
        state: {
          attemptText: rows[rowIndex].attempt.attemptText,
        },
      },
    );
  };

  return (
    <Box>
      <Grid container spacing={2} pb={3}>
        <Grid item xs={0} sm={4}></Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="h4" color="black" align="center" mb={2}>
            History
          </Typography>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Title</StyledTableCell>
              <StyledTableCell align="left">Category</StyledTableCell>
              <StyledTableCell align="left">Difficulty</StyledTableCell>
              <StyledTableCell align="left">Date Attempted</StyledTableCell>
              <StyledTableCell align="left">Language</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => {
              return (
                <StyledTableRow key={index}>
                  <StyledTableCell component="th" scope="row">
                    <Typography
                      variant="subtitle2"
                      onClick={() => handlePopupOnClick(index)}
                      sx={{ '&:hover': { cursor: 'pointer', color: palette.secondary.main } }}
                    >
                      {row.question.title}
                    </Typography>

                    <Popup
                      title={row.question.title}
                      children={'Your solution:\n\n' + row.attempt.attemptText.toString()}
                      isCode={true}
                      language={row.language}
                      openPopup={rowIndex == index && popupVisibility}
                      closePopup={handlePopupOnClose}
                      showButton={true}
                      buttonText={'Continue Attempt'}
                      buttonOnClick={handleContinueAttempt}
                    ></Popup>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {row.question.categories.join(', ')}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Typography
                      variant="subtitle2"
                      color={getDifficultyColor(palette, row.question.difficulty)}
                    >
                      {row.question.difficulty}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {format(
                      parseISO(row.attempt.dateTimeAttempted.toString()),
                      'MMMM d, yyyy HH:mm:ss',
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="left">{formatLanguage(row.language)}</StyledTableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default HistoryBox;
