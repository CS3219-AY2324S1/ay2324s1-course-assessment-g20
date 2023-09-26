import { Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';

interface PopupProps {
  title: string;
  children: string;
  openPopup: boolean;
  setOpenPopup: () => void;
}

export default function Popup({ title, children, openPopup, setOpenPopup }: PopupProps) {
  return (
    <Dialog open={openPopup}>
      <DialogTitle style={{ justifyContent: 'space-between' }}>
        {title}
        <Button
          type="button"
          className="btn-close"
          onClick={setOpenPopup}
          aria-label="Close"
          style={{ fontSize: '15px' }}
          sx={{
            width: 0,
            height: 25,
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          X
        </Button>
      </DialogTitle>
      <DialogContent>
        {children.split('\n').map((child, key) => {
          return !child ? <br /> : <Typography key={key}>{child}</Typography>;
        })}
      </DialogContent>
    </Dialog>
  );
}
