import { Button, Stack, Typography } from '@mui/material';
import { io, Socket } from 'socket.io-client';
import { requestBackend } from '../api/requestBackend';
import { HttpRequestMethod } from '../utils/constants';
import Dashboard from './Dashboard';
let socket: Socket = io('http://localhost:4000');

export default function MainMenu() {

  // on receive emit, console.log
  socket.on('match', (data: any) => {
    console.log(data);
  });


  return (
    <>
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
            onClick={() => {
              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then(response => {
                console.log(socket.connected);
                if (socket.disconnected) {
                  socket.connect();
                }
                socket.emit('get_match', { userId: response.data.id!, questionDifficulty: 1 }, (data: any) => {
                  console.log(data);
                })
              }
              );
            }}
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
            onClick={() => {
              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then(response =>
                socket.emit('get_match', { userId: response.data.id!, questionDifficulty: 2 }, (data: any) => {
                  console.log(data);
                })
              );
            }

            }
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
            onClick={() => {
              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then(response =>
                socket.emit('get_match', { userId: response.data.id!, questionDifficulty: 3 }, (data: any) => {
                  console.log(data);
                })
              );
            }}
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
