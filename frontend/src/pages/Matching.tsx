import { Button, Stack, Typography, Box, useTheme } from '@mui/material';

export default function Matching() {
  const { palette } = useTheme();

  return (
    <Box py={2}>
      <Typography variant="h4" align="center" mb={2}>
        Prep with others
      </Typography>
      <Typography align="center" variant="subtitle2">
        Choose a question difficulty level and start practicing with a stranger.
      </Typography>
      <br />
      <Box display="flex" justifyContent="center">
        <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
          <Button
            variant="contained"
            onClick={() => console.log('CLICKED EASY')}
            style={{ fontSize: '40px' }}
            sx={{
              backgroundColor: palette.easy.main,
              '&:hover': {
                backgroundColor: palette.easy.dark,
              },
            }}
          >
            Easy
          </Button>
          <Button
            variant="contained"
            onClick={() => console.log('CLICKED MEDIUM')}
            style={{ fontSize: '40px' }}
            sx={{
              backgroundColor: palette.medium.main,
              '&:hover': {
                backgroundColor: palette.medium.dark,
              },
            }}
          >
            Medium
          </Button>
          <Button
            variant="contained"
            onClick={() => console.log('CLICKED HARD')}
            style={{ fontSize: '40px' }}
            sx={{
              backgroundColor: palette.hard.main,
              '&:hover': {
                backgroundColor: palette.hard.dark,
              },
            }}
          >
            Hard
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
