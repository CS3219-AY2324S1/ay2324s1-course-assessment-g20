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
import { getAttemptsByUsername } from '../api/historyServiceApi';
import { getQuestionWithId } from '../api/questionBankApi';
import Popup from './Popup';
import { parseISO, format } from 'date-fns';

function HistoryBox({ username }: { username: string }) {
  const { palette } = useTheme();

  const [rows, setRows] = useState<IHistoryTableRow[]>([]);

  useEffect(() => {
    // Fetch history from API
    getAttemptsByUsername(username)
      .then((response) => response.data)
      .then(
        async (attempts) =>
          await Promise.all(
            attempts.map(async (attempt) => {
              const question = await getQuestionWithId(attempt.questionId).then(
                (response) => response.data,
              );

              console.log('TESTIN', {
                attempt: attempt,
                question: question,
              });
              return {
                attempt: attempt,
                question: question,
              };
            }),
          ),
      )
      .then((data) => setRows(data));
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
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
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
                    children={row.attempt.questionAttempt.toString()}
                    openPopup={rowIndex == index && popupVisibility}
                    closePopup={handlePopupOnClose}
                  ></Popup>
                </StyledTableCell>
                <StyledTableCell align="left">{row.question.categories.join(', ')}</StyledTableCell>
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
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default HistoryBox;
