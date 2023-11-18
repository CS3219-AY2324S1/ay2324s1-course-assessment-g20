import { Palette, TableCell, TableRow, styled, tableCellClasses } from '@mui/material';

// Styling for tables
export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

// Styling for table rows
export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const getDifficultyColor = (palette: Palette, difficulty: string) => {
  switch (difficulty) {
    case 'Easy':
      return palette.easy.main;
    case 'Medium':
      return palette.medium.main;
    case 'Hard':
      return palette.hard.main;
    default:
      return 'black';
  }
};
