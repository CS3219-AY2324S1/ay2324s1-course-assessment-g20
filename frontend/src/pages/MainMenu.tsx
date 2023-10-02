import { Button, Stack, Typography } from '@mui/material';
import { requestBackend } from '../api/requestBackend';
import { BACKEND_WEBSOCKET_HOST, HttpRequestMethod } from '../utils/constants';
import Dashboard from './Dashboard';

let ws: WebSocket;

export default function MainMenu() {
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
            onClick={async () => {
              if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
                await requestBackend({
                  url: '/matching/ws-ticket',
                  method: HttpRequestMethod.GET,
                }).then((ticket: any) => {
                  console.log(ticket.data.ticket);
                  ws = new WebSocket(BACKEND_WEBSOCKET_HOST + '/matching?ticket=' + ticket.data.ticket);

                }
                );
                ws.onmessage = (event) => {
                  const data = JSON.parse(event.data);
                  if (data.event === 'match') {
                    console.log(data.data);
                  }
                }
              }

              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then((response: any) => {
                console.log(response.data);
                ws.send(JSON.stringify({ event: 'get_match', data: { userId: response.data.id!, questionDifficulty: 1 } }));
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
            onClick={async () => {
              if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
                await requestBackend({
                  url: '/matching/ws-ticket',
                  method: HttpRequestMethod.GET,
                }).then((ticket: any) => {
                  console.log(ticket.data.ticket);
                  ws = new WebSocket(BACKEND_WEBSOCKET_HOST + '/matching?ticket=' + ticket.data.ticket);

                }
                );
                ws.addEventListener('match', console.log)
              }

              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then((response: any) => {
                ws.send(JSON.stringify({ event: 'get_match', data: { userId: response.data.id!, questionDifficulty: 2 } }));
              }
              );
            }}
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
            onClick={async () => {
              if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
                await requestBackend({
                  url: '/matching/ws-ticket',
                  method: HttpRequestMethod.GET,
                }).then((ticket: any) => {
                  console.log(ticket.data.ticket);
                  ws = new WebSocket(BACKEND_WEBSOCKET_HOST + '/matching?ticket=' + ticket.data.ticket);

                }
                );
                ws.addEventListener('match', console.log)
              }
              requestBackend({
                url: '/question/get-user',
                method: HttpRequestMethod.GET,
              }).then((response: any) => {
                ws.send(JSON.stringify({ event: 'get_match', data: { userId: response.data.id!, questionDifficulty: 3 } }));
              }
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
