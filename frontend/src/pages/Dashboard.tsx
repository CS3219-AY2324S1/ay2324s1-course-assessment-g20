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
import { useEffect } from 'react';
import { ICategory, IDifficulty, IQuestion } from '../interfaces';
import { toTitleCase } from '../utils/stringUtils';
import { useNavigate } from 'react-router-dom';
import { pingProtectedBackend, pingPublicBackend } from '../api/questionBankApi';

// TODO: remove this dummy data and replace it with real data from the backend
const loremIpsum = `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`;
const questionCategoryStrings: ICategory = {
  id: 1,
  name: 'strings',
};
const questionCategoryArrays: ICategory = {
  id: 2,
  name: 'arrays',
};
const questionCategoryAlgorithms: ICategory = {
  id: 3,
  name: 'algorithms',
};

const questionDifficultyEasy: IDifficulty = {
  id: 1,
  name: 'easy',
};

const questionDifficultyMedium: IDifficulty = {
  id: 2,
  name: 'medium',
};

const questionDifficultyHard: IDifficulty = {
  id: 3,
  name: 'hard',
};

export const exampleQuestion1: IQuestion = {
  id: 1,
  title: 'Reverse a String',
  description: loremIpsum,
  categories: [questionCategoryStrings, questionCategoryAlgorithms],
  difficulty: questionDifficultyEasy,
};

export const exampleQuestion2: IQuestion = {
  id: 2,
  title: 'Repeated DNA Sequences',
  description: loremIpsum,
  categories: [questionCategoryAlgorithms],
  difficulty: questionDifficultyMedium,
};

export const exampleQuestion3: IQuestion = {
  id: 3,
  title: 'Sliding Window Maximum',
  description: loremIpsum,
  categories: [questionCategoryArrays, questionCategoryAlgorithms],
  difficulty: questionDifficultyHard,
};

const exampleQuestions: IQuestion[] = [exampleQuestion1, exampleQuestion2, exampleQuestion3];

export default function Dashboard() {

  const navigate = useNavigate();
  // TODO: Remove this useEffect and replace it with a real API call using react-router data loaders
  useEffect(() => {
    pingPublicBackend().then((response) => {
      console.log('public response', response);
    });
    pingProtectedBackend().then((response) => {
      console.log('protected response', response);
    });
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
              {/* <TableCell align="right">Protein&nbsp;(g)</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {exampleQuestions.map((row) => (
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
                {/* <TableCell align="right">{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
