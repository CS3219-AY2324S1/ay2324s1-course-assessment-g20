import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { pingProtectedBackend, pingPublicBackend } from '../api/questionBankApi';
import { toTitleCase } from '../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { IQuestion } from '../interfaces';
import { exampleQuestions } from '../mocks';

export default function Dashboard() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<IQuestion[]>([]);

  useEffect(() => {
    pingPublicBackend().then((response) => {
      console.log('public response', response);
    });
    pingProtectedBackend().then((response) => {
      console.log('protected response', response);
    });

    // TODO: Replace below with a real API call
    setQuestions(exampleQuestions);
  }, []);

  return (
    <Box>
      <Typography variant="h2">PeerPrep Dashboard</Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Title</TableCell>
              <TableCell align="left">Category&nbsp;(g)</TableCell>
              <TableCell align="left">Complexity&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {questions.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                onClick={() => {
                  navigate(`/question/${row.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">
                  {row.categories.map((x) => toTitleCase(x.name)).join(', ')}
                </TableCell>
                <TableCell align="left">{toTitleCase(row.difficulty.name)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
