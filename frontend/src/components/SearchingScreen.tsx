import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDifficulty } from '../@types/question';
import { useSnackbar } from 'notistack';
import {
  getMatchingWebSocket,
  sendWsMessage,
  setWebsocketEventCallback as setWebsocketMessageEventCallback,
} from '../utils/websocketUtils';
let ws: WebSocket;

interface PopupProps {
  title: string;
  difficulty: IDifficulty;
  openScreen: boolean;
  setCloseScreen: () => void;
}

export default function WaitingScreen({
  title,
  difficulty,
  openScreen,
  setCloseScreen,
}: PopupProps) {
  const awaitSearch = 'Would you like to search for a partner?';
  const searching = 'Please wait while we try to find you a partner';
  const noMatch = 'We could not find you a partner, would you like to search again?';
  const matchFound = 'We found you a partner, we will redirect you to the collaborative space!';
  const { enqueueSnackbar } = useSnackbar();

  // Usestate to display the current search status for a partner
  const [searchStatus, setSearchStatus] = useState(awaitSearch);

  // Usestate to handle the searching and cancelling of searching
  const [isSearching, setIsSearching] = useState(false);

  // Usestate to handle the time elapsed whilst searching for a partner
  const [timeWaited, setTimeWaited] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let timer: number;
    if (isSearching) {
      timer = setInterval(() => {
        setTimeWaited(timeWaited + 1);
      }, 1000);

      if (ws === undefined || ws.readyState === ws.CLOSED) {
        setSearchStatus(noMatch);
        setIsSearching(false);
        setTimeWaited(0);
      }

      return () => clearInterval(timer);
    }
  }, [isSearching, timeWaited]);

  const handleMatchFound = (sessionId: string) => {
    handleCancelSearch();
    setSearchStatus(matchFound);
    enqueueSnackbar(matchFound, { variant: 'success' });
    navigate(`/session/${sessionId}`);
  };

  const handleWebsocketOpen = () => {
    sendWsMessage(ws, { questionDifficulty: difficulty._id }, 'get_match');
    setWebsocketMessageEventCallback(ws, 'match', (data: { sessionId: string }) =>
      handleMatchFound(data.sessionId),
    );
  };

  // Functions to handle the searching and cancelling of searching for a partner
  const handleSearch = async () => {
    ws = await getMatchingWebSocket();

    ws.onopen = handleWebsocketOpen;

    setIsSearching(true);
    setSearchStatus(searching);
  };

  const handleCancelSearch = () => {
    if (ws !== undefined && ws.readyState !== ws.CLOSED) {
      ws.close();
    }
    setCloseScreen();
  };

  return (
    <Dialog open={openScreen}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ fontSize: '26px', color: 'black' }}>
          {title + difficulty.name}
        </DialogTitle>
      </div>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>{searchStatus}</DialogContent>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>
        {isSearching && 'Time Elapsed: ' + timeWaited + 's'}
      </DialogContent>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>
        <Typography align="center" component={'span'}>
          <Stack
            justifyContent={'center'}
            alignItems={'center'}
            spacing={2}
            direction={{ xs: 'column', sm: 'row' }}
          >
            <Button
              variant={'contained'}
              onClick={handleSearch}
              disabled={isSearching}
              style={{ fontSize: '15px' }}
              sx={{
                width: 80,
                height: 50,
                backgroundColor: 'green',
                color: 'white',
              }}
            >
              Search
            </Button>
            <Button
              variant={'contained'}
              onClick={handleCancelSearch}
              style={{ fontSize: '15px' }}
              sx={{
                width: 80,
                height: 50,
                backgroundColor: 'red',
                color: 'white',
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
