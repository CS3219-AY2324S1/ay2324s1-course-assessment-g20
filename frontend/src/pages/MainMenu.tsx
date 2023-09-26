import { Button, Stack, Typography } from '@mui/material';
import Dashboard from './Dashboard';
import MainMenuBar from '../navigation/MainMenuBar';

export default function MainMenu() {
  return (
    <>
      <MainMenuBar></MainMenuBar>
      <Typography
        variant="h2"
        align="center"
        color="white"
        sx={{
          backgroundColor: 'grey',
        }}
      >
        MATCH WITH SOMEONE
      </Typography>
      <br />
      <Typography align="center" component={'span'}>
        <Stack display={'block'} spacing={2} direction={'row'}>
          <Button
            variant={'contained'}
            onClick={() => console.log('CLICKED EASY')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 170,
              height: 75,
              backgroundColor: 'green',
            }}
          >
            EASY
          </Button>
          <Button
            variant={'contained'}
            onClick={() => console.log('CLICKED MEDIUM')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 230,
              height: 75,
              backgroundColor: 'orange',
            }}
          >
            MEDIUM
          </Button>
          <Button
            variant={'contained'}
            onClick={() => console.log('CLICKED HARD')}
            style={{ fontSize: '50px' }}
            sx={{
              width: 170,
              height: 75,
              backgroundColor: 'red',
            }}
          >
            HARD
          </Button>
        </Stack>
      </Typography>
      <br />
      <Dashboard></Dashboard>
    </>
  );
}
