import { Button, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { getMatchingTicket } from '../api/matchingApi';
import { getDifficulties } from '../api/questionBankApi';
import { IDifficulty } from '../interfaces';
import { getMatchingWebSocket } from '../websocketUtils/matching';
import Dashboard from './Dashboard';

let ws: WebSocket;

const backgroundColors = {
  Easy: 'green',
  Medium: 'orange',
  Hard: 'red',
};

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

  const handleMatch = async (difficulty: IDifficulty) => {
    // TODO: Redirect to match page
    if (ws === undefined || ws.readyState === WebSocket.CLOSED) {
      await getMatchingTicket().then((response) => {
        ws = getMatchingWebSocket(response.data.id);
      });

      ws.onopen = () => {
        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.event === 'match') {
            // TODO: Redirect to collaboration code editor page
            console.log(data.data);
            ws.close();
          }
        };
      };
    }
    await getMatchingTicket().then((response) => {
      ws.send(
        JSON.stringify({
          event: 'get_match',
          data: { ticket: response.data.id, questionDifficulty: difficulty._id },
        }),
      );
    });
  };

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
          {difficulties.map((difficulty) => (
            <Button
              key={difficulty._id}
              variant={'contained'}
              onClick={() => handleMatch(difficulty)}
              style={{ fontSize: '50px' }}
              sx={{
                height: 75,
                backgroundColor: backgroundColors[difficulty.name as keyof typeof backgroundColors],
              }}
            >
              {difficulty.name}
            </Button>
          ))}
        </Stack>
      </Typography>
      <br />
      <Dashboard></Dashboard>
    </>
  );
}
