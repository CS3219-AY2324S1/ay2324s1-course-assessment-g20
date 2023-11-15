import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IDifficulty } from '../@types/question';
import { useSnackbar } from 'notistack';
import { getMatchingWebSocket, sendWsMessage } from '../utils/websocketUtils';
let ws: WebSocket;

interface PopupProps {
  difficulty: IDifficulty;
  openScreen: boolean;
  setCloseScreen: () => void;
}

export default function WaitingScreen({ difficulty, openScreen, setCloseScreen }: PopupProps) {
  const searching = 'Searching for a partner...';
  const noMatch = 'We could not find you a partner, would you like to search again?';
  const matchFound = 'Partner found! Taking you to the collaborative space...';
  const getSearchStatusWithDifficulty = (difficulty: IDifficulty) =>
    `Find someone to do a ${difficulty.name.toLowerCase()} difficulty question with you?`;
  const { enqueueSnackbar } = useSnackbar();

  // Usestate to display the current search status for a partner
  const [searchStatus, setSearchStatus] = useState(getSearchStatusWithDifficulty(difficulty));

  // Usestate to handle the searching and cancelling of searching
  const [isSearching, setIsSearching] = useState(false);

  // Usestate to handle the time elapsed whilst searching for a partner
  const [timeWaited, setTimeWaited] = useState(0);

  const { palette } = useTheme();
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

  useEffect(() => {
    setSearchStatus(getSearchStatusWithDifficulty(difficulty));
  }, [difficulty]);

  const handleMatchFound = (sessionId: string) => {
    handleCancelSearch();
    setSearchStatus(matchFound);
    enqueueSnackbar(matchFound, { variant: 'success' });
    navigate(`/session/${sessionId}`);
  };

  const handleWebsocketOpen = () => {
    sendWsMessage(ws, { questionDifficulty: difficulty._id }, 'get_match');
    ws.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.event === 'match') {
        handleMatchFound(data.data.sessionId);
      }
    };
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
    <Dialog open={openScreen} onClose={handleCancelSearch} fullWidth>
      <DialogTitle style={{ fontSize: '26px', color: 'black', textAlign: 'center' }}>
        {searchStatus}
      </DialogTitle>
      <DialogContent>
        {isSearching && (
          <Typography pb={3} textAlign="center">
            {`Time Elapsed: ${timeWaited}s`}
          </Typography>
        )}
        <Box>
          <Stack spacing={12} direction={'row'}>
            <Button
              variant={'contained'}
              fullWidth
              onClick={handleSearch}
              disabled={isSearching}
              style={{ fontSize: '15px', textAlign: 'center' }}
              sx={{
                backgroundColor: palette.success.main,
                '&:hover': {
                  backgroundColor: palette.success.dark,
                },
                color: 'white',
              }}
            >
              Search
            </Button>
            <Button
              variant={'contained'}
              fullWidth
              onClick={handleCancelSearch}
              style={{ fontSize: '15px', textAlign: 'center' }}
              sx={{
                backgroundColor: palette.error.main,
                '&:hover': {
                  backgroundColor: palette.error.dark,
                },
                color: 'white',
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
