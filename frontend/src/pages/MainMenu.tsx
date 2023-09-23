import { Button, Stack, Typography } from '@mui/material';
import Dashboard from './Dashboard';

export default function MainMenu() {
  return (
    <>
      <Typography variant="h2" align="center" color="white"
        sx={{
          backgroundColor: 'grey',
        }}
      >
        MATCH WITH SOMEONE
      </Typography>
      <Typography align="center" component={'span'}>
        <Stack display={'block'} spacing={2} direction={'row'}>
          <Button
            variant={'contained'}
            color={'success'}
            size={'large'}
            onClick={() => console.log('CLICKED EASY')}
            aria-label="Large sizes"
          >
            EASY
          </Button>
          <Button
            variant={'contained'}
            color={'warning'}
            size={'large'}
            onClick={() => console.log('CLICKED MEDIUM')}
            aria-label="Large sizes"
          >
            MEDIUM
          </Button>
          <Button
            variant={'contained'}
            color={'error'}
            size={'large'}
            onClick={() => console.log('CLICKED HARD')}
            aria-label="Large sizes"
          >
            HARD
          </Button>
        </Stack>
      </Typography>
      <h1></h1>
      <Dashboard></Dashboard>
    </>
  );
}
