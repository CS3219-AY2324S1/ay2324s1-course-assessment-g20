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

  const [rowIndex, setRowIndex] = useState(-1);
  const handleSelectItem = (item: string) => {
    console.log(item);
  };

  const [popupVisibility, setPopupVisibility] = useState(false);
  const handleOnClick = (num: number) => {
    setRowIndex(num);
    setPopupVisibility(true);
  };
  const handleOnClose = () => setPopupVisibility(false);

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
      </Box>
    );
  }

  return (
    <Box>
      <Typography
        variant="h2" color="white" align="center"
        sx={{
          backgroundColor: 'green',
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
                  handleSelectItem(row.title);
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
                      setOpenPopup={handleOnClose}
                    ></Popup>
                  )}
                  <Button onClick={() => handleOnClick(row.id)}>READ</Button>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
