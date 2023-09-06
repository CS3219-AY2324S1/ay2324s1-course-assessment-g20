import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

// TODO: Replace this with a real table
function createData(
  id: number,
  title: string,
  description: string,
  category: string,
  complexity: string,
) {
  return { id, title, description, category, complexity };
}

const rows = [
  createData(1, 'Reverse a String', 'Description 1', 'Strings, Algorithms', 'Easy'),
  createData(1, 'Repeated DNA Sequences', 'Description 2', 'Data Structures, Algorithms', 'Medium'),
  createData(1, 'Sliding Window Maximum', 'Description 3', 'Arrays, Algorithms', 'Hard'),
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h2">PeerPrep Dashboard</Typography>
      <Button href={`/login`}>Log out</Button>
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
            {rows.map((row) => (
              <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.id}
                </TableCell>
                <TableCell align="left">{row.title}</TableCell>
                <TableCell align="left">{row.category}</TableCell>
                <TableCell align="left">{row.complexity}</TableCell>
                {/* <TableCell align="right">{row.protein}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
