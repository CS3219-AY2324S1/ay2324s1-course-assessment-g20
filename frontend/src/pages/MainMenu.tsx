import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getDifficulties } from '../api/questionBankApi';
import { requestBackend } from '../api/requestBackend';
import { IDifficulty } from '../interfaces';
import { BACKEND_WEBSOCKET_HOST, HttpRequestMethod } from '../utils/constants';
import Dashboard from './Dashboard';

let ws: WebSocket;

export default function MainMenu() {

  const [difficulties, setDifficulties] = useState<IDifficulty[]>([]);

  useEffect(() => {
    // Fetch difficulties from API
    getDifficulties()
      .then((response) => {
        setDifficulties(response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

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
          {
            difficulties.map((difficulty) => (
              <Button
                key={difficulty._id}
                variant={'contained'}
                onClick={async () => {
                  // TODO: Redirect to match page
                  if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
                    await requestBackend({
                      url: '/matching/ws-ticket',
                      method: HttpRequestMethod.GET,
                    }).then((ticket: any) => {
                      ws = new WebSocket(BACKEND_WEBSOCKET_HOST + '/matching?ticket=' + ticket.data.ticket);
                    }
                    )
                    ws.onmessage = (event) => {
                      const data = JSON.parse(event.data);
                      if (data.event === 'match') {
                        // TODO: Redirect to collaboration code editor page
                        console.log(data.data);
                        ws.close();
                      }
                    }
                  }
                  requestBackend({
                    url: '/question/get-user',
                    method: HttpRequestMethod.GET,
                  }).then((response: any) => {
                    ws.send(JSON.stringify({ event: 'get_match', data: { userId: response.data.id!, questionDifficulty: difficulty._id } }));
                  }
                  );
                }}
                style={{ fontSize: '50px' }}
                sx={{
                  height: 75,
                  backgroundColor: difficulty.name === 'Easy' ? 'green' : difficulty.name === 'Medium' ? 'orange' : 'red',
                }}
              >
                {difficulty.name}
              </Button>
            ))
          }
        </Stack>
      </Typography>
      <br />
      <Dashboard></Dashboard>
    </>
  );
}
