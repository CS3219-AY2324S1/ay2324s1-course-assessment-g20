import { Button, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { useEffect, useState } from 'react';

interface PopupProps {
  title: string;
  difficulty: string;
  openPopup: boolean;
  setOpenPopup: () => void;
}

export default function WaitingScreen({ title, difficulty, openPopup, setOpenPopup }: PopupProps) {
  // Usestate and functions to handle the timer of the loading screen
  const [startTime, setStartTime] = useState(+new Date().getTime());
  const resetStartTime = () => {
    setStartTime(+new Date().getTime());
  };

  const timePassed = () => {
    const passedTime = Math.ceil((+new Date().getTime() - startTime) / 1000);

    if (passedTime > 30) {
      resetStartTime();
      return 'We could not find you a partner, retrying again';
    } else {
      return 'TIME ELAPSED: ' + passedTime + ' s';
    }
  };
  const [timeWaited, setTimeWaited] = useState(timePassed());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeWaited(timePassed());
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Dialog open={openPopup}>
      <div style={{ display: 'flex' }}>
        <DialogTitle style={{ fontSize: '26px', color: 'black' }}>{title + difficulty}</DialogTitle>
        <Button
          type="button"
          className="btn-close"
          onClick={setOpenPopup}
          aria-label="Close"
          style={{ fontSize: '15px', marginLeft: 'auto', color: 'red' }}
          sx={{
            width: 0,
            height: 50,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          X
        </Button>
      </div>
      <DialogContent dividers style={{ fontSize: '30px', color: 'black' }}>
        {timeWaited}
      </DialogContent>
    </Dialog>
  );
}
