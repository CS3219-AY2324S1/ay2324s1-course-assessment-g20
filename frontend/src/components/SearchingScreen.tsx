import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface PopupProps {
  title: string;
  difficulty: string;
  openScreen: boolean;
  setCloseScreen: () => void;
}

export default function WaitingScreen({ title, difficulty, openScreen, setCloseScreen }: PopupProps) {
  const awaitSearch = "Would you like to search for a partner?";
  const searching = "Please wait while we try to find you a partner";
  const noMatch = "We could not find you a partner, would you like to search again?";

  // Usestate to display the current search status for a partner
  const [searchStatus, setSearchStatus] = useState(awaitSearch);

  // Usestate to handle the searching and cancelling of searching
  const [searchDisabled, setSearchDisabled] = useState(false);

  // Usestate to handle the time elapsed whilst searching for a partner
  const [timeWaited, setTimeWaited] = useState(0);

  useEffect(() => {
    let timer : number;
    if (searchDisabled) {
      timer = setInterval(() => {
        setTimeWaited(timeWaited + 1);
      }, 1000);

      if (timeWaited > 30) {
        setSearchStatus(noMatch);
        setSearchDisabled(false);
        setTimeWaited(0);
      }

      return () => clearInterval(timer);
    } 
  }, [searchDisabled, timeWaited]);

  // Functions to handle the searching and cancelling of searching for a partner
  const handleSearch = () => {
    setSearchDisabled(true);
    // Handle API call to Matching backend? Handle creation of websocket?
    setSearchStatus(searching);
  }

  const handleCancelSearch = () => {
    // Handle API call to cancel Matching backend?
    setCloseScreen();
  }

  return (
    <Dialog open={openScreen}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ fontSize: '26px', color: 'black' }}>{title + difficulty}</DialogTitle>
      </div>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>
        {searchStatus}
      </DialogContent>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>
        {searchDisabled && ("Time Elapsed: " + timeWaited + "s")}
      </DialogContent>
      <DialogContent style={{ fontSize: '30px', color: 'black' }}>
        <Typography align="center" component={'span'}>
          <Stack display={'block'} spacing={4} direction={'row'}>
            <Button
              variant={'contained'}
              onClick={handleSearch}
              disabled={searchDisabled}
              style={{ fontSize: '15px', marginLeft: 'auto' }}
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
              
              style={{ fontSize: '15px', marginLeft: 'auto' }}
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
