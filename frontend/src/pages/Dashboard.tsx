import { Box } from '@mui/material';
import Matching from './Matching';
import Questions from './Questions';

export default function Dashboard() {
  return (
    <Box minWidth="280px">
      <Matching />
      <hr />
      <br />
      <Questions />
    </Box>
  );
}
